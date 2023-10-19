import nodeSchedule from 'node-schedule';
import {
  PhoenixFactoryContract,
  PhoenixPairContract,
  SorobanTokenContract,
} from "@phoenix-protocol/contracts";
import { constants } from '@phoenix-protocol/utils';
import { FACTORY_ADDRESS } from '@phoenix-protocol/utils/build/constants';
import * as token from "./token/db";
import * as tokenHistory from "./tokenHistory/db";
import * as pair from "./pair/db";
import * as pairHistory from "./pairHistory/db";
import * as price from "./price";
import { Address } from "stellar-base";

export async function startFetch() {
  console.log("Starting fetch");

  const pairRes = await fetchPairs();
  fetchPrices();

  //create cronjob to fetch factory contract, its pairs, tokens and their prices every 15 minutes
  const job: nodeSchedule.Job = nodeSchedule.scheduleJob('*/15 * * * *', async () => {
    const pairRes = await fetchPairs();
    fetchPrices();

    tokenHistory.deleteOldEntries();
    pairHistory.deleteOldEntries();
  });
}

// Round down to nearest 15 minutes to make the timestamps easier to work with
function roundDownToNearest15Minutes(): number {
  const currentDate = new Date();
  const minutes = currentDate.getMinutes();
  const remainder = minutes % 15;

  if (remainder > 0) {
    currentDate.setMinutes(minutes - remainder);
  }
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  return currentDate.getTime();
}

// Fetch token info from chain
async function fetchTokenInfo(tokenAddress: string) {
  const TokenContract = new SorobanTokenContract.Contract({
    contractId: tokenAddress,
    networkPassphrase: constants.NETWORK_PASSPHRASE,
    rpcUrl: constants.RPC_URL,
  });

  return {
    name: await TokenContract.name(),
    symbol: await TokenContract.symbol(),
    decimals: await TokenContract.decimals(),
  }
}

// Use Pair Contract to fetch pool and token info from chain
async function fetchPool(poolAddress: Address) {
  try {
    const PairContract = new PhoenixPairContract.Contract({
      contractId: poolAddress.toString(),
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL,
    });

    // Fetch pool config and info from chain
    const [pairConfigRes, pairInfoRes] = await Promise.all([
      PairContract.queryConfig(),
      PairContract.queryPoolInfo(),
    ]);

    // When results ok...
    if (pairConfigRes?.isOk() && pairInfoRes?.isOk()) {
      const pairConfig = pairConfigRes.unwrap();
      const pairInfo = pairInfoRes.unwrap();

      //fetch token info from chain
      const tokenAInfo = await fetchTokenInfo(pairInfo.asset_a.address.toString());
      const tokenBInfo = await fetchTokenInfo(pairInfo.asset_b.address.toString());
      const tokenSharedInfo = await fetchTokenInfo(pairInfo.asset_lp_share.address.toString());

      // create token entries if not exist in database
      const tokenA = await token.getOrCreate(pairInfo.asset_a.address.toString(), tokenAInfo);
      const tokenB = await token.getOrCreate(pairInfo.asset_b.address.toString(), tokenBInfo);
      const tokenShare = await token.getOrCreate(pairInfo.asset_lp_share.address.toString(), tokenSharedInfo);

      const existingPair = await pair.getByAddress(poolAddress.toString());
      let pairId = existingPair?.id;

      // create pair entry if not exist in database
      if(!pairId) {
        const newPair = await pair.create({
          address: poolAddress.toString(),
          assetA: {
            connect: {
              id: tokenA.id,
            }
          },
          assetB: {
            connect: {
              id: tokenB.id,
            }
          },
          assetShare: {
            connect: {
              id: tokenShare.id,
            }
          },
        });

        pairId = newPair.id;
      }

      // create pair history entry
      const newPairHistory = await pairHistory.create({
        createdAt: roundDownToNearest15Minutes(),
        assetAAmount: pairInfo.asset_a.amount,
        assetBAmount: pairInfo.asset_b.amount,
        assetShareAmount: pairInfo.asset_lp_share.amount,
        pair: {
          connect: {
            id: pairId,
          }
        },
      });

      return newPairHistory
    }
  } catch (e) {
    // If pool not found, set poolNotFound to true
    console.log(e);
  }
}

async function fetchPrices() {
  //array of tokens with known prices
  const targetArray = ["Stellar"];

  let targetPrices = [];
  for(const target of targetArray) {
    const targetPrice = await price.getPrices(target);
    targetPrices.push(targetPrice);
  }
  
  // get pairs and parse them to easier format
  const pairEntries = await pair.getAll();
  const pairs = pairEntries.map((pair: any) => ({
    id: pair.id,
    ratio: Number(pair.assetAAmount / pair.assetBAmount), //doesnt work with mock pairs
    tokenA: pair.assetA.symbol,
    tokenB: pair.assetB.symbol,
  }));

  for(const pair of pairs) {
    // calculate token prices for token A and B
    const tokenPrices = [
      price.calculateTokenValue(pair.tokenA, pairs, targetPrices), 
      price.calculateTokenValue(pair.tokenB, pairs, targetPrices)
    ];
    
    // loop for token a and b
    for(const tokenPrice of tokenPrices) {
      if(tokenPrice !== undefined) {
        const _token = await token.getBySymbol(pair.tokenA);
        
        // create token history entry
        const tokenEntry = await tokenHistory.create({
          createdAt: roundDownToNearest15Minutes(),
          price: tokenPrice,
          token: {
            connect: {
              id: _token.id,
            }
          },
        });

        continue;
      }
    }
  }
}

// Use Factory Contract to fetch pools from chain
async function fetchPairs() {
  const FactoryContract = new PhoenixFactoryContract.Contract({
    contractId: FACTORY_ADDRESS,
    networkPassphrase: constants.NETWORK_PASSPHRASE,
    rpcUrl: constants.RPC_URL,
  });

  const pools = await FactoryContract.queryPools({});

  //loop through pools and fetch pool info from chain
  const poolWithData = pools
      ? await Promise.all(
          pools.unwrap().map(async (pool: Address) => {
            return await fetchPool(pool);
          })
        )
      : [];

  return poolWithData;
}

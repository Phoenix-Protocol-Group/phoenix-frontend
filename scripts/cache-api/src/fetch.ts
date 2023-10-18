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
  return;

  const job: nodeSchedule.Job = nodeSchedule.scheduleJob('*/15 * * * *', async () => {
    const pairRes = await fetchPairs();

    tokenHistory.deleteOldEntries();
    pairHistory.deleteOldEntries();
  });
}

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

      const tokenAInfo = await fetchTokenInfo(pairInfo.asset_a.address.toString());
      const tokenBInfo = await fetchTokenInfo(pairInfo.asset_b.address.toString());
      const tokenSharedInfo = await fetchTokenInfo(pairInfo.asset_lp_share.address.toString());

      const tokenA = await token.getOrCreate(pairInfo.asset_a.address.toString(), tokenAInfo);
      const tokenB = await token.getOrCreate(pairInfo.asset_b.address.toString(), tokenBInfo);
      const tokenShare = await token.getOrCreate(pairInfo.asset_lp_share.address.toString(), tokenSharedInfo);

      const existingPair = await pair.getByAddress(poolAddress.toString());
      let pairId = existingPair?.id;

      if(!pairId) {
        const newPair = await pair.create({
          address: poolAddress.toString(),
          assetA: {
            connect: {
              id: tokenA.id,
            }
          },
          assetAAmount: pairInfo.asset_a.amount,
          assetB: {
            connect: {
              id: tokenB.id,
            }
          },
          assetBAmount: pairInfo.asset_b.amount,
          assetShare: {
            connect: {
              id: tokenShare.id,
            }
          },
          assetShareAmount: pairInfo.asset_lp_share.amount,
        });

        pairId = newPair.id;
      }

      const newPairHistory = await pairHistory.create({
        createdAt: roundDownToNearest15Minutes(),
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
  const pairEntries = await pair.getAll();
  const pairs = pairEntries.map((pair) => ({
    id: pair.id,
    ratio: 0, //Number(pair.assetAAmount / pair.assetBAmount), //doesnt work with mock pairs
    tokenAAddress: pair.assetA.address,
    tokenBAddress: pair.assetB.address,
  }));

  let pricedTokens: string[] = [];

  for(const pair of pairs) {
    console.log(pair);
  }

  return;

  const testPair = {
    id: 1,
    ratio: 0.5,
    tokenAAddress: "foo",
    tokenBAddress: "bar",
  };

  const targetArray = ["stellar"];

  const bestPath = price.findBestPath(testPair, pairs, targetArray);
  console.log(bestPath);
}

async function fetchPairs() {
  const FactoryContract = new PhoenixFactoryContract.Contract({
    contractId: FACTORY_ADDRESS,
    networkPassphrase: constants.NETWORK_PASSPHRASE,
    rpcUrl: constants.RPC_URL,
  });

  const pools = await FactoryContract.queryPools({});

  console.log(pools.unwrap())

  const poolWithData = pools
      ? await Promise.all(
          pools.unwrap().map(async (pool: Address) => {
            return await fetchPool(pool);
          })
        )
      : [];

  return poolWithData;
}

import nodeSchedule from 'node-schedule';
import {
  PhoenixFactoryContract,
  PhoenixPairContract,
  SorobanTokenContract,
} from "@phoenix-protocol/contracts";
import { constants } from '@phoenix-protocol/utils';
import { FACTORY_ADDRESS } from '@phoenix-protocol/utils/build/constants';
import * as db from "./db";
import { Address } from "stellar-base";

export function startFetch() {
  console.log("Starting fetch");
  fetchPairs();

  const job: nodeSchedule.Job = nodeSchedule.scheduleJob('*/15 * * * *', async () => {
    const pairRes = await fetchPairs();
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

async function fetchTokenInfo(tokenAddress: Address) {
  const TokenContract = new SorobanTokenContract.Contract({
    contractId: tokenAddress.toString(),
    networkPassphrase: constants.NETWORK_PASSPHRASE,
    rpcUrl: constants.RPC_URL,
  });
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

      const tokenA = await db.getOrCreateToken(pairInfo.asset_a.address.toString());
      const tokenB = await db.getOrCreateToken(pairInfo.asset_b.address.toString());
      const tokenShare = await db.getOrCreateToken(pairInfo.asset_lp_share.address.toString());

      const newPair = await db.createPair({
        timestamp: roundDownToNearest15Minutes(),
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
    }
  } catch (e) {
    // If pool not found, set poolNotFound to true
    console.log(e);
  }
}

async function fetchPairs() {
  const FactoryContract = new PhoenixFactoryContract.Contract({
    contractId: FACTORY_ADDRESS,
    networkPassphrase: constants.NETWORK_PASSPHRASE,
    rpcUrl: constants.RPC_URL,
  });

  const pools = await FactoryContract.queryPools({});

  const poolWithData = pools
      ? await Promise.all(
          pools.unwrap().map(async (pool: Address) => {
            return await fetchPool(pool);
          })
        )
      : [];

  return poolWithData;
}

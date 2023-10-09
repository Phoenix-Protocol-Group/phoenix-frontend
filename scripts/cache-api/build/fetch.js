"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startFetch = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const contracts_1 = require("@phoenix-protocol/contracts");
const utils_1 = require("@phoenix-protocol/utils");
const constants_1 = require("@phoenix-protocol/utils/build/constants");
function startFetch() {
    const job = node_schedule_1.default.scheduleJob('*/10 * * * * *', async () => {
        const pairRes = await fetchPairs();
    });
}
exports.startFetch = startFetch;
async function fetchTokenInfo(tokenAddress) {
    const TokenContract = new contracts_1.SorobanTokenContract.Contract({
        contractId: tokenAddress.toString(),
        networkPassphrase: utils_1.constants.NETWORK_PASSPHRASE,
        rpcUrl: utils_1.constants.RPC_URL,
    });
}
async function fetchPool(poolAddress) {
    try {
        const PairContract = new contracts_1.PhoenixPairContract.Contract({
            contractId: poolAddress.toString(),
            networkPassphrase: utils_1.constants.NETWORK_PASSPHRASE,
            rpcUrl: utils_1.constants.RPC_URL,
        });
        // Fetch pool config and info from chain
        const [pairConfigRes, pairInfoRes] = await Promise.all([
            PairContract.queryConfig(),
            PairContract.queryPoolInfo(),
        ]);
        // When results ok...
        if ((pairConfigRes === null || pairConfigRes === void 0 ? void 0 : pairConfigRes.isOk()) && (pairInfoRes === null || pairInfoRes === void 0 ? void 0 : pairInfoRes.isOk())) {
            const pairConfig = pairConfigRes.unwrap();
            const pairInfo = pairInfoRes.unwrap();
            console.log("config", pairConfig);
            console.log("info", pairInfo);
        }
    }
    catch (e) {
        // If pool not found, set poolNotFound to true
        console.log(e);
    }
}
async function fetchPairs() {
    console.log("fetching pairs");
    const FactoryContract = new contracts_1.PhoenixFactoryContract.Contract({
        contractId: constants_1.FACTORY_ADDRESS,
        networkPassphrase: utils_1.constants.NETWORK_PASSPHRASE,
        rpcUrl: utils_1.constants.RPC_URL,
    });
    const pools = await FactoryContract.queryPools({});
    const poolWithData = pools
        ? await Promise.all(pools.unwrap().map(async (pool) => {
            return await fetchPool(pool);
        }))
        : [];
    return "SUCCESS";
}

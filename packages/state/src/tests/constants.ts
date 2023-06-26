import { Account, Networks, Server } from "soroban-client";

export type u32 = number;
export type i32 = number;
export type u64 = bigint;
export type i64 = bigint;
export type u128 = bigint;
export type i128 = bigint;
export type u256 = bigint;
export type i256 = bigint;
export type Address = string;
export type Option<T> = T | undefined;
export type Typepoint = bigint;
export type Duration = bigint;
export type Timestamp = bigint;

// The server we will connect to.
export const server: Server = new Server("https://rpc-futurenet.stellar.org/");

// The passphrase of the Stellar network that we will be using.
export const networkPassphrase: string = Networks.TESTNET;

// The source account that will be used to send the payment.
export const source: Account = new Account(
  "GBUHRWJBXS4YAEOVDRWFW6ZC5LLF2SAOMATH4I6YOTZYHE65FQRFOKG2",
  "1"
);

export const contractIds = {
  pair: "b39b7afe36930c98d247fd203795d977bbef6f2fb617f1fe50532b45b10114ae",
  asset: "984af61b50b042c0dad2f30b369513b12bf4b2f0b705e0165fce57c2105b7523",
};

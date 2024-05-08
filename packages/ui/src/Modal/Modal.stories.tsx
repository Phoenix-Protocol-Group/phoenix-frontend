import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof Modal> = {
  title: "General/Modal",
  // @ts-ignore
  component: Modal,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof Modal>;

export const PoolSuccess: Story = {
  args: {
    open: true,
    type: "SUCCESS",
    setOpen: () => {},
    tokenTitles: ["Token A:", "Token B:"],
    tokens: [
      {
        name: "USDT",
        icon: "cryptoIcons/usdt.svg",
        amount: 100,
        category: "Stable",
        usdValue: 1 * 100,
      },
      {
        name: "USDC",
        icon: "cryptoIcons/usdc.svg",
        amount: 50,
        category: "Stable",
        usdValue: 1 * 50,
      },
    ],
    onButtonClick: () => {},
  },
};

export const SwapSuccess: Story = {
  args: {
    open: true,
    type: "SUCCESS",
    setOpen: () => {},
    tokenAmounts: [100, 50],
    tokenTitles: ["From:", "To:"],
    tokens: [
      {
        name: "PHO",
        icon: "cryptoIcons/pho.svg",
        amount: 100,
        category: "Stable",
        usdValue: 1 * 100,
      },
      {
        name: "USDC",
        icon: "cryptoIcons/usdc.svg",
        amount: 50,
        category: "Stable",
        usdValue: 1 * 50,
      },
    ],
    onButtonClick: () => {},
  },
};

export const TokenSingle: Story = {
  args: {
    open: true,
    type: "SUCCESS",
    setOpen: () => {},
    tokenTitles: ["Provided Token:"],
    tokens: [
      {
        name: "USDT",
        icon: "cryptoIcons/usdt.svg",
        amount: 100,
        category: "Stable",
        usdValue: 1 * 100,
      },
    ],
    onButtonClick: () => {},
  },
};

export const Error: Story = {
  args: {
    open: true,
    type: "ERROR",
    setOpen: () => {},
    description: `       0: [Diagnostic Event] contract:CC2SBQPA2RYC6U7QBR2EEV4CDCQUD2LOIQ7WVJHL3AU6JPUJYIFETARQ, topics:[error, Error(Contract, #1)], data:"escalating error to VM trap from failed host function call: call"
    1: [Diagnostic Event] contract:CC2SBQPA2RYC6U7QBR2EEV4CDCQUD2LOIQ7WVJHL3AU6JPUJYIFETARQ, topics:[error, Error(Contract, #1)], data:["contract call failed", swap, [GAFZL4ET65XLKSAZBFVWSPFRQCMKDQR3VXNT6RAOO4325PNFRSPCJQL6, CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC, 1000000000000, Void, 100]]
    2: [Failed Diagnostic Event (not emitted)] contract:CCXZ2DKVUXBSFBBEUTKRQPFRAINWURQFJ6J7UCKY22VBDZUX5RV7DIK7, topics:[log], data:["VM call trapped with HostError", swap, Error(Contract, #1)]
    3: [Failed Diagnostic Event (not emitted)] contract:CCXZ2DKVUXBSFBBEUTKRQPFRAINWURQFJ6J7UCKY22VBDZUX5RV7DIK7, topics:[error, Error(Contract, #1)], data:"escalating error to VM trap from failed host function call: fail_with_error"
    4: [Failed Diagnostic Event (not emitted)] contract:CCXZ2DKVUXBSFBBEUTKRQPFRAINWURQFJ6J7UCKY22VBDZUX5RV7DIK7, topics:[error, Error(Contract, #1)], data:["failing with contract error", 1]
    5: [Diagnostic Event] contract:CC2SBQPA2RYC6U7QBR2EEV4CDCQUD2LOIQ7WVJHL3AU6JPUJYIFETARQ, topics:[fn_call, Bytes(af9d0d55a5c3228424a4d5183cb1021b6a46054f93fa0958d6aa11e697ec6bf1), swap], data:[GAFZL4ET65XLKSAZBFVWSPFRQCMKDQR3VXNT6RAOO4325PNFRSPCJQL6, CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC, 1000000000000, Void, 100]
    6: [Diagnostic Event] contract:CADJ3ZNL2RK3RNGHTXHKQ52HAKKD3464TOR7GPFFXJZXBK5HQNOTXOGT, topics:[fn_return, query_for_pool_by_token_pair], data:CCXZ2DKVUXBSFBBEUTKRQPFRAINWURQFJ6J7UCKY22VBDZUX5RV7DIK7
    7: [Diagnostic Event] contract:CC2SBQPA2RYC6U7QBR2EEV4CDCQUD2LOIQ7WVJHL3AU6JPUJYIFETARQ, topics:[fn_call, Bytes(069de5abd455b8b4c79dcea8774702943df3dc9ba3f33ca5ba7370aba7835d3b), query_for_pool_by_token_pair], data:[CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC, CCBC7GVI6JWO3PFPSMQ6ZQTKUYKBBKUY7BIT5JNMX3GO6FZPE5CQDUBR]
    8: [Diagnostic Event] topics:[fn_call, Bytes(b520c1e0d4702f53f00c7442578218a141e96e443f6aa4ebd829e4be89c20a49), swap], data:[GAFZL4ET65XLKSAZBFVWSPFRQCMKDQR3VXNT6RAOO4325PNFRSPCJQL6, [{ask_asset: CCBC7GVI6JWO3PFPSMQ6ZQTKUYKBBKUY7BIT5JNMX3GO6FZPE5CQDUBR, offer_asset: CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC}], Void, 100, 1000000000000]
 
 Backtrace (newest first):
    0: soroban_env_host::budget::Budget::with_shadow_mode
    1: soroban_env_host::budget::Budget::with_shadow_mode
    2: soroban_env_host::host::error::<impl soroban_env_host::host::Host>::error
    3: <F as soroban_wasmi::func::into_func::IntoFunc<T,(soroban_wasmi::func::caller::Caller<T>,T1,T2,T3),R>>::into_func::{{closure}}
    4: soroban_wasmi::engine::EngineExecutor::execute_wasm_func`,
    error: "foo",
  },
};

export const Loading: Story = {
  args: {
    open: true,
    type: "LOADING",
    setOpen: () => {},
    description: "Transaction broadcasting...",
  },
};

export const LoadingSwap: Story = {
  args: {
    open: true,
    type: "LOADING_SWAP",
    tokens: [
      {
        name: "USDT",
        icon: "cryptoIcons/usdt.svg",
        amount: 100,
        category: "Stable",
        usdValue: 1 * 100,
      },
      {
        name: "USDC",
        icon: "cryptoIcons/usdc.svg",
        amount: 50,
        category: "Stable",
        usdValue: 1 * 50,
      },
    ],
    setOpen: () => {},
    description: "Transaction broadcasting...",
  },
};

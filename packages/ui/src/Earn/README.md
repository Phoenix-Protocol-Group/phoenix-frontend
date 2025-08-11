# Multi-Provider Strategy System

This document outlines the changes made to support multiple strategy providers (like Blend) with different reward tokens in the Phoenix frontend.

## Overview

The earn page has been restructured to support multiple providers with different reward tokens. Instead of showing all strategies in a single table, strategies are now grouped by provider with clear separation and branding.

## Key Changes

### 1. Updated Strategy Types (`packages/strategies/src/types.ts`)

- Added provider metadata fields to `StrategyMetadata`:
  - `providerName`: Display name for the provider
  - `providerIcon`: Icon for the provider
  - `providerDomain`: Domain for the provider

### 2. Provider Strategy Grouping (`packages/ui/src/Earn/utils/strategyUtils.ts`)

- `groupStrategiesByProvider()`: Groups strategies by provider ID
- `getProviderRewardsSummary()`: Calculates reward summary supporting multiple tokens
- `StrategyProvider` interface: Defines grouped provider data structure

### 3. Updated YieldSummary Component (`packages/ui/src/Earn/YieldSummary/YieldSummary.tsx`)

- Now supports multiple reward tokens (array instead of single number)
- Displays each reward token with its icon and amount
- Updated interface: `claimableRewards: { token: string; icon: string; amount: number }[]`

### 4. New ProviderStrategyGroup Component (`packages/ui/src/Earn/ProviderStrategyGroup/`)

- Displays strategies grouped by provider
- Shows provider branding (logo, name, description)
- Displays provider stats (TVL, average APR, user stakes, rewards)
- Contains the strategy table for that provider
- Responsive design with mobile support

### 5. Updated EarnPage (`packages/ui/src/Earn/EarnPage.tsx`)

- Uses provider-grouped display instead of single table
- Shows separate sections for each provider
- Updated mock data to include both Phoenix and Blend strategies

### 6. Phoenix Strategy Updates

- Updated all Phoenix strategy files to include provider metadata
- `pho-usdc.liquidity.ts`, `xlm-pho.liquidity.ts`, `xlm-usdc.liquidity.ts`

### 7. Blend Integration Preparation (`packages/strategies/src/blend/`)

- Created base interfaces and classes for Blend integration
- `BaseBlendStrategy`: Abstract base class for lending strategies
- `BlendLendingStrategy`: Interface defining Blend-specific methods
- Template strategy implementations for USDC and XLM lending
- `BlendProvider`: Provider class for Blend strategies
- **Note**: All Blend strategies are templates that throw "Not implemented" errors until actual Blend contracts are integrated

## Usage

### Adding a New Provider

1. Create a new provider folder in `packages/strategies/src/`
2. Implement strategies extending the base `Strategy` interface
3. Create a provider class implementing `StrategyProvider`
4. Add provider metadata to strategy metadata
5. Register provider in `packages/strategies/src/index.ts`

### Adding Strategies to Existing Provider

1. Create new strategy class in the provider's strategies folder
2. Ensure strategy metadata includes correct `providerId` and provider metadata
3. Add strategy to provider's strategy list

## Visual Changes

- **Provider Headers**: Each provider has a branded header with logo, stats, and description
- **Grouped Tables**: Strategies are grouped under their respective providers
- **Multiple Reward Tokens**: YieldSummary shows different reward tokens (PHO, BLND, etc.)
- **Provider Stats**: Each provider section shows total TVL, average APR, and user positions
- **Clear Separation**: Visual separation between providers for better UX

## Provider Examples

### Phoenix Protocol

- **Strategies**: XLM-USDC LP, XLM-PHO LP, PHO-USDC LP
- **Reward Token**: PHO
- **Categories**: Liquidity provision, LP staking

### Blend (Template)

- **Strategies**: USDC Lending, XLM Lending
- **Reward Token**: BLND
- **Categories**: Lending, borrowing

## Implementation Status

✅ **Completed:**

- Multi-provider UI structure
- Provider grouping logic
- Updated YieldSummary for multiple tokens
- Phoenix provider implementation
- Blend template structure

🔄 **Next Steps:**

- Integrate actual Blend contracts
- Implement Blend strategy logic
- Add more providers as needed
- Add filtering by provider
- Add provider-specific analytics

## File Structure

```
packages/
├── strategies/src/
│   ├── types.ts (updated with provider metadata)
│   ├── phoenix/ (existing Phoenix strategies)
│   └── blend/ (new Blend templates)
│       ├── baseBlendStrategy.ts
│       ├── provider.ts
│       ├── index.ts
│       └── strategies/
│           ├── usdc-lending.ts
│           └── xlm-lending.ts
└── ui/src/Earn/
    ├── utils/strategyUtils.ts (new)
    ├── ProviderStrategyGroup/ (new)
    ├── YieldSummary/ (updated)
    └── EarnPage.tsx (updated)
```

The system is now ready for easy integration of Blend or any other protocol strategies!

enum PoolContractError {
  SpreadExceedsLimit = 1,

  ProvideLiquiditySlippageToleranceTooHigh = 2,
  ProvideLiquidityAtLeastOneTokenMustBeBiggerThenZero = 3,

  WithdrawLiquidityMinimumAmountOfAOrBIsNotSatisfied = 4,
  SplitDepositBothPoolsAndDepositMustBePositive = 5,
  ValidateFeeBpsTotalFeesCantBeGreaterThen100 = 6,

  GetDepositAmountsMinABiggerThenDesiredA = 7,
  GetDepositAmountsMinBBiggerThenDesiredB = 8,
  GetDepositAmountsAmountABiggerThenDesiredA = 9,
  GetDepositAmountsAmountALessThenMinA = 10,
  GetDepositAmountsAmountBBiggerThenDesiredB = 11,
  GetDepositAmountsAmountBLessThenMinB = 12,
  TotalSharesEqualZero = 13,
  DesiredAmountsBelowOrEqualZero = 14,
  MinAmountsBelowZero = 15,
}

enum VestingContractError {
  Std = 0,
  VestingNotFoundForAddress = 1,
  AllowanceNotFoundForGivenPair = 2,
  MinterNotFound = 3,
  NoBalanceFoundForAddress = 4,
  NoConfigFound = 5,
  NoAdminFound = 6,
  MissingBalance = 7,
  VestingComplexityTooHigh = 8,
  TotalVestedOverCapacity = 9,
  InvalidTransferAmount = 10,
  CantMoveVestingTokens = 11,
  NotEnoughCapacity = 12,
  NotAuthorized = 13,
  NeverFullyVested = 14,
  VestsMoreThanSent = 15,
  InvalidBurnAmount = 16,
  InvalidMintAmount = 17,
  InvalidAllowanceAmount = 18,
  DuplicateInitialBalanceAddresses = 19,
  CurveError = 20,
  NoWhitelistFound = 21,
  NoTokenInfoFound = 22,
  NoVestingComplexityValueFound = 23,
  NoAddressesToAdd = 24,
  NoEnoughtTokensToStart = 25,
  NotEnoughBalance = 26,

  VestingBothPresent = 27,
  VestingNonePresent = 28,

  CurveConstant = 29,
  CurveSLNotDecreasing = 30,
}

function extractErrorCodeFromDiagnosticEvent(
  eventString: string
): number | null {
  const errorRegex = /Error\(Contract, #(\d+)\)/;
  const match = eventString.match(errorRegex);
  return match ? parseInt(match[1], 10) : null;
}

export function resolvePoolContractError(eventString: string): string {
  const errorCode = extractErrorCodeFromDiagnosticEvent(eventString);

  if(!errorCode) return eventString;

  switch (errorCode) {
    case PoolContractError.SpreadExceedsLimit:
      return "The slippage exceeds the allowable limit. In Phase 1 of the launch, it's capped at 1%. Please try to swap a lower amount of tokens.";
    case PoolContractError.ProvideLiquiditySlippageToleranceTooHigh:
      return "The slippage tolerance set for providing liquidity is too high.";
    case PoolContractError.ProvideLiquidityAtLeastOneTokenMustBeBiggerThenZero:
      return "To provide liquidity, at least one token amount must be greater than zero.";
    case PoolContractError.WithdrawLiquidityMinimumAmountOfAOrBIsNotSatisfied:
      return "The minimum amount of either token A or B is not satisfied for withdrawal.";
    case PoolContractError.SplitDepositBothPoolsAndDepositMustBePositive:
      return "Both pools and deposit amounts must be positive for a split deposit.";
    case PoolContractError.ValidateFeeBpsTotalFeesCantBeGreaterThen100:
      return "The total fees in basis points cannot be greater than 100.";
    case PoolContractError.GetDepositAmountsMinABiggerThenDesiredA:
      return "The minimum amount of token A is bigger than the desired amount.";
    case PoolContractError.GetDepositAmountsMinBBiggerThenDesiredB:
      return "The minimum amount of token B is bigger than the desired amount.";
    case PoolContractError.GetDepositAmountsAmountABiggerThenDesiredA:
      return "The amount of token A is bigger than the desired amount.";
    case PoolContractError.GetDepositAmountsAmountALessThenMinA:
      return "The amount of token A is less than the minimum required amount.";
    case PoolContractError.GetDepositAmountsAmountBBiggerThenDesiredB:
      return "The amount of token B is bigger than the desired amount.";
    case PoolContractError.GetDepositAmountsAmountBLessThenMinB:
      return "The amount of token B is less than the minimum required amount.";
    case PoolContractError.TotalSharesEqualZero:
      return "The total shares amount cannot be zero.";
    case PoolContractError.DesiredAmountsBelowOrEqualZero:
      return "The desired amounts must be above zero.";
    case PoolContractError.MinAmountsBelowZero:
      return "The minimum amounts cannot be below zero.";
    default:
      return "Unknown error.";
  }
}

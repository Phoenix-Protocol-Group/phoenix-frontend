enum ContractError {
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

function extractErrorCodeFromDiagnosticEvent(
  eventString: string
): number | null {
  const errorRegex = /Error\(Contract, #(\d+)\)/;
  const match = eventString.match(errorRegex);
  return match ? parseInt(match[1], 10) : null;
}

export function resolveContractError(eventString: string): string {
  const errorCode = extractErrorCodeFromDiagnosticEvent(eventString);

  switch (errorCode) {
    case ContractError.SpreadExceedsLimit:
      return "The spread exceeds the allowable limit.";
    case ContractError.ProvideLiquiditySlippageToleranceTooHigh:
      return "The slippage tolerance set for providing liquidity is too high.";
    case ContractError.ProvideLiquidityAtLeastOneTokenMustBeBiggerThenZero:
      return "To provide liquidity, at least one token amount must be greater than zero.";
    case ContractError.WithdrawLiquidityMinimumAmountOfAOrBIsNotSatisfied:
      return "The minimum amount of either token A or B is not satisfied for withdrawal.";
    case ContractError.SplitDepositBothPoolsAndDepositMustBePositive:
      return "Both pools and deposit amounts must be positive for a split deposit.";
    case ContractError.ValidateFeeBpsTotalFeesCantBeGreaterThen100:
      return "The total fees in basis points cannot be greater than 100.";
    case ContractError.GetDepositAmountsMinABiggerThenDesiredA:
      return "The minimum amount of token A is bigger than the desired amount.";
    case ContractError.GetDepositAmountsMinBBiggerThenDesiredB:
      return "The minimum amount of token B is bigger than the desired amount.";
    case ContractError.GetDepositAmountsAmountABiggerThenDesiredA:
      return "The amount of token A is bigger than the desired amount.";
    case ContractError.GetDepositAmountsAmountALessThenMinA:
      return "The amount of token A is less than the minimum required amount.";
    case ContractError.GetDepositAmountsAmountBBiggerThenDesiredB:
      return "The amount of token B is bigger than the desired amount.";
    case ContractError.GetDepositAmountsAmountBLessThenMinB:
      return "The amount of token B is less than the minimum required amount.";
    case ContractError.TotalSharesEqualZero:
      return "The total shares amount cannot be zero.";
    case ContractError.DesiredAmountsBelowOrEqualZero:
      return "The desired amounts must be above zero.";
    case ContractError.MinAmountsBelowZero:
      return "The minimum amounts cannot be below zero.";
    default:
      return "Unknown error.";
  }
}

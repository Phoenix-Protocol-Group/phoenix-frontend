// Enhanced error code extraction that supports multiple error formats
export function extractErrorCodeFromMessage(
  message: string
): { code: number; contractType?: string } | null {
  // Pattern 1: Standard Soroban error - "Error(Contract, #10)"
  const standardMatch = message.match(/Error\(Contract,\s*#(\d+)\)/);
  if (standardMatch) {
    return { code: parseInt(standardMatch[1], 10) };
  }

  // Pattern 2: Detailed error messages - "HostError: Error(Contract, #10)"
  const hostErrorMatch = message.match(
    /HostError:\s*Error\(Contract,\s*#(\d+)\)/
  );
  if (hostErrorMatch) {
    return { code: parseInt(hostErrorMatch[1], 10) };
  }

  // Pattern 3: Transaction simulation failed with diagnostic events
  // Example: "Transaction simulation failed: "HostError: Error(Contract, #300) Event log..."
  const simulationDetailedMatch = message.match(
    /Transaction simulation failed:\s*"?HostError:\s*Error\(Contract,\s*#(\d+)\)/i
  );
  if (simulationDetailedMatch) {
    return { code: parseInt(simulationDetailedMatch[1], 10) };
  }

  // Pattern 4: Error within event logs - look for error codes in event data
  const eventLogMatch = message.match(
    /topics:\[error,\s*Error\(Contract,\s*#(\d+)\)\]|data:.*?Error\(Contract,\s*#(\d+)\)|failing with contract error.*?(\d+)/i
  );
  if (eventLogMatch) {
    const errorCode = eventLogMatch[1] || eventLogMatch[2] || eventLogMatch[3];
    return { code: parseInt(errorCode, 10) };
  }

  // Pattern 5: Contract-specific error with contract name
  const contractSpecificMatch = message.match(
    /(\w+)(?:Contract)?.*?Error.*?#(\d+)/i
  );
  if (contractSpecificMatch) {
    return {
      code: parseInt(contractSpecificMatch[2], 10),
      contractType: contractSpecificMatch[1].toLowerCase(),
    };
  }

  // Pattern 6: Simple transaction simulation failed format
  const simulationMatch = message.match(
    /simulation failed.*?Error\(Contract,\s*#(\d+)\)/i
  );
  if (simulationMatch) {
    return { code: parseInt(simulationMatch[1], 10) };
  }

  return null;
}

// Contract error definitions organized by error code ranges
// This approach works better since multihop can throw pair errors, factory errors, etc.
// Note: Soroban token standard (SEP-41) uses panic-based error handling rather than numbered codes
const ERROR_CODE_DEFINITIONS: { [code: number]: string } = {
  // Note: Error codes 1-10 are reserved but not officially defined by SEP-41
  // The Soroban token standard uses panic! with descriptive messages instead of numbered codes
  // These are generic fallbacks for custom token implementations that might use numbered errors
  1: "There was an issue with your token transaction. Please check your balance and try again.",
  2: "You don't have permission to perform this action with these tokens.",
  3: "This token operation is currently restricted. Please try again later.",
  4: "The token amount you entered is not valid. Please enter a positive number.",
  5: "The token operation failed. Please check your inputs and try again.",
  6: "You've exceeded the spending allowance for these tokens.",
  7: "The requested token operation could not be completed.",
  8: "There was an issue with the token transaction. Please verify the details and try again.",
  9: "The token operation could not be processed. Please try again.",
  10: "You don't have enough tokens to complete this request. If you are using XLM, make sure you have enough XLM for reserves and trustlines.",

  // Phoenix Factory Contract Errors (100-112)
  100: "The selected token is not supported. Please choose a different token.",
  101: "This token pair already exists. You can find it in the pools section.",
  102: "You cannot create a pair with the same token twice. Please select two different tokens.",
  103: "The system is already set up and ready to use.",
  104: "The system is not ready yet. Please try again later.",
  105: "No administrator has been assigned to manage this system.",
  106: "You don't have permission to perform this action. Only administrators can do this.",
  107: "The new administrator is the same as the current one. No changes needed.",
  108: "This token pair doesn't exist yet. You may need to create it first.",
  109: "Too many accounts have been whitelisted. The limit has been reached.",
  110: "Your account is not approved for this action. Please contact support.",
  111: "The settings for this token pair haven't been configured yet.",
  112: "The settings for this token pair have already been set up.",

  // Phoenix Multihop Contract Errors (200-206)
  200: "The multi-step trading system is not ready yet. Please try again later.",
  201: "You need to specify a valid trading path. The path cannot be empty.",
  202: "You don't have enough tokens to complete this multi-step trade.",
  203: "The price moved too much during your multi-step trade. Try with higher slippage tolerance.",
  204: "One or more trading pools in your path don't have enough tokens available.",
  205: "There's an invalid token in your trading path. Please check your route.",
  206: "Your multi-step trade took too long and expired. Please try again.",

  // Phoenix Pair Contract Errors (300-332)
  300: "The price difference is too high for your safety. Try swapping a smaller amount or increase your slippage tolerance in settings.",
  301: "This trading pair is not ready yet. Please try again later.",
  302: "This trading pair is already set up and working.",
  303: "The slippage tolerance you set is too high for providing liquidity. Please lower it for your safety.",
  304: "You need to enter an amount greater than zero for at least one token to provide liquidity.",
  305: "The minimum amount you'll receive doesn't meet your requirements. Try adjusting your settings.",
  306: "Both pools and deposit amounts must be positive numbers to split your deposit.",
  307: "The total fees cannot be more than 100%. Please check the fee settings.",
  308: "The minimum amount of the first token is higher than what you want to provide.",
  309: "The minimum amount of the second token is higher than what you want to provide.",
  310: "You're trying to provide more of the first token than you intended.",
  311: "You're providing less of the first token than the minimum required.",
  312: "You're trying to provide more of the second token than you intended.",
  313: "You're providing less of the second token than the minimum required.",
  314: "The total shares amount cannot be zero. Please check your liquidity amounts.",
  315: "The amounts you want to provide must be greater than zero.",
  316: "The minimum amounts cannot be negative numbers.",
  317: "This pool doesn't have enough tokens available for your trade. Try a smaller amount.",
  318: "You don't have enough tokens in your wallet for this swap.",
  319: "This trading pair is currently inactive. Please try again later.",
  320: "You don't have permission to perform this action.",
  321: "There's something wrong with your swap settings. Please check and try again.",
  322: "This liquidity pool is empty. No trades can be made right now.",
  323: "You cannot provide liquidity with zero amounts. Please enter valid amounts.",
  324: "You're trying to withdraw more than your available shares allow.",
  325: "This trade would affect the price too much. Try a smaller amount.",
  326: "Your transaction took too long and expired. Please try again.",
  327: "The fee settings are incorrect. Please contact support.",
  328: "The ratio between tokens is outside acceptable limits.",
  329: "The pool has run out of tokens. Please try again later.",
  330: "The price moved too much during your transaction. Try again with higher slippage tolerance.",
  331: "You would receive less tokens than expected. Try a smaller trade or higher slippage.",
  332: "This swap would result in a negative balance, which is not allowed.",

  // Phoenix Stake Contract Errors (500-520)
  500: "The staking system is not ready yet. Please try again later.",
  501: "The staking system is already set up and working.",
  502: "You don't have permission to perform this staking action.",
  503: "You don't have enough staked tokens for this action.",
  504: "You need to stake more than zero tokens. Please enter a valid amount.",
  505: "Your staking period hasn't finished yet. Please wait before withdrawing.",
  506: "You don't have any rewards to claim right now.",
  507: "The staking pool is full. Please try again later or stake in a different pool.",
  508: "The amount you want to stake is below the minimum required. Please stake more.",
  509: "The amount you want to stake is above the maximum allowed. Please stake less.",
  510: "Staking is temporarily paused. Please try again later.",
  511: "There's an issue with the staking settings. Please contact support.",
  512: "There was an error calculating your rewards. Please try again.",
  513: "You need to wait longer before you can unstake your tokens.",
  514: "You don't have any active stakes in this pool.",
  515: "The stake you're looking for doesn't exist.",
  516: "You've already withdrawn from this stake.",
  517: "Withdrawing early will result in a penalty fee.",
  518: "The reward pool has run out of tokens. Please contact support.",
  519: "The reward rate settings are incorrect. Please contact support.",
  520: "You need to wait before you can stake again.",

  // Phoenix Vesting Contract Errors (700-721)
  700: "The token vesting system is not ready yet. Please try again later.",
  701: "The token vesting system is already set up and working.",
  702: "You don't have access to this vesting schedule. Please check with the administrator.",
  703: "The vesting schedule you're looking for doesn't exist.",
  704: "You don't have any tokens available to withdraw right now.",
  705: "Your vesting period hasn't started yet. Please wait until the start date.",
  706: "There's an issue with the vesting settings. Please contact support.",
  707: "Your cliff period hasn't ended yet. You need to wait longer before claiming tokens.",
  708: "You're trying to claim more tokens than are available in your vesting schedule.",
  709: "You cannot create a vesting schedule with zero tokens.",
  710: "The vesting period must be longer than zero days.",
  711: "The cliff period cannot be longer than the total vesting period.",
  712: "The beneficiary address is not valid. Please check the address.",
  713: "You've already claimed all tokens from this vesting schedule.",
  714: "There aren't enough tokens in the contract to fulfill your vesting schedule.",
  715: "The vesting start time cannot be in the past.",
  716: "Too many vesting schedules have been created. The limit has been reached.",
  717: "This vesting schedule has been temporarily paused.",
  718: "Only the administrator can change vesting settings.",
  719: "Your vesting tokens are currently locked and cannot be accessed.",
  720: "Early withdrawal is not allowed for this vesting schedule.",
  721: "There was an error calculating your vesting amounts. Please contact support.",
};

/**
 * Attempts to determine the contract type based on error code ranges or context
 */
function inferContractType(
  errorCode: number,
  errorMessage: string
): string | null {
  // Determine contract type based on error code ranges
  if (errorCode >= 1 && errorCode <= 10) {
    // Note: These are generic token errors since SEP-41 doesn't define standard numbered codes
    return "token";
  } else if (errorCode >= 100 && errorCode <= 112) {
    return "factory";
  } else if (errorCode >= 200 && errorCode <= 206) {
    return "multihop";
  } else if (errorCode >= 300 && errorCode <= 332) {
    return "pair";
  } else if (errorCode >= 500 && errorCode <= 520) {
    return "stake";
  } else if (errorCode >= 700 && errorCode <= 721) {
    return "vesting";
  }

  // Fallback: try to infer from error message context
  const lowerMessage = errorMessage.toLowerCase();
  if (
    lowerMessage.includes("factory") ||
    lowerMessage.includes("pair creation")
  ) {
    return "factory";
  }
  if (
    lowerMessage.includes("liquidity") ||
    lowerMessage.includes("swap") ||
    lowerMessage.includes("pool")
  ) {
    return "pair";
  }
  if (lowerMessage.includes("stake") || lowerMessage.includes("staking")) {
    return "stake";
  }
  if (lowerMessage.includes("multihop") || lowerMessage.includes("path")) {
    return "multihop";
  }
  if (lowerMessage.includes("vesting") || lowerMessage.includes("cliff")) {
    return "vesting";
  }
  if (
    lowerMessage.includes("token") ||
    lowerMessage.includes("balance") ||
    lowerMessage.includes("transfer")
  ) {
    return "token";
  }

  return null;
}

/**
 * Enhanced contract error resolver that provides user-friendly error messages
 */
export function resolveContractErrorEnhanced(
  errorMessage: string,
  contractAddress?: string,
  contractType?: string
): {
  userFriendlyMessage: string;
  errorCode: number | null;
  contractType: string | null;
  technicalDetails: string;
} {
  const extractedError = extractErrorCodeFromMessage(errorMessage);

  if (!extractedError) {
    return {
      userFriendlyMessage:
        "Something unexpected happened. Please try again, and if the problem continues, contact our support team.",
      errorCode: null,
      contractType: null,
      technicalDetails: errorMessage,
    };
  }

  const { code } = extractedError;

  // Determine contract type based on error code or context
  const finalContractType =
    contractType ||
    extractedError.contractType ||
    inferContractType(code, errorMessage);

  // Get user-friendly message directly from error code
  const userFriendlyMessage =
    ERROR_CODE_DEFINITIONS[code] ||
    `Something went wrong (error code: ${code}). Please try again or contact our support team with this error code.`;

  return {
    userFriendlyMessage,
    errorCode: code,
    contractType: finalContractType,
    technicalDetails: errorMessage,
  };
}

/**
 * Legacy function for backward compatibility
 */
export function resolveContractErrorLegacy(eventString: string): string {
  const result = resolveContractErrorEnhanced(eventString);
  return result.userFriendlyMessage;
}

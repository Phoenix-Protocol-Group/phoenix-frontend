import { TransferServer } from "./transfer-server"

export enum TransferStatus {
  /** deposit/withdrawal fully completed. */
  completed = "completed",
  /**
   * Deposit/withdrawal has been submitted to external network, but is not yet confirmed.
   * This is the status when waiting on Bitcoin or other external crypto network to complete a transaction, or when waiting on a bank transfer.
   */
  pending_external = "pending_external",
  /** deposit/withdrawal is being processed internally by anchor. */
  pending_anchor = "pending_anchor",
  /** deposit/withdrawal operation has been submitted to Stellar network, but is not yet confirmed. */
  pending_stellar = "pending_stellar",
  /** the user must add a trust-line for the asset for the deposit to complete. */
  pending_trust = "pending_trust",
  /** the user must take additional action before the deposit / withdrawal can complete. */
  pending_user = "pending_user",
  /** the user has not yet initiated their transfer to the anchor. This is the necessary first step in any deposit or withdrawal flow. */
  pending_user_transfer_start = "pending_user_transfer_start",
  /** there is not yet enough information for this transaction to be initiated. Perhaps the user has not yet entered necessary info in an interactive flow. */
  incomplete = "incomplete",
  /** could not complete deposit because no satisfactory asset/XLM market was available to create the account. */
  no_market = "no_market",
  /** deposit/withdrawal size less than min_amount. */
  too_small = "too_small",
  /** deposit/withdrawal size exceeded max_amount. */
  too_large = "too_large",
  /** catch-all for any error not enumerated above. */
  error = "error"
}

export interface TransferTransactionBase {
  id: string
  kind: "deposit" | "withdrawal"
  status: TransferStatus
  status_eta?: number
  more_info_url: string
  amount_in: string
  amount_out: string
  amount_fee: string
  started_at: string
  completed_at: string | null
  stellar_transaction_id: string
  external_transaction_id?: string
  message?: string
  refunded: boolean
}

export interface DepositTransaction extends TransferTransactionBase {
  deposit_memo?: string
  deposit_memo_type?: string
  from: string
  to: string
}

export interface WithdrawalTransaction extends TransferTransactionBase {
  withdraw_anchor_account: string
  withdraw_memo: string
  withdraw_memo_type: string
  from: string
  to: string
}

export type TransferTransaction = DepositTransaction | WithdrawalTransaction

export interface FetchTransactionsOptions {
  /** The response should contain transactions starting on or after this date & time. */
  noOlderThan?: string
  /** The response should contain at most limit transactions. */
  limit?: number
  /** The kind of transaction that is desired. Should be either deposit or withdrawal. */
  kind?: "deposit" | "withdrawal"
  /** The response should contain transactions starting prior to this ID (exclusive). */
  pagingId?: string
}

export async function fetchTransaction(
  transferServer: TransferServer,
  id: string,
  idType: "transfer" | "stellar" | "external" = "transfer",
  authToken?: string
): Promise<{ transaction: TransferTransaction }> {
  const headers: any = {}

  if (authToken) {
    // tslint:disable-next-line no-string-literal
    headers["Authorization"] = `Bearer ${authToken}`
  }

  const idParamName =
    idType === "stellar"
      ? "stellar_transaction_id"
      : idType === "external"
      ? "external_transaction_id"
      : "id"

  const response = await transferServer.get("/transaction", {
    headers,
    params: {
      [idParamName]: id
    }
  })
  return response.data
}

export async function fetchTransactions(
  transferServer: TransferServer,
  assetCode: string,
  authToken?: string,
  options: FetchTransactionsOptions = {}
): Promise<{ transactions: TransferTransaction[] }> {
  const headers: any = {}

  if (authToken) {
    // tslint:disable-next-line no-string-literal
    headers["Authorization"] = `Bearer ${authToken}`
  }

  const response = await transferServer.get("/transactions", {
    headers,
    params: {
      asset_code: assetCode,
      kind: options.kind,
      limit: options.limit,
      no_older_than: options.noOlderThan,
      paging_id: options.pagingId
    }
  })
  return response.data
}

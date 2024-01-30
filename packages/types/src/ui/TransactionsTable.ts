import { Token } from "../general";

export interface TransactionTableEntryProps {
  type: "Sent" | "Received";
  assets: Token[];
  tradeSize: string;
  tradeValue: string;
  date: string;
}

export interface TransactionsTableProps {
  entries: TransactionTableEntryProps[];
}

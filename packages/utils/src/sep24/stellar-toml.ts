export type StellarTomlCurrency = Partial<{
  code: string;
  code_template: string;
  issuer?: string;
  status: "live" | "dead" | "test" | "private";
  display_decimals: number;
  name: string;
  desc: string;
  conditions: string;
  image: string;
  fixed_number: number;
  max_number: number;
  is_unlimited: boolean;
  is_asset_anchored: boolean;
  anchor_asset_type:
    | "fiat"
    | "crypto"
    | "stock"
    | "bond"
    | "commodity"
    | "realestate"
    | "other";
  anchor_asset: string;
  redemption_instructions: string;
  regulated: boolean;
  approval_server: string;
  approval_criteria: string;
}>;

export type StellarToml = Partial<{
  CURRENCIES: StellarTomlCurrency[];
  TRANSFER_SERVER: string;
  TRANSFER_SERVER_SEP0024: string;
  WEB_AUTH_ENDPOINT: string;
  SIGNING_KEY: string;
}>;

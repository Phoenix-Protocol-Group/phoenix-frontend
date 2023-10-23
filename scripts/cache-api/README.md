# Cache API Package

An API that saves the pair data to the database and serves it with graphql.

## Installation

1. Ensure that you have Node.js and yarn installed on your machine.
2. Navigate to the faucet directory.
3. Run `yarn install` to install all project dependencies.
4. Run `npx prisma migrate dev --name init` to generate database migrations

## Usage
1. Run `yarn dev` to run the api
2. Server is running at :4000

## API Documentation

### Pairs

#### Get all pairs

Returns a list of all pairs.

- **URL**

  `/pairs`

- **Method**

  `GET`

- **URL Params**

  None

- **Success Response**

  - **Code:** 200
  - **Content Type:** `application/json`
  - **Content:** [Array of Pairs](#pair)

#### Get top gainers

Returns the top gainers among all pairs.

- **URL**

  `/pairs/topgainers`

- **Method**

  `GET`

- **URL Params**

  None

- **Success Response**

  - **Code:** 200
  - **Content Type:** `application/json`
  - **Content:** [Array of Top Gainers](#pairhistory)

#### Get pair by address

Returns a specific pair based on its address.

- **URL**

  `/pairs/:address`

- **Method**

  `GET`

- **URL Params**

  `address` - The address of the pair (string)

- **Success Response**

  - **Code:** 200
  - **Content Type:** `application/json`
  - **Content:** [Pair Object](#pair)

#### Get pair history by address

Returns the history of a specific pair based on its address.

- **URL**

  `/pairs/:address/history`

- **Method**

  `GET`

- **URL Params**

  `address` - The address of the pair (string)

- **Success Response**

  - **Code:** 200
  - **Content Type:** `application/json`
  - **Content:** [Array of Pair History](#pairhistory)

### Tokens

#### Get all tokens

Returns a list of all tokens.

- **URL**

  `/tokens`

- **Method**

  `GET`

- **URL Params**

  None

- **Success Response**

  - **Code:** 200
  - **Content Type:** `application/json`
  - **Content:** [Array of Tokens](#token)

#### Get token by address

Returns a specific token based on its address.

- **URL**

  `/tokens/:address`

- **Method**

  `GET`

- **URL Params**

  `address` - The address of the token (string)

- **Success Response**

  - **Code:** 200
  - **Content Type:** `application/json`
  - **Content:** [Token Object](#token)

#### Get token history by address

Returns the history of a specific token based on its address.

- **URL**

  `/tokens/:address/history`

- **Method**

  `GET`

- **URL Params**

  `address` - The address of the token (string)

- **Success Response**

  - **Code:** 200
  - **Content Type:** `application/json`
  - **Content:** [Array of Token History](#tokenhistory)

## Returned Types

### Token <a name="token"></a>

```typescript
interface Token {
  id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}
```

### Token History <a name="tokenhistory"></a>

```typescript
interface TokenHistory {
  id: number;
  createdAt: number;
  price: number;
  token: Token;
}
```

### Pair <a name="pair"></a>

```typescript
interface Pair {
  id: number;
  address: string;
  assetA: Token;
  assetB: Token;
  assetShare: Token;
}
```

### Pair History <a name="pairhistory"></a>

```typescript
interface PairHistory {
  id: number;
  createdAt: number;
  pair: Pair;
  assetAAmount: number;
  assetBAmount: number;
  assetShareAmount: number;
}
```

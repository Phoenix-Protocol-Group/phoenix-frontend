# Faucet Package

An API that pushes tokens to the user's wallet to simplify the use of the pools functionality on the futurenet.

## Installation

1. Ensure that you have Node.js and yarn installed on your machine.
2. Navigate to the faucet directory.
3. Run `yarn install` to install all project dependencies.

## Usage
1. Run `yarn start` to run the api
2. Send post request to /fund with {to, amount} in message body
3. Check the status within the return message

# Scripts

## Install Dependencies

1. `soroban-cli v0.8.0`. See https://soroban.stellar.org/docs/getting-started/setup#install-the-soroban-cli
2. If you want to run everything locally: `docker` (you can run both Standalone and Futurenet backends with it)
3. `Node.js v17`
4. [Freighter Wallet](https://www.freighter.app/) ≥[v5.0.2](https://github.com/stellar/freighter/releases/tag/2.9.1). Or from the Firefox / Chrome extension store. Once installed, enable "Experimental Mode" in the settings (gear icon).
5. If you want to run everything locally, build the `soroban-preview` docker image:

       ./preview.sh

   Building the docker image lets you avoid installing the specific version of soroban-cli in step (1), if desired.

## Run Backend

You have three options: 1. Deploy on [Futurenet](https://soroban.stellar.org/docs/getting-started/deploy-to-futurenet) using a remote [RPC](https://soroban.stellar.org/docs/getting-started/run-rpc) endpoint, 2. Run your own Futerenet RPC node with Docker and deploy to it, 3. run in [localnet/standalone](https://soroban.stellar.org/docs/getting-started/deploy-to-a-local-network) mode.

### Option 1: Deploy on Futurenet

0. Make sure you have soroban-cli installed, as explained above

1. Deploy the contracts and initialize them

       ./initialize.sh futurenet

   This will create a `token-admin` identity for you (`soroban config identity create token-admin`) and deploy a Fungible Token contract as well as the [crowdfund contract](./contracts/crowdfund), with this account as admin.

2. Select the Futurenet network in your Freighter browser extension

### Option 2: Localnet/Standalone

0. If you didn't yet, build the `soroban-preview` docker image, as described above:

       ./preview.sh

1. In one terminal, run the backend docker containers and wait for them to start:

       ./localnet.sh

   You know that it fully started if it goes into a loop publishing & syncing checkpoints.

   You can stop this process with <kbd>ctrl</kbd><kbd>c</kbd>

2. Keep that running, then deploy the contracts and initialize them:
   You can use your own local soroban-cli:

       ./initialize.sh standalone

   Or run it inside the soroban-preview docker container:

       docker exec soroban-preview ./initialize.sh standalone

   **Note:** this state will be lost if the quickstart docker container is removed, which will happen if you stop the `quickstart.sh` process. You will need to re-run `./initialize.sh` every time you restart the container.

3. Add the Standalone custom network in Freighter

   |   |   |
   |---|---|
   | Name | Standalone |
   | URL | http://localhost:8000/soroban/rpc |
   | Passphrase | Standalone Network ; February 2017 |
   | Allow HTTP connection | Enabled |
   | Switch to this network | Enabled |

4. Add some Standalone network lumens to your Freighter wallet.

   1. Copy the address for your freighter wallet.
   2. Visit `http://localhost:8000/friendbot?addr=<your address>`


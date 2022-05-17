# dlotto

## Install Dlotto project.
1. Install DFX and NodeJS:  

[Internet Computer | Documentation](https://smartcontracts.org/docs/quickstart/1-quickstart.html)

2. Clone the project from GitLab: 

```bash
cd ~/projects/
git clone git@github.com:caya-ventures/dlotto.git
```
    
## Install Internet Identity canister.
1. Clone Internet Identity repo: 

```bash
cd ~/projects/
git clone git@github.com:dfinity/internet-identity.git
```

2. Install Internet identity canister: 

```bash
cd ../internet-identity
rm -rf .dfx/local
II_FETCH_ROOT_KEY=1 II_DUMMY_CAPTCHA=1  dfx deploy --no-wallet --argument '(null)'
```

3. Get canister ID: 

```bash
    dfx canister id internet_identity
```

4. Create `local.json`  file in Dlotto project folder and add Id there. Content of the file should look like it:

```json
{
    "identityCanisterId": "ADD_ID_HERE"
}
```
    
## Install Ledger canister.
1. Change `"candid": "ledger.public.did"` to `"candid": "ledger.private.did"` in `dfx.json` file of Dlotto project
2. Create new identity:  

```bash
dfx identity new minter
dfx identity use minter
export MINT_ACC=$(dfx ledger account-id)
```

3. Switch back to your default identity and record its ledger account identifier: 

```bash
dfx identity use default
export LEDGER_ACC=$(dfx ledger account-id)
```

4. Deploy Ledger canister only: 

```bash
dfx deploy ledger --argument '(record {minting_account = "'${MINT_ACC}'"; initial_values = vec { record { "'${LEDGER_ACC}'"; record { e8s=100_000_000_000 } }; }; send_whitelist = vec {}})'
```

5. Revert your changes in `dfx.json` (Change `"candid": "ledger.private.did"` to `"candid": "ledger.public.did"` )
6. Check if canister works: 

```bash
dfx canister call ledger account_balance '(record { account = '$(python3 -c 'print("vec{" + ";".join([str(b) for b in bytes.fromhex("'$LEDGER_ACC'")]) + "}")')' })'
```

The output should look like the following:

```bash
(record { e8s = 100_000_000_000 : nat64 })
```
    
## Initiate the project.
As the last step we have initiate our canisters and start the frontend

```bash
dfx deploy
```

```bash
npm ci
npm start
```

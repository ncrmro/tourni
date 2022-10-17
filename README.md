# Tourni

Current implementation allows for a tournament to be created. At least two competitors must register and currently
there must be an even amount of competitors

```bash
yarn hardhat node
yarn hardhat deploy
yarn hardhat run scripts/comptetitor-register.ts --network localhost
yarn hardhat run scripts/generate-matches.ts --network localhost
```

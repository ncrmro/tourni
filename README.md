# Tourni

Current implementation allows for a tournament to be created. At least two competitors must register and currently
there must be an even amount of competitors

```bash
yarn hardhat node
yarn hardhat deploy
yarn hardhat run scripts/comptetitor-register.ts --network localhost
yarn hardhat run scripts/generate-matches.ts --network localhost
```

TODO
- [ ] Tournaments should be created from an organization
- [ ] Handle odd number of players
- [ ] Rank lookup (best players should play worst players in early rounds)
- [ ] Double vs single elemenitation

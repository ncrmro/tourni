import { ethers } from "hardhat"
import { Tournament } from "../typechain-types"

export async function competitorRegister() {
  const tournament = await ethers.getContract<Tournament>("Tournament")
  console.log(`Generating Matchups`)
  await tournament.generateRoundMatches()
}

competitorRegister()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

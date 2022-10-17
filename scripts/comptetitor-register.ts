import { ethers } from "hardhat"
import { firstCompetitor } from "../helper-hardhat-config"
import { Tournament } from "../typechain-types"

export async function competitorRegister(args: any[]) {
  const tournament = await ethers.getContract<Tournament>("Tournament")
  console.log(`Registering Competitor`)
  await tournament.registerCompetitor(args[0])
}

competitorRegister([firstCompetitor])
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

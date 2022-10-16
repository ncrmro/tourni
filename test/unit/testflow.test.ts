import { Tournament, TournamentMatch } from "../../typechain-types"
import { deployments, ethers } from "hardhat"
import { assert, expect } from "chai"

describe("Tournament Flow", async () => {
  let tournament: Tournament
  beforeEach(async () => {
    await deployments.fixture(["all"])
    tournament = await ethers.getContract("Tournament")
  })

  it("epoch matches can be deployed", async () => {
    const addresses = await ethers.getSigners()
    const winner = addresses[1]
    await tournament.registerCompetitor(winner.address)
    await Promise.all(
      Array.from(Array(5)).map(async (x, i) =>
        tournament.registerCompetitor(addresses[i + 1].address)
      )
    )
    assert.equal((await tournament.competitorCount()).toNumber(), 6)
    await tournament.generateRoundMatches()
    const currentRound = await tournament.currentRound()
    assert.equal(currentRound.toNumber(), 1)
    assert.equal((await tournament.currentRoundMatchesCount()).toNumber(), 3)

    // const matchAddress = await tournament.epocMatches(0)
    // const match = await ethers.getContractAt<TournamentMatch>("TournamentMatch", matchAddress)
    // // assert.isNull(await match.winner())
    // await match.declareWinner(winner.address)
    // assert.equal(winner.address, await match.winner())
  })
})

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
    // Register six competitors
    await Promise.all(
      Array.from(Array(6)).map(async (x, i) =>
        tournament.registerCompetitor(addresses[i + 1].address)
      )
    )
    assert.equal((await tournament.competitorCount()).toNumber(), 6)
    await tournament.generateRoundMatches()
    const currentRound = await tournament.currentRound()
    assert.equal(currentRound.toNumber(), 1)
    const currentRoundMatchCount = await tournament.currentRoundMatchesCount()
    assert.equal(currentRoundMatchCount.toNumber(), 3)

    // Declare a winner for each match
    await Promise.all(
      Array.from(Array(currentRoundMatchCount.toNumber())).map(async (x, i) => {
        const matchAddress = await tournament.roundMatches(currentRound.toNumber() - 1, i)
        const match = await ethers.getContractAt<TournamentMatch>("TournamentMatch", matchAddress)
        const competitor = await match.competitors(0)
        await match.declareWinner(competitor)
      })
    )

    // const matchAddress = await tournament.epocMatches(0)
    // const match = await ethers.getContractAt<TournamentMatch>("TournamentMatch", matchAddress)
    // // assert.isNull(await match.winner())
    // await match.declareWinner(winner.address)
    // assert.equal(winner.address, await match.winner())
  })
})

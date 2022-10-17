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
    // Register 8 competitors
    await Promise.all(
      Array.from(Array(8)).map(async (x, i) =>
        tournament.registerCompetitor(addresses[i + 1].address)
      )
    )
    console.log((await tournament.finalRound()).toNumber())
    assert.equal((await tournament.competitorCount()).toNumber(), 8)
    await tournament.generateRoundMatches()
    let currentRound = await tournament.currentRound()
    assert.equal(currentRound.toNumber(), 1)
    let currentRoundMatchCount = await tournament.currentRoundMatchesCount()
    assert.equal(currentRoundMatchCount.toNumber(), 4)

    // Declare a winner for each match
    await Promise.all(
      Array.from(Array(currentRoundMatchCount.toNumber()), async (x, i) => {
        const matchAddress = await tournament.roundMatches(currentRound.toNumber() - 1, i)
        const match = await ethers.getContractAt<TournamentMatch>("TournamentMatch", matchAddress)
        const competitor = await match.competitors(0)
        await match.declareWinner(competitor)
        const winner = await match.winner()
        assert.isNotNull(winner)
      })
    )

    // This should generate the second round of matches
    await tournament.generateRoundMatches()
    currentRound = await tournament.currentRound()
    assert.equal(currentRound.toNumber(), 2)
    currentRoundMatchCount = await tournament.currentRoundMatchesCount()
    assert.equal(currentRoundMatchCount.toNumber(), 2)

    // const matchAddress = await tournament.epocMatches(0)
    // const match = await ethers.getContractAt<TournamentMatch>("TournamentMatch", matchAddress)
    // // assert.isNull(await match.winner())
    // await match.declareWinner(winner.address)
    // assert.equal(winner.address, await match.winner())
  })
})

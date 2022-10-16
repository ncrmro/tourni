import {Tournament, TournamentMatch} from "../../typechain-types"
import {deployments, ethers} from "hardhat"
import {assert, expect} from "chai"


describe("Tournament Flow", async () => {
    let tournament: Tournament
    beforeEach(async () => {
        await deployments.fixture(["all"])
        tournament = await ethers.getContract("Tournament")

    })

    it("epoch matches can be deployed", async () => {
        const addresses = await ethers.getSigners();
        const winner = addresses[1]
        await tournament.registerCompetitor(winner.address)
        await tournament.registerCompetitor(addresses[2].address)
        await tournament.deployEpochMatches()
        const matchCount = await tournament.epocMatchCount()
        assert.equal(matchCount.toNumber(), 1)
        const matchAddress = await tournament.epocMatches(0)
        const match = await ethers.getContractAt<TournamentMatch>("TournamentMatch", matchAddress)
        // assert.isNull(await match.winner())
        await match.declareWinner(winner.address)
        assert.equal(winner.address, await match.winner())
    })
})

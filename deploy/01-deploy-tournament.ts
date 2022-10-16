import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
import verify from "../helper-functions"
import {networkConfig, developmentChains} from "../helper-hardhat-config"

const deployCompetitorToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {getNamedAccounts, deployments, network} = hre
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    log("----------------------------------------------------")
    log("Deploying CompetitorToken and waiting for confirmations...")
    // Registration close time was two days acount
    const now = new Date()
    const registrationCloseTime = new Date().setDate(now.getDate() - 1)
    const tournamentStartTime = new Date(now.getDate() + 1)

    const Tournament = await deploy("Tournament", {
        from: deployer,
        args: ["Super Smash Bros HTX 2022-09-31", 1665893178, 1665979578],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`Tournament at ${Tournament.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(Tournament.address, [])
    }
}

export default deployCompetitorToken
deployCompetitorToken.tags = ["all", "tournament"]

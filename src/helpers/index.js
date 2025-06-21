import { ethers } from "ethers"
import RealEstateTokenABI from "./abis/RealEstateToken.json"
import RealEstateStakingABI from "./abis/RealEstateStaking.json"
import PropertyVotingABI from "./abis/PropertyVoting.json"
import EngagementQuestsABI from "./abis/EngagementQuests.json"

const CONTRACTS = {
  token: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  staking: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  voting: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  quests: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
}

const getProvider = () => new ethers.providers.Web3Provider(window.ethereum)
const getSigner = () => getProvider().getSigner()

export const getTokenContract = () =>
  new ethers.Contract(CONTRACTS.token, RealEstateTokenABI, getSigner())

export const getStakingContract = () =>
  new ethers.Contract(CONTRACTS.staking, RealEstateStakingABI, getSigner())

export const getVotingContract = () =>
  new ethers.Contract(CONTRACTS.voting, PropertyVotingABI, getSigner())

export const getQuestsContract = () =>
  new ethers.Contract(CONTRACTS.quests, EngagementQuestsABI, getSigner())

// Optional read-only versions
export const getTokenContractReadOnly = () =>
  new ethers.Contract(CONTRACTS.token, RealEstateTokenABI, getProvider())

export const getStakingContractReadOnly = () =>
  new ethers.Contract(CONTRACTS.staking, RealEstateStakingABI, getProvider())

export const getVotingContractReadOnly = () =>
  new ethers.Contract(CONTRACTS.voting, PropertyVotingABI, getProvider())

export const getQuestsContractReadOnly = () =>
  new ethers.Contract(CONTRACTS.quests, EngagementQuestsABI, getProvider())

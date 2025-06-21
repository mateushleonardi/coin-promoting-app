// src/context/ContractContext.js
import { createContext, useContext, useEffect, useState } from "react"
import {
  getTokenContract,
  getStakingContract,
  getVotingContract,
  getQuestsContract
} from "../helpers"

const ContractContext = createContext()

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState(null)

  useEffect(() => {
    const init = async () => {
      try {
        const token = getTokenContract()
        const staking = getStakingContract()
        const voting = getVotingContract()
        const quests = getQuestsContract()

        setContracts({ token, staking, voting, quests })
      } catch (err) {
        console.error("❌ Failed to load contracts:", err)
      }
    }

    if (window.ethereum) init()
  }, [])

  return (
    <ContractContext.Provider value={contracts}>
      {children}
    </ContractContext.Provider>
  )
}

// Hook para acessar contratos em qualquer lugar
export const useContracts = () => useContext(ContractContext)

/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { AidWave, AidWaveClient } from '../contracts/AidWaveClient'
import { useWallet } from '@txnlab/use-wallet'

type VoteArgs = AidWave['methods']['vote(bool,uint64)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AidWaveClient
  inFavor: VoteArgs['inFavor']
  registeredASA: VoteArgs['registeredASA']
  setState: () => Promise<void>
}

const Vote = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling vote`)
    await props.typedClient.vote(
      {
        inFavor: props.inFavor,
        registeredASA: props.registeredASA,
      },
      { sender },
    )
    await props.setState()
    setLoading(false)
  }

  return (
    <button className={props.buttonClass} onClick={callMethod}>
      {loading ? props.buttonLoadingNode || props.buttonNode : props.buttonNode}
    </button>
  )
}

export default Vote

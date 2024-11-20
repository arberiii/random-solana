'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, VersionedTransaction } from '@solana/web3.js'
import { useEffect, useState, useCallback } from 'react'
import { AppModal } from '../ui/ui-layout'
import {
  useTransferSol,
} from '../account/account-data-access'
import { MemeCoin } from './types'
import debounce from 'lodash/debounce'
import { getQuote, getSwapTransaction, swap } from './jup'

export function AccountButtons({ address, memeCoin, showSendModal, setShowSendModal }: { address?: PublicKey, memeCoin: MemeCoin, showSendModal: boolean, setShowSendModal: (show: boolean) => void }) {
  const wallet = useWallet()
  const publicKey = wallet.publicKey;
  if (!publicKey) {
    return <div>Wallet not connected</div>
  }

  return (
    <div>
      <ModalSendFork address={publicKey} show={showSendModal} hide={() => setShowSendModal(false)} memeCoin={memeCoin} />
      {/* <div className="space-x-2">
        <button
          disabled={wallet.publicKey?.toString() !== address.toString()}
          className="btn btn-xs lg:btn-md btn-outline"
          onClick={() => setShowSendModal(true)}
        >
          Send
        </button>
      </div> */}
    </div>
  )
}

const getFirstSolContractAddress = (memeCoin: MemeCoin) => {
  // iterate through contract addresses and return the first one that starts with solana/
  for (const address of memeCoin.contractAddresses) {
    if (address.startsWith('solana/')) {
      return address.split('solana/')[1]
    }
  }
  return ""
}


function ModalSend({ hide, show, address, memeCoin }: { hide: () => void; show: boolean; address: PublicKey, memeCoin: MemeCoin }) {
  const [firstSolContractAddress, setFirstSolContractAddress] = useState<string | null>(null);
  
  useEffect(() => {
    setFirstSolContractAddress(getFirstSolContractAddress(memeCoin));
  }, [memeCoin]);

  const wallet = useWallet()
  const mutation = useTransferSol({ address })
  const [sendAmount, setSendAmount] = useState('0.1')
  const [receiveAmount, setReceiveAmount] = useState('')
  const [inputMint, setInputMint] = useState(new PublicKey('So11111111111111111111111111111111111111112'));
  const [outputMint, setOutputMint] = useState<PublicKey | null>(null);
  const SOL_MULTIPLIER = 1000000000;
  const [quoteResponse, setQuoteResponse] = useState<any>(null)

  useEffect(() => {
    if (firstSolContractAddress) {
      setOutputMint(new PublicKey(firstSolContractAddress));
    }
  }, [firstSolContractAddress]);

  const updateQuote = useCallback(
    debounce(async (amount: number, inMint: PublicKey, outMint: PublicKey) => {
      if (!outMint) return;
      const quoteResponse = await getQuote(amount * SOL_MULTIPLIER, inMint, outMint)
      setQuoteResponse(quoteResponse)
      const receiveAmount = parseFloat(quoteResponse.outAmount) / SOL_MULTIPLIER
      setReceiveAmount(receiveAmount.toFixed(9))
    }, 500),
    []
  )

  useEffect(() => {
    if (outputMint) {
      updateQuote(parseFloat(sendAmount), inputMint, outputMint)
    }
  }, [sendAmount, inputMint, outputMint, updateQuote])

  if (!address || !wallet.sendTransaction) {
    return <div>Wallet not connected</div>
  }

  const handleSwap = async () => {
    if (!wallet.publicKey || !wallet.wallet || !outputMint) {
      console.error('Wallet not connected or output mint not set')
      return
    }
    const swapResponse = await swap(wallet.publicKey, parseFloat(sendAmount) * SOL_MULTIPLIER, inputMint, outputMint)
    const transaction = getSwapTransaction(swapResponse.swapTransaction, wallet);
  }

  const handleSendAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendAmount(e.target.value)
  }

  return (
    <AppModal
      hide={hide}
      show={show}
      title={`Send ${memeCoin.name}`}
      submitDisabled={!sendAmount || mutation.isPending || !outputMint}
      submitLabel="Swap"
      submit={() => {
        handleSwap();
      }}
    >
      <label className="block text-sm font-medium text-gray-700">You send this many SOL</label>
      <input
        disabled={mutation.isPending}
        type="text"
        placeholder="Send Amount"
        className="input input-bordered w-full"
        value={sendAmount}
        onChange={(e) => handleSendAmountChange(e)}
      />
      <label className="block text-sm font-medium text-gray-700">You receive this many {memeCoin.name}</label>
      <input
        disabled={false}
        type="number"
        step="any"
        min="1"
        placeholder="Receive Amount"
        className="input input-bordered w-full"
        value={receiveAmount}
        onChange={(e) => setReceiveAmount(e.target.value)}
      />
    </AppModal>
  )
}

function ModalSendFork({ hide, show, address, memeCoin }: { hide: () => void; show: boolean; address: PublicKey, memeCoin: MemeCoin }) {
  const [firstSolContractAddress, setFirstSolContractAddress] = useState<string | null>(null);
  
  useEffect(() => {
    setFirstSolContractAddress(getFirstSolContractAddress(memeCoin));
  }, [memeCoin]);

  const wallet = useWallet()
  const [inputMint, setInputMint] = useState(new PublicKey('So11111111111111111111111111111111111111112'));
  const [outputMint, setOutputMint] = useState<PublicKey | null>(null);

  useEffect(() => {
    if (firstSolContractAddress) {
      setOutputMint(new PublicKey(firstSolContractAddress));
    }
  }, [firstSolContractAddress]);

  return (
    <AppModal
      hide={hide}
      show={show}
      title={`Send ${memeCoin.name}`}
      submitDisabled={true}
      submitLabel=""
      submit={() => {
        
      }}
    >
      {firstSolContractAddress && <JupTerminal contractAddress={firstSolContractAddress} />}
    </AppModal>
  )
}

const JupTerminal = ({contractAddress}: {contractAddress: string}) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@jup-ag/terminal").then((mod) => {
        const init = mod.init;
        init({
          displayMode: "integrated",
          integratedTargetId: "integrated-terminal",
          endpoint: "https://mainnet.helius-rpc.com/?api-key=cbbe5e2b-8ce2-4dce-9644-eb4ca17bb841",
          formProps: {
            initialInputMint: "So11111111111111111111111111111111111111112",
            initialOutputMint: contractAddress,
            fixedInputMint: true,
            fixedOutputMint: true,
            initialAmount: "10000",
          },
        });
      });
      }
    }, []);
  return <div id="integrated-terminal" style={{width: '100%', height: '500px'}}></div>
}


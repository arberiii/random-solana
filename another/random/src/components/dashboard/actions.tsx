'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, VersionedTransaction } from '@solana/web3.js'
import { IconRefresh } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { AppModal, ellipsify } from '../ui/ui-layout'
import { useCluster } from '../cluster/cluster-data-access'
import { ExplorerLink } from '../cluster/cluster-ui'
import {
  useGetBalance,
  useGetSignatures,
  useGetTokenAccounts,
  useRequestAirdrop,
  useTransferSol,
} from '../account/account-data-access'
import { Wallet } from '@project-serum/anchor'
import { MemeCoin } from './types'
import debounce from 'lodash/debounce'

export function AccountButtons({ address, memeCoin }: { address: PublicKey, memeCoin: MemeCoin }) {
  const wallet = useWallet()
  const { cluster } = useCluster()
  const [showSendModal, setShowSendModal] = useState(false)

  return (
    <div>
      <ModalSend address={address} show={showSendModal} hide={() => setShowSendModal(false)} memeCoin={memeCoin} />
      <div className="space-x-2">
        <button
          disabled={wallet.publicKey?.toString() !== address.toString()}
          className="btn btn-xs lg:btn-md btn-outline"
          onClick={() => setShowSendModal(true)}
        >
          Send
        </button>
      </div>
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
  return null
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
    console.log(transaction);
    // Implement the actual swap logic here
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

async function getQuote(amount: number, inputMint: PublicKey, outputMint: PublicKey) {
  const quoteResponse = await (
    await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint.toString()}&outputMint=${outputMint.toString()}&amount=${amount}&slippageBps=50`)
  ).json();
  return quoteResponse;
}

async function swap(walletPublicKey: PublicKey, amount: number, inputMint: PublicKey, outputMint: PublicKey) {
  const quoteResponse = await getQuote(amount, inputMint, outputMint);
  console.log(quoteResponse);
  console.log(walletPublicKey.toString());
  const swapResponse = await (
    await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey: walletPublicKey.toString(),
        wrapAndUnwrapSol: true,
      }),
    })
  ).json();
  return swapResponse;
}

function getSwapTransaction(swapTransaction: any, wallet: any) {
  const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
  var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
  console.log(transaction);

  wallet.signTransaction(transaction);

  return transaction;
}

'use client'

import { PublicKey, VersionedTransaction } from '@solana/web3.js'

export async function getQuote(amount: number, inputMint: PublicKey, outputMint: PublicKey) {
    const quoteResponse = await (
      await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint.toString()}&outputMint=${outputMint.toString()}&amount=${amount}&slippageBps=50`)
    ).json();
    return quoteResponse;
  }
  
  export async function swap(walletPublicKey: PublicKey, amount: number, inputMint: PublicKey, outputMint: PublicKey) {
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
  
  export function getSwapTransaction(swapTransaction: any, wallet: any) {
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    console.log(transaction);
  
    wallet.signTransaction(transaction);
  
    return transaction;
  }
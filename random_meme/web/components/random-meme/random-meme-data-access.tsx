'use client';

import {
  getRandomMemeProgram,
  getRandomMemeProgramId,
} from '@random-meme/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useRandomMemeProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getRandomMemeProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getRandomMemeProgram(provider);

  const accounts = useQuery({
    queryKey: ['random-meme', 'all', { cluster }],
    queryFn: () => program.account.randomMeme.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['random-meme', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ randomMeme: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useRandomMemeProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useRandomMemeProgram();

  const accountQuery = useQuery({
    queryKey: ['random-meme', 'fetch', { cluster, account }],
    queryFn: () => program.account.randomMeme.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['random-meme', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ randomMeme: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['random-meme', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ randomMeme: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['random-meme', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ randomMeme: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['random-meme', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ randomMeme: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}

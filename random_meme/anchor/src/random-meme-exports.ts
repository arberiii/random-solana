// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import RandomMemeIDL from '../target/idl/random_meme.json';
import type { RandomMeme } from '../target/types/random_meme';

// Re-export the generated IDL and type
export { RandomMeme, RandomMemeIDL };

// The programId is imported from the program IDL.
export const RANDOM_MEME_PROGRAM_ID = new PublicKey(RandomMemeIDL.address);

// This is a helper function to get the RandomMeme Anchor program.
export function getRandomMemeProgram(provider: AnchorProvider) {
  return new Program(RandomMemeIDL as RandomMeme, provider);
}

// This is a helper function to get the program ID for the RandomMeme program depending on the cluster.
export function getRandomMemeProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return RANDOM_MEME_PROGRAM_ID;
  }
}

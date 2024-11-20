// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import RandomIDL from '../target/idl/random.json'
import type { Random } from '../target/types/random'

// Re-export the generated IDL and type
export { Random, RandomIDL }

// The programId is imported from the program IDL.
export const RANDOM_PROGRAM_ID = new PublicKey(RandomIDL.address)

// This is a helper function to get the Random Anchor program.
export function getRandomProgram(provider: AnchorProvider) {
  return new Program(RandomIDL as Random, provider)
}

// This is a helper function to get the program ID for the Random program depending on the cluster.
export function getRandomProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Random program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return RANDOM_PROGRAM_ID
  }
}

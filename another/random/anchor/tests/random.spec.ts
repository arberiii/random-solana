import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Random} from '../target/types/random'
import '@types/jest';

describe('random', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Random as Program<Random>

  const randomKeypair = Keypair.generate()

  it('Initialize Random', async () => {
    await program.methods
      .initialize()
      .accounts({
        random: randomKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([randomKeypair])
      .rpc()

    const currentCount = await program.account.random.fetch(randomKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Random', async () => {
    await program.methods.increment().accounts({ random: randomKeypair.publicKey }).rpc()

    const currentCount = await program.account.random.fetch(randomKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Random Again', async () => {
    await program.methods.increment().accounts({ random: randomKeypair.publicKey }).rpc()

    const currentCount = await program.account.random.fetch(randomKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Random', async () => {
    await program.methods.decrement().accounts({ random: randomKeypair.publicKey }).rpc()

    const currentCount = await program.account.random.fetch(randomKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set random value', async () => {
    await program.methods.set(42).accounts({ random: randomKeypair.publicKey }).rpc()

    const currentCount = await program.account.random.fetch(randomKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the random account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        random: randomKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.random.fetchNullable(randomKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})

import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { RandomMeme } from '../target/types/random_meme';

describe('random-meme', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.RandomMeme as Program<RandomMeme>;

  const randomMemeKeypair = Keypair.generate();

  it('Initialize RandomMeme', async () => {
    await program.methods
      .initialize()
      .accounts({
        randomMeme: randomMemeKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([randomMemeKeypair])
      .rpc();

    const currentCount = await program.account.randomMeme.fetch(
      randomMemeKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment RandomMeme', async () => {
    await program.methods
      .increment()
      .accounts({ randomMeme: randomMemeKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.randomMeme.fetch(
      randomMemeKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment RandomMeme Again', async () => {
    await program.methods
      .increment()
      .accounts({ randomMeme: randomMemeKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.randomMeme.fetch(
      randomMemeKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement RandomMeme', async () => {
    await program.methods
      .decrement()
      .accounts({ randomMeme: randomMemeKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.randomMeme.fetch(
      randomMemeKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set randomMeme value', async () => {
    await program.methods
      .set(42)
      .accounts({ randomMeme: randomMemeKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.randomMeme.fetch(
      randomMemeKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the randomMeme account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        randomMeme: randomMemeKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.randomMeme.fetchNullable(
      randomMemeKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});

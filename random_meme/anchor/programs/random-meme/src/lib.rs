#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("2aqnzzUNCpkdkVeL62rvU4EoDDBg9nRsZaazaWbBdhQX");

#[program]
pub mod random_meme {
    use super::*;

  pub fn close(_ctx: Context<CloseRandomMeme>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.random_meme.count = ctx.accounts.random_meme.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.random_meme.count = ctx.accounts.random_meme.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeRandomMeme>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.random_meme.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeRandomMeme<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + RandomMeme::INIT_SPACE,
  payer = payer
  )]
  pub random_meme: Account<'info, RandomMeme>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseRandomMeme<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub random_meme: Account<'info, RandomMeme>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub random_meme: Account<'info, RandomMeme>,
}

#[account]
#[derive(InitSpace)]
pub struct RandomMeme {
  count: u8,
}

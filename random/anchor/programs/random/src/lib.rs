#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod random {
    use super::*;

  pub fn close(_ctx: Context<CloseRandom>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.random.count = ctx.accounts.random.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.random.count = ctx.accounts.random.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeRandom>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.random.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeRandom<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Random::INIT_SPACE,
  payer = payer
  )]
  pub random: Account<'info, Random>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseRandom<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub random: Account<'info, Random>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub random: Account<'info, Random>,
}

#[account]
#[derive(InitSpace)]
pub struct Random {
  count: u8,
}

---
title: "ERC-3643 Explained: The Token Standard Behind Compliant Securities"
slug: "erc-3643-explained"
excerpt: "A technical-but-readable guide to ERC-3643, the on-chain compliance standard that powers regulated tokenized securities in the EU."
date: "2026-04-09"
author: "Nextoken Capital"
category: "Technology"
readTime: "9 min"
---

# ERC-3643 Explained: The Token Standard Behind Compliant Securities

If you've spent any time looking at tokenized securities, you've seen the acronym ERC-3643 thrown around. It's listed on Nextoken Capital's site, on Tokeny's marketing, in MiCA-aligned offerings across Europe. Most readers nod along without quite knowing what it actually is or why it matters.

This post fixes that. By the end you'll understand what ERC-3643 is, what problem it solves, what it's made of, and why it's become the de-facto standard for compliant security tokens in the European Union.

## The problem ERC-3643 solves

The first widely adopted token standard on Ethereum was ERC-20. ERC-20 defines a token that is fungible — every token is interchangeable with every other token of the same series — and permissionless — anyone can hold one, anyone can send one to anyone else.

ERC-20 is a fantastic standard for cryptocurrencies. It is the wrong standard for a regulated security.

A regulated security has restrictions that ERC-20 cannot express:

- Only verified investors can hold it. Not just anyone with an Ethereum address.
- Some investors are restricted from certain jurisdictions. A U.S. citizen cannot hold a token offered under a Regulation S exemption to non-U.S. persons. An EU retail investor cannot hold a token offered only to professional investors.
- There may be holding limits. A single investor may not be able to accumulate more than 5% of the supply without triggering disclosure requirements.
- There are lock-up periods. Securities sold in a primary issuance cannot be resold for a defined period.
- The issuer may need to freeze tokens — for example, in response to a court order or to administer a corporate action.

A simple ERC-20 token has no concept of any of this. Anyone can send any token to anyone. The compliance, if any, has to be enforced off-chain by intermediaries.

ERC-3643 was designed to fix this by encoding compliance directly into the token contract.

## Where ERC-3643 came from

The standard was originally developed under the name **T-REX** (Token for Regulated Exchanges) by Tokeny, a Luxembourg-based tokenization infrastructure company, beginning in 2017. T-REX was used to issue some of the first regulated security tokens in Europe.

In 2021, the standard was submitted as an Ethereum Improvement Proposal, ultimately accepted and assigned the number ERC-3643. From that point onwards, ERC-3643 became a publicly available, audited reference implementation that any tokenization platform could adopt without licensing fees.

The standard has been independently audited multiple times. Tokeny publishes audit reports on its site; secondary audits have been performed by Hacken, Kapersky, and others. Adoption has grown across Europe to include platforms like Archax (UK), DigiShares (Denmark), and Polygon's own RWA initiatives. Nextoken Capital adopts the same reference implementation with two custom extensions described below.

## The three contracts that make ERC-3643 work

ERC-3643 is not a single contract. It's a system of three coordinated contracts.

### 1. The Token contract

The token contract is the recognisable part. It's an ERC-20-compatible contract that holds the balances of every holder. It supports the standard ERC-20 functions (`balanceOf`, `transfer`, `transferFrom`, `approve`, etc.) so that wallets, block explorers, and indexers can read it.

The critical addition is that every transfer is checked against two other contracts before it is allowed to proceed.

### 2. The Identity Registry

The Identity Registry is the on-chain mapping from "wallet address" to "verified identity claim." When an investor completes KYC with a trusted provider (in Nextoken Capital's case, Sumsub), the KYC provider signs an attestation that says, in effect, "I have verified that this wallet is controlled by an identity that meets the following criteria." Those criteria are encoded as numeric claim topics — for example, claim topic 1 might mean "passed KYC," claim topic 2 might mean "EU resident," claim topic 7 might mean "qualifies as professional investor."

The token contract, at transfer time, asks the Identity Registry: "Does the receiving address have the claims required to hold this token?" If yes, the transfer proceeds. If no, the transfer reverts.

The Identity Registry can be queried by anyone. Sensitive personal data is not on-chain; only the claim attestations and the linked addresses are. The actual identity documents live in the KYC provider's encrypted vault.

### 3. The Compliance contract

The Compliance contract encodes the issuance-specific rules. It is essentially a list of modular rule contracts that each get a vote on whether a transfer should proceed.

Examples of compliance rule modules:

- **Country restriction.** "This token may only be held by addresses whose registered identity is in the EEA."
- **Max balance.** "No address may hold more than 100,000 tokens."
- **Max investors.** "There may not be more than 500 distinct addresses holding this token."
- **Lock-up.** "Tokens minted before timestamp X cannot be transferred until timestamp Y."
- **Trading hours.** "Transfers are only permitted during defined hours, for jurisdictions where that applies."

Each rule module is itself a small audited contract. An issuer composes the rules they need for a specific offering. The Compliance contract is the orchestrator that asks each module in turn whether the transfer is permitted; if any module says no, the transfer is blocked.

## A transfer, step by step

When investor A wants to send 100 tokens to investor B, here's what happens inside the contracts:

1. Investor A's wallet calls `transfer(B, 100)` on the token contract.
2. The token contract calls `isVerified(B)` on the Identity Registry, passing the required claim topics for this token (e.g., "must have claim topics 1, 2, 7").
3. The Identity Registry returns true if B has all required claims, false otherwise.
4. If false, the transfer reverts. If true, the token contract calls `canTransfer(A, B, 100)` on the Compliance contract.
5. The Compliance contract iterates through every active rule module, calling each one with the transfer details.
6. If any module returns false, the transfer reverts. If all return true, the Compliance contract returns true.
7. The token contract updates the balances and emits a `Transfer` event for the indexers.

The whole process takes about 60,000-120,000 gas on Polygon, which corresponds to a transaction cost under €0.01 at typical gas prices. The added cost over a plain ERC-20 is real but small.

## What this means for an investor

If you're holding an ERC-3643 token, here are the practical consequences.

You cannot send the token to an arbitrary address. You can only send it to another verified investor who is whitelisted for the same token. Sending to your friend's non-KYC'd wallet will fail.

You cannot deposit the token to most centralized exchanges. Major exchanges generally do not support the ERC-3643 standard. The token has to be traded on a venue that understands the compliance contracts — like the platform that issued it.

You cannot use the token as collateral in most DeFi protocols. The same compatibility issue applies. Some DeFi protocols are building ERC-3643 awareness, but it is not yet widespread.

The issuer, with appropriate legal authority, can freeze or force-transfer your tokens. This is a feature, not a bug; it is what makes the token a legally enforceable security. Without it, a court order to seize criminal proceeds would be unenforceable. The freeze power is constrained in practice — it requires authority and is logged on-chain — but it exists.

You will know, on demand, the complete on-chain history of your token. From issuance to the present. This is qualitatively different from owning a traditional security through a chain of intermediaries, where the history is only accessible to the registrar.

## What this means for an issuer

If you're issuing an ERC-3643 token, you get a few important benefits.

You don't have to build the compliance infrastructure yourself. The standard provides it. You configure the rules; you don't write them.

You can use a single token contract to manage potentially thousands of investors across multiple jurisdictions, each with their own restrictions, automatically enforced.

Corporate actions — distributions, voting, communications — can be administered by reading the on-chain holder registry directly. You don't need a parallel off-chain registrar to know who your investors are at any moment in time.

You retain administrative control sufficient to comply with regulatory requirements. You can freeze tokens, you can force-transfer tokens in error cases, you can update the compliance rules as your jurisdiction's rules change.

You inherit an audited reference implementation, which is meaningful when you're issuing to retail. Smart contract risk is a real category; using a widely deployed, repeatedly audited standard reduces it.

## What this means for the platform

For a marketplace like Nextoken Capital, ERC-3643 is foundational because it makes a compliant secondary market possible. The exchange contract, when matching a trade between two whitelisted investors, doesn't have to re-verify their identities — the token's own compliance check does that automatically. The exchange contract can match and settle, and the underlying compliance is enforced by the token itself.

This is what enables 24/7 atomic settlement of regulated securities. Traditional securities settlement infrastructure assumes that compliance checking is the responsibility of the broker. ERC-3643 moves that responsibility into the token, which means the matching layer can be much thinner and much faster.

Nextoken Capital's specific implementation extends the reference ERC-3643 in two ways:

1. **Token factory.** Rather than letting each issuer deploy their own token contract, the platform deploys all tokens from a central, audited factory. This guarantees consistent compliance behaviour across the platform and reduces audit surface.
2. **Yield distributor.** A separate contract receives EUR e-money distributions from issuers and pro-rates them to current holders automatically based on the holder registry at the distribution snapshot block.

Both extensions are open-source and have been independently reviewed.

## Common misconceptions

A few things ERC-3643 is **not**:

- It is **not** a privacy layer. The on-chain history is fully transparent; what's private is the personal data, which lives in the KYC provider's database, not on-chain.
- It is **not** a guarantee that the underlying asset is real, valuable, or well-structured. The standard enforces compliance with the rules the issuer configures; it does not assess whether those rules, or the underlying asset, are good.
- It is **not** specific to any one blockchain. ERC-3643 originated on Ethereum but the implementation is portable to any EVM-compatible chain. Nextoken Capital deploys on Polygon for cost reasons; the standard works identically on Ethereum mainnet, Arbitrum, Base, or other EVM chains.
- It is **not** mandatory. There are competing standards — DS Protocol from Securitize, the ERC-1400 family, proprietary tokenization frameworks. ERC-3643 has emerged as the most widely audited and adopted public standard, but it is not the only option.

## Resources

The full ERC-3643 specification is at [https://eips.ethereum.org/EIPS/eip-3643](https://eips.ethereum.org/EIPS/eip-3643).

The reference implementation is open-source on GitHub under the T-REX repository.

Audit reports are published by Tokeny on their website.

For Nextoken Capital's specific deployment and the two custom extensions, see the [whitepaper](/whitepaper).

If you have technical questions about a specific listing's compliance configuration, contact us at [/contact](/contact).

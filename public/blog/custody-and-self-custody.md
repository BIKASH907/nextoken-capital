---
title: "Custody, Self-Custody, and What Happens If You Lose Your Wallet"
slug: "custody-and-self-custody"
excerpt: "What it means that Nextoken Capital is non-custodial, why that matters, what the trade-offs are, and what actually happens if you lose access to your wallet."
date: "2026-04-14"
author: "Nextoken Capital"
category: "Wallets"
readTime: "7 min"
---

# Custody, Self-Custody, and What Happens If You Lose Your Wallet

Nextoken Capital is a **non-custodial** marketplace. This is a deliberate architectural choice and it has real consequences for how you interact with the platform, how the platform interacts with the law, and what happens if something goes wrong. This post explains what non-custodial means in practice and how it differs from the custodial alternatives.

## What "non-custodial" actually means

In a non-custodial platform, the platform does not at any point hold your assets or your private keys. You connect a wallet that you control. You sign transactions with that wallet. When you buy a token, the token transfers from the issuer's wallet directly to your wallet. When you sell, the token transfers directly from your wallet to the buyer's wallet, in exchange for EURe transferred the other way. The platform's role is to operate the marketplace — the matching engine, the user interface, the compliance whitelist, the asset verification pipeline — but it never takes possession of your assets.

Contrast this with a traditional brokerage. When you buy a share through a brokerage, the share is held in the brokerage's omnibus account at a custodian. Your "ownership" is a bookkeeping entry on the brokerage's records. The brokerage can in principle re-hypothecate your assets, can become insolvent, can fail to deliver. Modern regulation (under MiFID II in the EU, under Regulation Best Interest in the US, etc.) mitigates these risks but doesn't eliminate them.

The non-custodial model removes the platform entirely from the chain of custody. Your assets are yours, on the blockchain, controlled by the private key that you alone hold.

## Why non-custodial

Three reasons.

**Eliminates platform-failure risk.** If Nextoken Capital ceased operations tomorrow, your tokens would still be in your wallet. They would still be on the Polygon blockchain. You would still be able to receive distributions (the yield distributor contract works regardless of platform status). You could transfer your tokens to other whitelisted investors using any Polygon-compatible interface that supports ERC-3643. The platform is the convenience layer, not the custody layer.

**Eliminates the temptation of misuse.** Platforms that hold customer funds have historically created scandals when their internal controls fail. FTX, Celsius, Mt. Gox. A non-custodial design simply doesn't put the platform in a position to misuse customer assets, because the platform never has them.

**Aligns with the legal structure of the offering.** When you buy a tokenized share of a real-estate SPV, the share is on the blockchain in your name. If you needed to enforce your rights as a shareholder — say, in a default scenario — you can prove ownership cryptographically, directly, without relying on a custodian's records.

## The trade-off: you are responsible for your wallet

The cost of self-custody is that you are responsible for the security of your wallet. Specifically:

**The private key.** Your wallet has a private key, typically derived from a 12-24 word seed phrase. Whoever controls the private key controls the assets in the wallet. The platform cannot recover your private key for you. If you forget your seed phrase and lose access to your device, you will lose access to your wallet.

**Security against theft.** If someone obtains your private key — through a phishing attack, malware, a compromised device, social engineering, or simply by finding your seed phrase written on a sticky note — they can transfer your assets and the transfer is irreversible.

**Security against accidents.** If you send tokens to a wrong address — perhaps a typo in a copy-paste — the transaction is irreversible. ERC-3643's transfer restrictions partially protect you (if you send to a non-whitelisted address, the transfer reverts), but a typo to another whitelisted address is permanent.

For most users with reasonable digital security hygiene, these risks are manageable. Use a reputable wallet (MetaMask, Coinbase Wallet, a hardware wallet like Ledger). Back up the seed phrase in a secure offline location — ideally written on paper or metal and kept in a safe. Don't share the seed phrase with anyone, ever. Verify transaction details before signing.

For high-value positions, consider a hardware wallet (Ledger, Trezor). Hardware wallets keep the private key in a dedicated secure element; even malware on your computer cannot extract it. Hardware wallets cost €60-200 and are the single most effective security upgrade for self-custody.

For very high-value positions, consider a multi-signature setup: a wallet that requires multiple keys to authorize a transaction, with each key on a separate hardware device. Multi-sig adds complexity and is overkill for most retail positions, but is standard practice for institutional self-custody.

## What if I lose my wallet anyway

Realistically, key loss happens. People drop hardware wallets in the river, forget seed phrases, have hard drive crashes without backups. What's the procedure?

For ERC-3643 tokens specifically, there is a procedure for recovery. The token contract includes a "recovery" function that allows the issuer (with the platform's authorization) to administratively re-issue tokens from a lost wallet to a replacement wallet, after appropriate verification.

The process:

1. **Notify the platform** that you have lost access to your wallet. Email `support@nextokencapital.com` with your registered email address and the wallet address you've lost access to.
2. **Complete identity re-verification.** We re-verify your identity (re-running KYC) and verify that you are the same person who originally controlled the lost wallet. This is the slow part of the process; we don't want to enable an attacker who has stolen your email to claim ownership of your tokens.
3. **Wait for the cooling-off period.** A 30-day waiting period applies between the recovery request and the recovery execution. During this period we publish the planned recovery to the original wallet address; if the actual owner has not lost the wallet, they can object.
4. **Verify the replacement wallet.** You provide a new wallet address and prove you control it (by signing a message with the new wallet's private key).
5. **Execute the recovery.** After the cooling-off period, we instruct the token contract to transfer your tokens from the old wallet to the new wallet. EURe held in the old wallet cannot be recovered this way — that's outside the platform's control — but tokens issued by the platform's factory contract can be.

The recovery procedure exists because regulators reasonably expect that lost securities can be recovered, and because we cannot have a situation where a forgotten seed phrase results in genuinely permanent loss of investor assets. The trade-off is the 30-day cooling-off period and the re-KYC, which exist to prevent abuse.

## What if my wallet is hacked

Different scenario, different procedure. If your wallet is compromised — you discover transfers you didn't authorize — the procedure is faster and more constrained:

1. **Report immediately** to `security@nextokencapital.com` with the wallet address and approximate time of the suspected compromise.
2. **We can freeze the affected token positions** within minutes of the report. ERC-3643's freeze function lets us temporarily prevent transfers from the affected wallet pending investigation.
3. **We investigate** — typically by reviewing on-chain transaction history, IP and device logs for recent platform access, and the timing of suspected unauthorized transfers.
4. **Where the report is well-founded**, we initiate a recovery process similar to the lost-wallet flow, with re-KYC and verification of a new wallet.
5. **Where the report is not supported by evidence** — for example, the transfers were authorized by the actual user under social engineering or a scam — the recovery may not proceed and the user may need to pursue civil remedies.

This is one of the legitimate reasons the ERC-3643 standard includes administrative powers for the issuer and platform. A pure permissionless token (like a generic ERC-20) has no such mechanism; once compromised, the assets are gone. A regulated security token has, by design, a recovery path.

## EURe vs tokens — different custody

It's worth distinguishing between the security tokens on the platform and the EURe stablecoin used to pay for them.

The security tokens are issued by Nextoken Capital's token factory under the ERC-3643 standard. They have the recovery mechanism described above.

EURe is issued by Monerium EMI, a separate regulated EU e-money institution. Monerium has its own recovery procedures for lost wallets, governed by its own terms of service and the EU's e-money regulation. If you lose access to a wallet that holds EURe, you contact Monerium directly to initiate their recovery flow. We can help with introductions and verification, but the EURe is Monerium's product, not ours.

In practice this means: for security-token recovery, contact us. For EURe recovery, contact Monerium. We can advise on both and assist with both.

## Why not just custodial

After reading the recovery procedures, you might reasonably ask: why not just have a custodial platform where the platform holds your wallet, and you log in with a password?

It's a legitimate question. The answer has three parts.

**Regulatory.** A custodial platform must be authorised to provide custody — that's a specific MiCA authorisation, with capital requirements, segregation requirements, insurance requirements, and liability for losses. Nextoken Capital's CASP application includes custody authorisation, but the platform's preferred default is non-custodial.

**Risk concentration.** A custodial platform with millions of customers holding billions of euros is a high-value target for attackers and a source of systemic risk. Non-custodial design distributes the risk across individual wallets; an attacker would have to compromise wallets one at a time.

**User sovereignty.** Many users — particularly those who came to tokenized assets via prior crypto experience — explicitly value self-custody. They don't want to depend on the platform's continued operation, the platform's password security, or the platform's solvency. Non-custodial gives them that.

For users who prefer custodial convenience over self-custody sovereignty, the platform can offer a custodial option (subject to the relevant authorisation). The default, and our recommendation for most users, is non-custodial.

## Practical recommendations

For most retail investors getting started:

1. Use MetaMask, Coinbase Wallet, or another reputable EVM wallet for amounts up to a few thousand euros.
2. Write down the seed phrase on paper. Store it in two physically separated secure locations (e.g., one at home in a safe, one with a trusted family member or in a bank safe deposit box).
3. Never type the seed phrase into a website, never share it with support staff, never store it digitally.
4. Verify transaction details before signing — the recipient address, the amount, the network.

For investors with larger positions:

1. Add a Ledger or Trezor hardware wallet. Move significant positions to the hardware-wallet address.
2. Consider a separate "hot" wallet for active trading and a "cold" hardware wallet for long-term holdings.
3. Test the recovery flow on a small position before relying on it.

For institutional users:

1. Multi-signature setup with separate hardware devices held by separate individuals.
2. Written internal procedures for transaction authorisation, key management, and recovery.
3. Periodic audits of custody arrangements.
4. Insurance coverage for digital asset custody (specialist insurance is available through brokers familiar with the category).

## The bottom line

Non-custodial design is a deliberate trade-off: you take on responsibility for your wallet's security, in exchange for not having to trust the platform with your assets. For investors comfortable with basic digital security, the trade-off is favorable. For investors who would prefer custodial convenience, the platform can accommodate that under the appropriate authorisation.

In either case, you are not without a safety net. The ERC-3643 standard's administrative recovery mechanisms, combined with the platform's KYC and identity-verification infrastructure, provide a documented path back from key loss or compromise. The path is slow by design — a 30-day cooling-off period exists to prevent abuse — but it is real and it works.

If you have questions about wallet security for a specific position size or use case, [contact us](/contact) and we can advise.

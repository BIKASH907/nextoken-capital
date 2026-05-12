# Nextoken Capital
## A Regulated Marketplace for Tokenized Real-World Assets

### Whitepaper — Version 1.0

**Nextoken Capital UAB**
Gynėjų g. 14, Vilnius 01109, Lithuania
[https://nextokencapital.com](https://nextokencapital.com)

---

## Abstract

Nextoken Capital is a non-custodial marketplace for tokenized real-world assets (RWAs) registered in the Republic of Lithuania and operating under the European Union financial regulatory framework. The platform connects asset issuers — including real estate developers, corporate bond issuers, energy project sponsors, and equity issuers — with global retail and institutional buyers through a smart-contract settlement layer on the Polygon blockchain.

This whitepaper presents the architecture, regulatory positioning, token standard, custody model, KYC/AML approach, settlement mechanics, and risk framework underlying the Nextoken Capital platform. We describe how the ERC-3643 permissioned security token standard, combined with the Sumsub identity layer and the Monerium EUR e-money rails, produces a marketplace where every share of every asset has a verifiable on-chain provenance, a clear legal claim against the issuer, and a transparent fee structure denominated in euros.

The document is intended for prospective investors, asset issuers, compliance counterparties, regulators, and ecosystem partners. It is descriptive of the platform as designed and is not an offer to sell securities. Investment in tokenized assets carries material risk including total loss of capital; readers should consult the risk disclosure in Section 11 and seek independent professional advice before participating.

---

## Table of Contents

1. Introduction
2. The RWA Opportunity
3. Platform Architecture
4. Regulatory Framework
5. The ERC-3643 Security Token Standard
6. Custody and Settlement Model
7. KYC, AML and Sanctions Screening
8. Asset Onboarding and Verification
9. Fees and Economics
10. Secondary Market and Liquidity
11. Risk Disclosure
12. Roadmap
13. About the Issuer
14. Glossary

---

## 1. Introduction

Traditional capital markets are characterized by three structural inefficiencies that Nextoken Capital is designed to address.

**Fragmentation.** A typical real-estate investment opportunity in continental Europe is offered through a private placement to a small set of intermediated investors. The same is true of corporate bond issuance below a certain ticket size and of growth-stage equity rounds. Each opportunity is a private fund, a special purpose vehicle, or a bilateral agreement; the documentation, custody, and settlement infrastructure must be rebuilt for every transaction.

**Inaccessibility.** Minimum ticket sizes for institutional-grade investments routinely exclude retail and high-net-worth individuals. A typical commercial real-estate fund requires €100,000 or more. Corporate bonds settle in increments of €100,000 nominal in many European markets. Private equity funds are reserved for qualifying institutional investors.

**Opacity.** Once an investor has subscribed to an opportunity, ongoing reporting is typically quarterly and document-based. The investor has limited insight into the asset's performance, ownership ledger, or fellow investors. Secondary liquidity is administered by the issuer or its agent and is often discretionary.

Nextoken Capital addresses these issues by introducing a single, regulated, on-chain marketplace where assets from multiple issuers are tokenized to a common standard, sold in fractions as small as €100, settled atomically against EUR e-money, and reported through public blockchain transactions. The marketplace is non-custodial — investors hold their own tokens in their own wallets — and supervised by the Bank of Lithuania.

The platform is a marketplace, not an investment fund. Nextoken Capital does not select assets, manage capital, or provide investment advice. The platform's role is to admit eligible issuers, verify their offerings, and provide compliant infrastructure for the offer-and-acceptance, settlement, and ongoing reporting of tokenized securities.

## 2. The RWA Opportunity

Real-world asset tokenization — the issuance of digital securities that represent legal claims against off-chain assets — has emerged as one of the largest application categories on public blockchain infrastructure. Industry estimates place the addressable market for tokenized real-world assets in excess of US$10 trillion by 2030, driven by three converging trends.

The first is regulatory: the EU's Markets in Crypto-Assets Regulation (MiCA), the Digital Operational Resilience Act (DORA), and the DLT Pilot Regime have for the first time produced a coherent framework for the issuance and secondary trading of regulated digital assets. The United Kingdom, Switzerland, Singapore, and the United Arab Emirates have produced similar frameworks. Issuers and buyers can now transact under regulatory certainty in a way that was not possible during the 2017-2020 period.

The second is technical: the ERC-3643 standard, originally developed under the T-REX framework by Tokeny, has matured into the de-facto European standard for permissioned, compliant security tokens. The standard provides on-chain transfer restrictions, whitelisting of approved investors, programmatic compliance hooks, and integration with KYC providers. It is independently audited, used by multiple regulated tokenization platforms, and broadly compatible with custody and trading infrastructure.

The third is economic: tokenization measurably reduces the cost of issuance, the cost of distribution, the cost of post-trade settlement, and the cost of ongoing reporting. McKinsey and the Boston Consulting Group have published estimates ranging from a 30% to a 90% reduction in total cost-of-ownership across the lifecycle of a security versus traditional securities infrastructure.

Nextoken Capital is positioned to capture a share of this opportunity by being one of a small number of EU-registered platforms operating end-to-end under MiCA, EMI, and ERC-3643 from launch.

## 3. Platform Architecture

The Nextoken Capital platform is composed of seven layers, each of which can be operated, audited, and upgraded independently.

**Layer 1 — Identity.** All platform participants — investors, issuer principals, and operators — are identified through the Sumsub global KYC and AML provider. Sumsub performs document verification, biometric matching, liveness detection, sanctions screening against the EU consolidated sanctions list and the OFAC SDN list, and politically exposed person (PEP) screening. Identity proofs are linked to platform wallets at the time of whitelisting.

**Layer 2 — Wallet.** Investors connect a self-custodied EVM-compatible wallet (MetaMask, Coinbase Wallet, Trust Wallet, Brave Wallet, Phantom, OKX Wallet, Ledger, or WalletConnect-compatible mobile wallets). The platform never holds investor private keys; it never holds investor funds in a custody account. The act of investing is a transaction signed by the investor's wallet that transfers EUR e-money from the investor's address to the issuer's address in exchange for a security token transferred from the issuer's address to the investor's address.

**Layer 3 — Payments.** Euro settlement is conducted through the Monerium EURe stablecoin, a EUR-pegged e-money token issued by Monerium EMI ehf., a regulated EU electronic money institution. Investors load EURe to their wallet via SEPA bank transfer; EURe redeems 1:1 to EUR back to the investor's bank account at any time. EURe is denominated in euros, fully reserved, and supervised under Icelandic and EEA financial regulation.

**Layer 4 — Security Tokens.** Every asset listed on Nextoken Capital is issued as an ERC-3643 security token on the Polygon blockchain. The token contract enforces transfer restrictions (only whitelisted investors may receive tokens), compliance rules (jurisdiction-based eligibility, holding limits, lock-up periods), and ownership transparency (all holders are visible on the blockchain explorer).

**Layer 5 — Marketplace.** The Nextoken Capital web application is the user-facing layer. It surfaces verified offerings, enables KYC enrollment, presents asset documentation, processes buy and sell orders, and reports portfolio composition and earnings to logged-in investors. The marketplace is delivered through a Next.js application hosted on Vercel with a global content delivery network and TLS 1.3 transport.

**Layer 6 — Compliance.** A back-office compliance module performs ongoing transaction monitoring, blocked-address checking, and suspicious-activity reporting. Records are retained for the duration mandated by Lithuanian and EU AML regulation. Compliance officers review and approve high-value transactions and asset listings.

**Layer 7 — Reporting.** Issuers publish ongoing reports — quarterly distributions, annual financial statements, material events — through the platform. Investors receive notifications and can download reports as PDFs from their dashboard.

## 4. Regulatory Framework

Nextoken Capital UAB is registered in the Republic of Lithuania under company number to be confirmed in the public registry, with its registered office in Vilnius. The company operates under the supervision of the Bank of Lithuania (Lietuvos bankas), the national competent authority for financial services in Lithuania.

The platform's regulatory posture has three pillars.

**Electronic Money Institution.** The company holds, or is in the process of obtaining, an EMI license from the Bank of Lithuania. The EMI license authorizes the issuance, distribution, and redemption of electronic money and the provision of related payment services. The EMI license is governed by the EU's Second E-Money Directive (2EMD) and the EU's revised Payment Services Directive (PSD2), and is passportable across all 27 EU member states and the broader European Economic Area.

**MiCA Authorization.** Nextoken Capital has filed for authorization as a Crypto-Asset Service Provider (CASP) under the EU's Markets in Crypto-Assets Regulation (MiCA), Regulation (EU) 2023/1114. MiCA, which entered into force across the EU on 30 December 2024 for CASPs, establishes a single rulebook for the offering, marketing, and trading of crypto-assets. A CASP license authorizes the platform to operate a trading platform for crypto-assets, execute orders, and provide custody and administration services on behalf of clients. The MiCA application is in active review with the Bank of Lithuania.

**ERC-3643 Compliance.** The token standard itself is designed to implement on-chain the compliance rules that off-chain regulation requires. Every transfer is checked against an on-chain whitelist before settlement, ensuring that only KYC-verified, eligible investors can hold the security token. This is sometimes referred to as "regulation-in-code."

In addition to these pillars, Nextoken Capital is compliant with:

- The General Data Protection Regulation (GDPR), Regulation (EU) 2016/679, governing the processing of personal data.
- The 6th Anti-Money Laundering Directive (6AMLD), Directive (EU) 2018/1673, governing AML, counter-terrorist financing, and proceeds-of-crime controls.
- The Financial Action Task Force (FATF) recommendations for virtual asset service providers, including the so-called Travel Rule, requiring identification of originator and beneficiary on transactions above defined thresholds.
- The Digital Operational Resilience Act (DORA), Regulation (EU) 2022/2554, governing the operational resilience of EU financial entities including cyber security, incident reporting, and third-party risk management.

Nextoken Capital does not at this time hold an investment firm license under the Markets in Financial Instruments Directive II (MiFID II); transactions on the platform are structured as either crypto-asset transactions under MiCA, or as direct issuer-to-investor primary subscriptions where the relevant exemption from prospectus requirements applies. Where an issuer's offering exceeds the prospectus threshold or otherwise requires MiFID II authorization, that issuer is responsible for obtaining the necessary authorization or partnering with a licensed entity.

The regulatory information presented in this section is descriptive of the platform's intended posture. License status, application status, and the specifics of authorization are subject to ongoing regulatory review and may change. Investors should consult the current licensing disclosure published on the platform at https://nextokencapital.com/compliance for the most accurate, up-to-date information.

## 5. The ERC-3643 Security Token Standard

ERC-3643 is an Ethereum Request for Comment that defines a token interface for permissioned security tokens. The standard was originally developed under the T-REX framework by Tokeny in Luxembourg and has been adopted by a broad consortium of regulated tokenization platforms across Europe.

The standard extends the well-known ERC-20 fungible token interface with three additional concepts: an on-chain identity registry, an on-chain compliance contract, and an on-chain token holder registry.

**Identity Registry.** Every wallet that wishes to hold an ERC-3643 token must first be registered against a verified identity. The identity is established by a trusted KYC provider (in Nextoken Capital's case, Sumsub) which signs an on-chain attestation linking the wallet address to a verified individual. Wallets without a registered identity cannot receive ERC-3643 tokens.

**Compliance Contract.** Each ERC-3643 token contract is linked to a compliance contract that enforces rules at the time of transfer. Rules can include jurisdiction restrictions (e.g., a token can only be transferred to wallets registered to residents of EEA jurisdictions), holding limits (e.g., no single investor may hold more than 5% of the total supply), lock-up periods (e.g., tokens may not be transferred for the first six months after issuance), and any other rule expressible in Solidity.

**Holder Registry.** The list of all current token holders is queryable on-chain. The issuer can read the registry to administer corporate actions — distributions, voting, communications — without maintaining a parallel off-chain ledger.

The implementation has been independently audited (audit reports available from Tokeny and from secondary auditors) and is deployed at scale across European platforms. Nextoken Capital deploys a fork of the standard reference implementation with two extensions:

1. **Multi-issuer factory.** Issuers do not deploy their own token contracts; instead the platform deploys a token from a central factory contract, ensuring consistent compliance behavior across all listings.
2. **Yield distribution.** A separate yield distributor contract receives EURe distributions from issuers and pro-rates them to current holders based on the on-chain holder registry, eliminating the need for an off-chain registrar.

Token holders should understand the following constraints introduced by the standard:

- Tokens can only be transferred to other whitelisted investors. They cannot be sent to a friend's non-KYC'd wallet, deposited to an exchange that does not support ERC-3643, or used as collateral in DeFi protocols that have not integrated the standard.
- The issuer, with the platform's authorization, retains the ability to freeze tokens or forcibly transfer tokens in cases of court order, mistaken issuance, or fraud. This is a feature of the standard, not a bug; it is what makes the token a legally enforceable security rather than a bearer instrument.
- The transfer-restriction layer adds approximately 30,000-80,000 gas per transfer over a standard ERC-20, depending on the complexity of the compliance rules. On the Polygon network, this corresponds to a transfer cost of less than €0.01 at typical gas prices.

## 6. Custody and Settlement Model

Nextoken Capital is structured as a non-custodial marketplace. The platform does not at any point in the transaction lifecycle hold investor funds or investor securities.

The settlement model has three properties that distinguish it from traditional securities settlement.

**Atomic settlement.** The exchange of EUR (in the form of EURe) and the security token occurs in a single blockchain transaction. The transaction either succeeds in full — both the EURe and the security token change hands — or it reverts in full and neither moves. There is no settlement period during which counterparty risk exists.

**Direct from issuer.** When an investor buys a token on the primary market, the EURe paid by the investor is transferred directly to the issuer's wallet. The platform does not custody the funds. When a distribution is made, the EURe distributed by the issuer is transferred directly to the holders' wallets. The platform does not intermediate the distribution.

**On-chain provenance.** Every transfer is recorded on the Polygon blockchain. The blockchain explorer (https://polygonscan.com) shows a complete history of every token: who issued it, who has held it, who currently holds it. The history is cryptographically verifiable and cannot be retroactively altered.

The role of Nextoken Capital in this model is to operate the matching engine that pairs buyers with sellers (or with the issuer in the primary market), to host the wallet whitelisting infrastructure, to provide the user interface, to perform issuer due diligence, and to provide compliance oversight. The platform's continued operation is not required for an investor to retain custody of their tokens; the tokens persist on the public blockchain regardless of platform status.

Investors are reminded that self-custody implies self-responsibility for the security of the wallet's private key. Loss of the private key results in permanent loss of access to the held tokens, although Nextoken Capital, with court authorization, can administratively reissue tokens to a replacement wallet in cases of well-evidenced key loss.

## 7. KYC, AML and Sanctions Screening

Every individual participating in the Nextoken Capital marketplace — whether as an investor, an issuer principal, or a platform user with any account-level privileges — completes a tiered identity verification process before any transactions are permitted.

**Tier 1 — Basic verification.** Email verification, phone verification, and submission of one government-issued photo identification document (passport, EU national ID card, or driver's license). Sumsub performs document authenticity checks, optical character recognition extraction of the document data, and a biometric face match between the document photo and a live selfie captured by the user's camera. Tier 1 verification permits investment up to €1,000 cumulative.

**Tier 2 — Standard verification.** Tier 1 plus proof of residential address (utility bill, bank statement, or government letter dated within the last three months) and source-of-funds declaration. Tier 2 verification permits investment up to €50,000 cumulative.

**Tier 3 — Enhanced verification.** Tier 2 plus enhanced due diligence on the source of funds, additional document verification, and screening for political exposure or sanctions exposure. Tier 3 verification removes the cumulative limit.

In addition to the tiered verification, every user is continuously screened against:

- The EU Consolidated Financial Sanctions List, maintained by the European External Action Service.
- The Office of Foreign Assets Control Specially Designated Nationals (OFAC SDN) list, maintained by the U.S. Department of the Treasury.
- The UN Security Council Consolidated List.
- The list of Politically Exposed Persons maintained by Sumsub's PEP database and supplementary jurisdictional lists.
- Adverse-media screening for negative news referencing money laundering, terrorism financing, or organized crime.

Sanctions screening is rerun on every user nightly; a positive match results in an immediate account freeze pending review.

The Travel Rule requires that, for transactions above €1,000 (the EU implementation threshold), the platform identify both the originating and the beneficiary party. Nextoken Capital implements the Travel Rule through the IVMS 101 messaging standard, which is the FATF-recommended technical implementation. The platform participates in Travel Rule networks (Sumsub TRP, Notabene) so that the originator and beneficiary information accompanying a transfer can be exchanged with the counterparty's compliance system before the on-chain transfer is initiated.

All AML records are retained for the duration mandated by Lithuanian law, currently eight years from the end of the customer relationship.

## 8. Asset Onboarding and Verification

No asset is listed on Nextoken Capital without passing a five-step verification pipeline. The pipeline is operated by the platform's compliance team and is documented for every listing in the asset's listing dossier, available to investors before purchase.

**Step 1 — Issuer KYB.** The legal entity issuing the asset undergoes Know Your Business verification. This includes verification of incorporation documents, identification of all ultimate beneficial owners (UBOs) holding 25% or more of the issuer, sanctions screening of the entity and its principals, and assessment of the entity's financial standing.

**Step 2 — Due diligence.** The financial substance of the underlying asset is reviewed. For real estate, this includes title verification, valuation by an independent surveyor, lease-roll analysis if applicable, and cash flow projections. For bonds, this includes review of the issuer's audited financial statements, credit analysis, and review of any rating agency assessments. For equity, this includes review of cap table, audited financials, business plan, and 409A or equivalent valuation.

**Step 3 — Legal review.** The legal structure of the token is reviewed against the asset structure. The platform's legal counsel verifies that the token represents the economic rights it purports to represent, that the rights are enforceable under the relevant jurisdiction's law, and that the issuance complies with applicable prospectus, marketing, and disclosure requirements.

**Step 4 — Contract audit.** The ERC-3643 token contract specific to the listing — particularly the compliance rules encoded in the linked compliance contract — is reviewed by the platform's smart contract security team and, for issuances above a defined materiality threshold, by an external auditor.

**Step 5 — Approval.** The platform's compliance committee meets to approve or decline the listing based on the documentation produced in Steps 1-4. A unanimous vote is required for approval. The committee includes the Chief Compliance Officer, the Head of Legal, and the CEO.

The pipeline typically takes between four and twelve weeks per asset, depending on the complexity of the underlying structure and the responsiveness of the issuer. Issuers who fail any step may remediate and re-apply.

Once approved, an asset is published to the marketplace with a complete listing dossier including the issuer's KYB summary, the due diligence report, the legal opinion, the audit summary, the token contract address, the offering terms, the projected returns, and the risk factors.

## 9. Fees and Economics

Nextoken Capital operates a transparent, all-in fee structure that is disclosed before any purchase. There are no hidden custody fees, no management fees, no carry, and no surprise charges.

**Primary market fee.** When an investor purchases a security token on the primary market (directly from the issuer), the platform charges a fee of 0.2% of the transaction value, paid by the issuer at the time of settlement. The investor pays no platform fee on a primary subscription.

**Secondary market fee.** When two investors trade a security token on the platform's secondary market (the orderbook exchange), each side pays a fee of 0.1% of the transaction value, payable to the platform at the time of settlement. Total round-trip fee is 0.2%.

**Issuer listing fee.** Issuers pay a one-time listing fee that covers the platform's cost of the verification pipeline described in Section 8. The fee is disclosed to the issuer at the start of the engagement and depends on the complexity of the asset; typical fees range from €5,000 for a straightforward bond to €50,000 for a complex multi-jurisdiction real-estate vehicle.

**Network fees.** All on-chain transactions incur a small gas fee paid in MATIC (the native currency of the Polygon network) to the network's validators. Typical gas costs for a Nextoken transaction are under €0.05 at prevailing rates. The investor or issuer initiating the transaction pays the gas; the platform does not subsidize or surcharge gas.

**Distribution pass-through.** When an issuer makes a distribution to token holders, the platform's yield distributor contract pro-rates the EURe to holders based on the on-chain ownership registry. No fee is charged on distributions.

For comparison, traditional European real-estate funds typically charge 1-2% annual management fees, 5-10% subscription fees, and 20-30% performance fees, in addition to the underlying property management costs. Nextoken Capital's all-in fee structure is approximately 90% lower over a typical five-year holding period.

## 10. Secondary Market and Liquidity

A core innovation of tokenized securities versus traditional fund structures is the possibility of liquid secondary trading. Tokens can be traded peer-to-peer, twenty-four hours a day, seven days a week, with atomic settlement.

Nextoken Capital operates a continuous-orderbook exchange for secondary trading of its listed tokens. The exchange is a smart-contract-based limit-order book deployed on Polygon. Orders are matched on a price-time priority basis. The exchange contract enforces the same ERC-3643 transfer restrictions as the underlying tokens, ensuring that only whitelisted investors may participate.

The exchange is non-custodial: investors place orders that are escrowed in the exchange contract, and matched orders settle directly between the counterparties' wallets in a single atomic transaction. The platform does not custody resting orders' tokens or funds; the exchange contract does.

Secondary liquidity is not guaranteed. Liquidity in tokenized real-world assets is generally less than liquidity in publicly listed equities; bid-ask spreads can be wide, particularly for smaller listings or in volatile market conditions. Investors should treat tokenized RWA investments as having moderate-to-low liquidity and should not invest funds that they may need to access on short notice.

To support liquidity, Nextoken Capital is integrated with selected market makers who provide continuous two-sided quotes on listed assets above a minimum size threshold. Market makers are independent counterparties to Nextoken Capital; the platform does not warrant their performance.

Lock-up periods, if any, are disclosed in the listing dossier and enforced on-chain through the compliance contract. Lock-up periods are typical of primary issuances of equity and may range from 6 to 24 months.

## 11. Risk Disclosure

Investment in tokenized real-world assets carries material risk including the risk of total loss of capital. The risks described in this section are illustrative and not exhaustive. Investors should review the listing dossier of each asset before purchase, should consult independent financial, tax, and legal advice, and should not invest more than they can afford to lose.

**Capital risk.** The value of a tokenized security can fall as well as rise. Returns may be lower than expected. The investor may lose all or part of their investment.

**Liquidity risk.** Secondary liquidity is not guaranteed. An investor may be unable to sell a tokenized security at the desired time, the desired price, or at all.

**Credit and counterparty risk.** Each tokenized security represents a claim against a specific issuer. If the issuer defaults, becomes insolvent, or otherwise fails to perform, the investor's recovery may be partial or zero. Nextoken Capital is not a guarantor of any issuer's obligations.

**Regulatory risk.** The regulatory framework for tokenized securities is evolving. Changes in law, in regulatory interpretation, or in the licensing status of Nextoken Capital, its partners, or any specific issuer could affect the legal status, transferability, or value of a tokenized security.

**Technology risk.** The platform depends on the Polygon blockchain, the Monerium EURe stablecoin, the ERC-3643 token standard, the Sumsub identity infrastructure, and a number of other technical components. A failure, exploit, or unavailability of any of these components could affect platform availability or the value of tokens held.

**Smart contract risk.** Although the ERC-3643 reference implementation has been independently audited and the platform performs additional audits on specific deployments, smart contract code carries the inherent risk of undiscovered vulnerabilities. An exploit could result in the loss of all tokens or funds held in an affected contract.

**Custody risk.** Investors who self-custody their tokens are responsible for the security of their wallet's private keys. Loss, theft, or compromise of a private key may result in the permanent loss of access to held tokens. Nextoken Capital cannot recover keys.

**Forex risk.** Tokens are denominated in EURe (effectively EUR). Investors whose home currency is not EUR are exposed to EUR-to-home-currency exchange-rate movements over the holding period.

**Tax risk.** The tax treatment of tokenized securities varies by jurisdiction and is evolving. Investors are responsible for understanding and complying with the tax obligations in their jurisdiction of residence.

**Concentration risk.** Investing in a small number of tokenized assets carries higher idiosyncratic risk than investing in a diversified portfolio. Investors should consider diversification across asset categories, issuers, and geographies.

This risk disclosure is a summary. Each listing on the platform carries its own asset-specific risk disclosure that should be reviewed before purchase.

## 12. Roadmap

Nextoken Capital's product and regulatory roadmap is structured around four phases. Dates are indicative and subject to regulatory approval and technical milestones.

**Phase 1 — Foundation (completed Q3 2025).** Platform launch, Bank of Lithuania EMI authorization, ERC-3643 token factory deployed on Polygon mainnet, Sumsub integration, Monerium integration, first three asset listings.

**Phase 2 — Marketplace (Q4 2025 to Q2 2026).** MiCA CASP authorization received. Secondary market exchange launched. Expansion of asset categories to include corporate bonds and renewable energy. Onboarding of selected market makers. Target: 20-30 active listings, €50-100M cumulative platform issuance.

**Phase 3 — Institutional (Q3 2026 to Q4 2026).** Onboarding of institutional investors (regulated funds, family offices) under the platform's enhanced KYC tier. API for programmatic access. Integration with established custody providers for institutional self-custody alternatives. Cross-border passporting to additional EU member states. Target: €500M cumulative platform issuance.

**Phase 4 — Ecosystem (2027 onward).** Cross-chain expansion (settlement on additional EVM-compatible chains where compliant), DeFi integrations for ERC-3643-aware lending protocols, formal listing of NextokenCapital's own utility/governance token subject to applicable approvals, possible expansion to non-EU jurisdictions through regulated partnerships.

The roadmap is forward-looking. It is not a guarantee of performance, timing, or scope. Investors should not rely on roadmap items in making investment decisions.

## 13. About the Issuer

Nextoken Capital UAB is a Lithuanian private limited company (Uždaroji Akcinė Bendrovė) registered with the Lithuanian Centre of Registers. The company was founded in 2022 with the mission of building EU-regulated infrastructure for tokenized real-world assets.

The company is based in Vilnius, the capital of Lithuania and one of the EU's emerging fintech hubs. Vilnius hosts a concentrated cluster of EU-licensed payment institutions, e-money institutions, and crypto service providers and is consistently ranked among the most fintech-friendly cities in the European Union.

The founding team combines capital markets, blockchain, and regulatory experience. The CEO and founder is Bikash Bhat, a fintech entrepreneur with prior experience in capital markets infrastructure. Public profile: https://www.linkedin.com/in/bikash-bhat-87700318a

The company will publish full team biographies, advisor list, and equity ownership disclosure on its About page as the team scales and the MiCA authorization progresses.

Nextoken Capital is funded by a combination of founder capital and seed funding. The company is not currently raising additional capital but may do so in future under appropriate authorizations.

For investor relations enquiries, press, partnership, or compliance enquiries, the relevant contact email addresses are published on https://nextokencapital.com/contact.

## 14. Glossary

**AML.** Anti-Money Laundering. The framework of laws, regulations, and procedures designed to prevent the financial system from being used to launder criminal proceeds.

**Atomic settlement.** A settlement model in which two or more value transfers occur in a single, all-or-nothing transaction.

**CASP.** Crypto-Asset Service Provider. The MiCA regulatory category for entities providing crypto-asset services in the EU.

**Custody.** The holding of assets on behalf of an owner. Non-custodial means the platform does not hold the assets; the owner holds them directly.

**DLT.** Distributed Ledger Technology. A category of technologies in which a database is replicated and synchronized across multiple participants. Blockchain is a specific type of DLT.

**EMI.** Electronic Money Institution. An EU regulatory category for entities authorized to issue and manage electronic money.

**ERC-3643.** A token standard for permissioned security tokens. See Section 5.

**EURe.** A EUR-pegged e-money token issued by Monerium EMI on the Polygon and other blockchains. Redeemable 1:1 for EUR.

**FATF.** Financial Action Task Force. The intergovernmental body that sets AML and counter-terrorism financing standards.

**Gas.** The fee paid to validators of a blockchain network for processing a transaction. On Polygon, gas is denominated in MATIC.

**KYB.** Know Your Business. The application of KYC principles to corporate entities.

**KYC.** Know Your Customer. The process of verifying the identity of a customer.

**MiCA.** Markets in Crypto-Assets Regulation. The EU's comprehensive regulatory framework for crypto-assets, in force as of 30 December 2024.

**Monerium.** An EU-licensed e-money institution issuing the EURe stablecoin used for euro settlement on the Nextoken Capital platform.

**PEP.** Politically Exposed Person. An individual entrusted with prominent public functions, subject to enhanced AML scrutiny.

**Polygon.** A proof-of-stake EVM-compatible blockchain network optimized for low transaction costs and high throughput.

**RWA.** Real-World Asset. An off-chain asset (real estate, bond, equity, commodity) represented on a blockchain via a digital token.

**Sumsub.** A global KYC and AML provider used by Nextoken Capital for identity verification, sanctions screening, and ongoing monitoring.

**Travel Rule.** A FATF recommendation requiring financial institutions to share originator and beneficiary information for transactions above defined thresholds.

**UBO.** Ultimate Beneficial Owner. The natural person(s) who ultimately own or control a legal entity.

**Whitelisting.** The process of marking a wallet address as eligible to hold a particular security token, after the underlying identity has been KYC-verified.

---

### Notice

This document is informational and does not constitute an offer to sell or a solicitation to buy any security. It does not constitute investment, legal, tax, or financial advice. The information contained in this document is subject to change without notice and may not be current as of the date of reading. The platform's regulatory status, license status, and product offerings are subject to ongoing regulatory review.

Investment in tokenized real-world assets is risky. Investors may lose all or part of their investment. Past performance is not indicative of future results. Investors should consult their own professional advisors before making investment decisions and should review the asset-specific listing dossier and risk disclosure for each potential investment.

This whitepaper is published by Nextoken Capital UAB, Gynėjų g. 14, Vilnius 01109, Lithuania. © 2026 Nextoken Capital UAB. All rights reserved.

**Version 1.0 — Document prepared 2026.**

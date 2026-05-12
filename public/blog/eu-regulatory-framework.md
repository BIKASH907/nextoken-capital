---
title: "The EU Regulatory Framework for Tokenized Assets"
slug: "eu-regulatory-framework"
excerpt: "A map of the EU regulations that touch tokenized real-world assets: MiCA, MiFID II, DORA, GDPR, AMLD6, the DLT Pilot Regime, and how they fit together."
date: "2026-04-12"
author: "Nextoken Capital"
category: "Regulation"
readTime: "9 min"
---

# The EU Regulatory Framework for Tokenized Assets

Tokenization of real-world assets in the European Union sits at the intersection of three regulatory worlds: traditional securities law, the new crypto-asset regime, and the broader frameworks for data protection, anti-money-laundering, and operational resilience. Understanding how they fit together is essential whether you're an investor evaluating a platform, an issuer considering a token offering, or a service provider building infrastructure.

This post is a map of that regulatory landscape. We'll look at each major regulation, what it covers, who it applies to, and how it interacts with the others.

## The big picture in one paragraph

A tokenized real-world asset issued in the EU is generally a financial instrument under MiFID II, supplemented by MiCA for the crypto-asset aspects of how it is traded and custodied. The issuer must comply with prospectus rules (Prospectus Regulation) or the relevant exemption. The platform on which it trades must be authorised — typically as a CASP under MiCA, possibly combined with other licenses. The platform must comply with AML obligations under AMLD6. It must protect personal data under GDPR. It must meet operational resilience standards under DORA. If the issuance uses experimental DLT-based market infrastructure, the DLT Pilot Regime may apply. Each of these regulations is administered by a member state's national competent authority, with EU-level coordination from ESMA, EBA, and the European Commission.

That's the whole framework in one sentence. The rest of this post unpacks it.

## MiFID II — the foundation for securities

The Markets in Financial Instruments Directive II (Directive 2014/65/EU), together with the accompanying Regulation MiFIR (Regulation (EU) 600/2014), is the EU's framework for investment services and the markets in which financial instruments are traded. It is the most important regulation for tokenized securities.

MiFID II defines a financial instrument as including, broadly, transferable securities (shares, bonds, depositary receipts), money market instruments, units in collective investment undertakings, derivatives, and emission allowances. A tokenized representation of any of these — a token that represents a share of an SPV that owns a building, a token that represents a bond — is still a financial instrument. The token wrapper doesn't change what the thing is.

The consequence: issuers of tokenized financial instruments must comply with the standard EU prospectus rules. Platforms that trade or custody them must hold the relevant MiFID II authorisations — typically an investment firm authorisation that covers reception/transmission of orders, execution of orders, and custody.

Nextoken Capital does not currently hold a MiFID II investment firm authorisation; the platform's structure is built around issuances that fit within prospectus exemptions (e.g., issuances under €8 million in 12 months that qualify under member-state exemptions, or offerings restricted to professional investors under MiFID II Annex II) and around MiCA-regulated crypto-asset services where the underlying asset is not itself a financial instrument. Where an issuance requires MiFID II authorisation, the platform partners with a licensed investment firm rather than operating without authorisation.

## MiCA — the crypto-asset rulebook

We covered MiCA in detail in [Understanding MiCA](/blog/understanding-mica). The essential point in the context of the full regulatory framework:

MiCA applies to crypto-assets that are **not** financial instruments under MiFID II. There is no overlap; if MiFID II covers the asset, MiCA does not. If MiCA covers the asset, MiFID II does not.

MiCA additionally regulates crypto-asset **service providers** (CASPs) regardless of the underlying asset. So even if the tokens being traded are MiFID II financial instruments, the trading platform's operation may be partially under MiCA (for its custody and trading services) while the underlying token issuance is under MiFID II.

This dual regime is a recent regulatory innovation. Industry practice is still settling into it; expect interpretive guidance from ESMA over the next few years.

## Prospectus Regulation — the issuance disclosure rules

Regulation (EU) 2017/1129, the Prospectus Regulation, requires that any offer of transferable securities to the public in the EU, or any admission of transferable securities to trading on a regulated market, be preceded by the publication of an approved prospectus.

There are important exemptions:

- Offers below €8 million in total consideration over a 12-month period (each member state can adjust this threshold).
- Offers to qualified investors only.
- Offers to fewer than 150 persons per member state.
- Offers where the minimum subscription is €100,000.
- Offers of units of less than €100,000 each addressed to no more than 150 persons.

A tokenized issuance must either publish a prospectus or fit within an exemption. Most tokenized issuances to retail investors aim to fit within the under-€8-million exemption or the 150-persons exemption; institutional-only issuances rely on the qualified-investor exemption.

Where a prospectus is required, it must be approved by the national competent authority of the issuer's home member state (or the member state where the offer is first made). Approval can take 3-6 months and requires comprehensive disclosure of the issuer, the asset, the risk factors, and the offer terms.

The Prospectus Regulation predates tokenization and was not written with smart-contract issuance in mind. There is no special prospectus regime for tokenized securities; the same rules apply.

## DLT Pilot Regime — the regulatory sandbox

Regulation (EU) 2022/858, the DLT Pilot Regime, is a five-year sandbox (April 2023 to April 2028, extendable) that allows certain experimental DLT-based market infrastructures to operate under temporary, simplified versions of the standard rules.

The Pilot Regime defines three types of DLT market infrastructure:

- DLT Multilateral Trading Facility (DLT MTF) — a trading platform where DLT-based financial instruments are admitted to trading.
- DLT Settlement System (DLT SS) — a settlement system that settles DLT-based financial instruments.
- DLT Trading and Settlement System (DLT TSS) — combined trading and settlement.

Participants in the Pilot Regime get specific exemptions from certain MiFID II/MiFIR requirements that are incompatible with DLT (e.g., the requirement that securities be held through a central securities depositary). In exchange, the Pilot Regime imposes its own caps (e.g., a maximum issuance size per instrument, a maximum total value of all instruments on a single platform).

The Pilot Regime is opt-in. Most platforms — including Nextoken Capital — do not currently operate under it; the standard MiFID II/MiCA framework is sufficient for their use cases. It is, however, an option for issuers and platforms that want to push the boundaries of what current rules permit.

## AMLD6 — the anti-money-laundering rules

Directive (EU) 2018/1673, the Sixth Anti-Money-Laundering Directive, and its predecessors, set out the EU's framework for preventing the financial system from being used to launder criminal proceeds or finance terrorism.

The key obligations for a tokenized-asset platform:

- Customer due diligence (CDD) — knowing who your customers are.
- Enhanced due diligence for higher-risk customers.
- Sanctions screening.
- Politically Exposed Persons (PEP) screening.
- Transaction monitoring.
- Suspicious activity reporting to the national Financial Intelligence Unit.
- Record retention (typically 5-8 years).

The FATF Travel Rule, transposed into EU law via the Transfer of Funds Regulation, requires that for transfers above defined thresholds, the originator and beneficiary information accompany the transaction. For crypto-asset transfers in the EU, the threshold is €1,000.

AMLD6 applies in addition to MiCA, MiFID II, and other regimes. There is no exemption — a regulated platform must comply with both the substantive financial-services regulation and the AML regime.

The EU has proposed a single Anti-Money-Laundering Regulation (AMLR) and the creation of an EU-level Anti-Money-Laundering Authority (AMLA). These are expected to take effect over the next several years, replacing the directive-based AMLD6 with a directly-applicable EU regulation and centralising some supervision.

## GDPR — the data protection rules

Regulation (EU) 2016/679, the General Data Protection Regulation, governs the processing of personal data of EU residents.

For a tokenized-asset platform, GDPR has several specific implications:

- The KYC documents collected during onboarding are personal data; they must be processed under a lawful basis (consent, contract performance, legal obligation) and protected accordingly.
- The wallet address itself, once linked to a verified identity, becomes personal data and subject to GDPR.
- On-chain transaction history is publicly available; once a wallet has been linked to an identity, the transaction history becomes personal data accessible to anyone with the wallet address.
- This creates a tension with the GDPR right to erasure ("right to be forgotten"). You cannot erase on-chain history. Most platforms address this through a layered approach: erase off-chain data on request, retain the minimum on-chain data required for the platform to function.

The EU is preparing additional guidance on the intersection of GDPR and DLT, but final clarification is not yet published.

## DORA — operational resilience

Regulation (EU) 2022/2554, the Digital Operational Resilience Act, sets requirements for the ICT-related operational resilience of EU financial entities, including most CASPs.

DORA covers:

- ICT risk management — having a documented framework for managing technology risk.
- Incident reporting — reporting major ICT-related incidents to the national competent authority.
- Digital operational resilience testing — periodic testing, including threat-led penetration testing for larger entities.
- Third-party risk management — controls over critical ICT service providers (cloud providers, KYC providers, etc.).
- Information sharing — voluntary sharing of cyber threat intelligence.

DORA entered into force on 17 January 2025. Compliance is mandatory for all in-scope financial entities, including MiCA-authorised CASPs.

For Nextoken Capital, DORA compliance is built into operational practice: documented risk-management framework, incident reporting procedures, third-party risk register covering Sumsub, Monerium, the cloud provider, and the blockchain infrastructure.

## How it all fits together — a worked example

Consider a tokenization of a €5 million Lithuanian real-estate fund offered to EU retail investors.

**Issuer side.** The issuer is a Lithuanian SPV (UAB) that owns the property. The token represents a share in the SPV — a financial instrument under MiFID II. The issuance is under €8 million so qualifies for the small-issuance exemption from the Prospectus Regulation; no full prospectus is required, but a simplified information document must be published. The issuer registers the SPV with the Lithuanian Centre of Registers, files the SPV's articles, and publishes the offering documents.

**Platform side.** Nextoken Capital operates the trading platform. Under MiCA, the platform requires CASP authorisation from the Bank of Lithuania for the custody and trading services it provides. The platform is also subject to AMLD6 (KYC on every investor, sanctions screening, Travel Rule for cross-platform transfers), GDPR (protection of investors' identity data), and DORA (operational resilience).

**Investor side.** A French retail investor completes Tier 2 KYC on Nextoken Capital. Sumsub verifies their passport and address. Their wallet is whitelisted on the ERC-3643 token. They buy 100 tokens of €100 each using EURe. The transaction settles atomically on Polygon. They are now a 0.2% holder of the SPV. They receive their quarterly distribution automatically via the yield distributor contract.

**Cross-cutting.** The whole transaction is recorded on the Polygon blockchain (public, immutable). The investor's identity is recorded with Sumsub (encrypted, GDPR-compliant). The SPV's books and reports are filed with Lithuanian commercial registry. The platform's compliance team monitors the transaction for AML red flags. The national competent authority (Bank of Lithuania) supervises the platform.

Five different regulatory regimes interacting, one transaction. That's the EU framework for tokenized assets in practice.

## What this means for an investor

If you're investing in tokenized assets in the EU, the regulatory framework gives you a set of protections:

- The platform is authorised by a national competent authority you can identify and contact.
- Your identity is protected under GDPR.
- The platform must maintain operational resilience under DORA.
- Sanctions and AML monitoring run continuously.
- The underlying asset is issued under standard EU securities law, with the disclosures and exemptions you can verify.

It also imposes some friction: KYC, transfer restrictions, jurisdictional eligibility checks. These exist for a reason. They are the cost of operating in a regulated environment that gives you supervisory protection and clear legal recourse if things go wrong.

## What this means for an issuer

If you're issuing tokenized assets in the EU, the framework defines a clear playbook:

- Choose the regulatory route that fits your issuance: full prospectus, simplified information document, qualified-investor exemption, etc.
- Partner with a regulated platform for distribution. The platform handles its own MiCA/AML/GDPR/DORA compliance.
- Be ready to provide the documentation the platform's onboarding pipeline requires (Section 8 of our [whitepaper](/whitepaper) describes Nextoken Capital's specific pipeline).
- Stay engaged on post-listing reporting and corporate actions.

The framework is not light, but it is workable. Dozens of issuers have successfully tokenized real-world assets in the EU under this framework over the last five years. Expect dozens more in the next five.

## Resources

- MiCA: [Regulation (EU) 2023/1114](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1114)
- MiFID II: [Directive 2014/65/EU](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32014L0065)
- Prospectus Regulation: [Regulation (EU) 2017/1129](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32017R1129)
- DLT Pilot Regime: [Regulation (EU) 2022/858](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022R0858)
- DORA: [Regulation (EU) 2022/2554](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022R2554)
- GDPR: [Regulation (EU) 2016/679](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679)
- AMLD6: [Directive (EU) 2018/1673](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32018L1673)
- ESMA crypto-assets hub: [https://www.esma.europa.eu/policy-activities/crypto-assets-mica](https://www.esma.europa.eu/policy-activities/crypto-assets-mica)

For specific questions about how a given offering fits into this framework, [contact us](/contact).

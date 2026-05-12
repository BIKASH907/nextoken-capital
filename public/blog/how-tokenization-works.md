---
title: "How an Asset Gets Tokenized: The Process, End to End"
slug: "how-tokenization-works"
excerpt: "From issuer enquiry to listed token, the eight steps and the people, contracts and documents that turn a real-world asset into a tradable digital security."
date: "2026-04-13"
author: "Nextoken Capital"
category: "Process"
readTime: "8 min"
---

# How an Asset Gets Tokenized: The Process, End to End

When you see a tokenized building, a tokenized bond, or a tokenized solar farm listed on a platform like Nextoken Capital, you're seeing the end of a process that typically took eight to twelve weeks of work behind the scenes. This post takes you through what happens during those weeks, from the issuer's first conversation with the platform to the moment a token is live and tradeable.

The process is the same whether the underlying asset is real estate, a bond, equity, or an infrastructure project. Specific details vary; the shape doesn't.

## Step 1 — Initial enquiry and fit assessment

An issuer who wants to tokenize an asset contacts the platform. The first conversation is a fit assessment: does the asset, the issuer, and the proposed structure make sense for Nextoken Capital? Topics include:

- The underlying asset: type, location, value, expected returns, holding period.
- The issuer: legal form, financial standing, prior issuance experience.
- The proposed structure: who owns the asset, who issues the token, how is the legal claim structured.
- The target investor base: retail, professional, institutional, geographic restrictions.
- The expected timeline.

If both sides are interested, the platform issues an indicative term sheet covering fees, timeline, and key conditions. The issuer signs an engagement letter and pays the initial listing-fee deposit. This is when the formal verification pipeline begins.

For most issuers this step takes 1-2 weeks.

## Step 2 — Issuer KYB (Know Your Business)

The platform's compliance team performs full Know Your Business verification on the issuing entity:

- Verification of incorporation documents.
- Identification of all ultimate beneficial owners holding 25% or more.
- KYC of each UBO and of authorised signatories.
- Sanctions screening of the entity and its principals against EU, OFAC, UN, and national lists.
- Politically Exposed Persons (PEP) screening.
- Adverse media screening.
- Assessment of the entity's financial standing — recent audited financials, bank statements, source of funds for the asset.

For a clean entity, this typically takes 5-10 business days. For complex multi-jurisdiction structures with many UBOs, it can take longer. Issues found at this stage — a UBO with sanctions exposure, an entity with adverse media — can pause or terminate the process.

## Step 3 — Asset due diligence

In parallel with the KYB, the platform's investment team performs due diligence on the underlying asset itself. The specifics depend heavily on asset type.

For real estate:
- Title search and verification.
- Independent surveyor's valuation.
- Inspection of the property (in person or via verified inspection reports).
- Lease-roll analysis if income-producing.
- Review of any encumbrances, easements, planning permissions.
- Cash flow model: rental income, costs, capex schedule, expected returns.

For bonds:
- Review of the issuer's audited financial statements (3+ years).
- Credit analysis: leverage, coverage ratios, cash flow stability.
- Review of any rating agency assessments.
- Review of indenture: covenants, security, ranking, default mechanics.
- Stress testing under adverse scenarios.

For equity:
- Cap table review.
- 409A or equivalent valuation.
- Audited financials (where available).
- Business plan and unit economics.
- Investor rights document.

For infrastructure / renewable energy:
- Project documentation (planning permission, grid connection, off-take contracts).
- Technical due diligence (typically by a third-party engineering firm).
- Operations and maintenance contracts.
- Insurance coverage.
- Cash flow model under base and downside scenarios.

The output of due diligence is a written DD memo that lives in the asset's listing dossier, available to investors before they buy. The DD memo is the platform's view, not an investment recommendation; investors do their own analysis.

Due diligence typically takes 2-4 weeks.

## Step 4 — Legal structuring

The platform's legal counsel works with the issuer's counsel to structure the offering. Key decisions:

- The vehicle that owns the asset and issues the token (typically a special-purpose vehicle, or SPV).
- The legal nature of the token — is it a share of the SPV, a participation in a bond issuance, a beneficiary interest in a trust?
- The applicable regulatory regime — what prospectus or prospectus-exemption applies, what jurisdictions can sell to.
- The compliance rules to encode in the token — eligibility criteria, holding limits, lock-up periods.
- The offering documents — the term sheet, the subscription agreement, the information document, the risk disclosure.

Two outputs of this stage are particularly important. The first is the legal opinion: a written opinion from qualified counsel confirming that the token represents the economic rights claimed and that the issuance is compliant with applicable law. The second is the offering memorandum: the document that an investor reads to understand what they are buying.

Legal structuring typically takes 2-4 weeks.

## Step 5 — Smart contract preparation

The platform deploys the ERC-3643 security token contract for the offering from its central token factory. The token is configured with:

- Name, symbol, decimals.
- Total supply (or initial supply if mintable).
- Issuer wallet address.
- Compliance rules: eligible jurisdictions, holding limits, lock-up period (if any), maximum number of holders (if relevant).
- Reference to the legal documents (the document hash is stored on-chain so any holder can verify the documents they downloaded match the issuance).

Where the offering uses non-standard compliance rules (e.g., a specific corporate action mechanism, a non-standard distribution waterfall), a custom compliance module is written. Custom modules are reviewed by the platform's smart contract security team, and for material issuances, audited by an external auditor before deployment.

Smart contract preparation typically takes 1-3 weeks depending on whether custom modules are required.

## Step 6 — Compliance committee approval

Once KYB, DD, legal structuring, and smart contract preparation are complete, the listing goes to the platform's compliance committee. The committee — typically the Chief Compliance Officer, Head of Legal, and CEO — reviews the complete listing dossier and votes on approval.

A unanimous vote is required. Where any committee member has reservations, the listing is sent back to the relevant workstream for remediation. Common reasons for sending a listing back:

- Insufficient documentation of source of funds for the issuing entity.
- Valuation that the committee considers aggressive.
- Legal opinion that doesn't address a specific risk.
- Compliance rules that don't fully match the regulatory posture of the offering.

Where remediation is not possible, the listing is declined and the issuer is given a written explanation. Engagement fees are refundable in proportion to work not yet completed.

For listings that proceed cleanly, this step is 1-3 business days.

## Step 7 — Marketplace listing and offering

Once approved, the listing is published to the marketplace. The investor-facing listing includes:

- Asset description (location, type, key facts).
- Investment terms (token price, minimum subscription, maximum subscription per investor, lock-up if any, expected returns).
- Issuer information (name, jurisdiction, principal contacts).
- Due diligence summary.
- Legal opinion summary.
- Risk factors specific to the asset.
- Token contract address and link to blockchain explorer.
- Downloadable PDF copy of the full offering memorandum.

The primary offering opens for subscription. Investors who are KYC'd and whitelisted can subscribe by transferring EURe to the issuer's wallet in exchange for tokens. Subscriptions are settled atomically on-chain.

A primary offering typically runs for a defined window — 2-8 weeks is common. The offering can be fully subscribed before the window closes (in which case it closes early) or it can fail to reach minimum subscription (in which case all subscriptions are returned).

## Step 8 — Secondary trading and ongoing reporting

After the primary offering closes, the token becomes tradeable on the secondary market. Investors can list tokens for sale or place buy orders. Orders match against each other on a price-time priority basis; settlement is atomic.

The issuer's ongoing obligations:

- Periodic distributions — quarterly cash flows from the asset (rental income, bond coupons, equity dividends) are converted to EURe and distributed automatically to holders via the yield distributor contract.
- Periodic reporting — quarterly performance updates published to the listing's investor area.
- Material event disclosure — any event that materially affects the asset (a major lease change, a default, a regulatory action) must be disclosed promptly.
- Annual statements — audited annual financial statements of the issuing vehicle.

Investors can monitor their holding through their platform dashboard: current holdings, transaction history, distributions received, current bid/ask on the secondary market. They can also independently verify all of this on the public blockchain at any time.

## A note on timelines

The eight-week timeline above is typical for a straightforward, well-structured issuance. Reality varies:

- A simple bond from a high-quality issuer can complete in 4-6 weeks.
- A complex real-estate SPV with multiple UBOs across multiple jurisdictions can take 12-16 weeks.
- A new asset category that requires custom legal work or custom smart contract modules can take 16-24 weeks.

The platform's role is to keep the process moving without compromising due diligence. Quality of issuance is the platform's reputation; we'd rather take longer than rush a listing that hasn't been properly verified.

## What it costs

Listing costs are charged to the issuer, not the investor. They depend on the complexity of the structure:

- A straightforward bond: €5,000-15,000 all-in.
- A standard real-estate SPV: €15,000-30,000.
- A complex multi-jurisdiction structure or new asset category: €30,000-50,000 or more.

These costs cover the platform's KYB, DD, legal review, smart contract deployment, and compliance committee work. They are charged in EUR and paid in advance against milestones.

For comparison, traditional issuance costs — underwriter fees, prospectus preparation, registrar setup, custody setup, listing fees on a regulated exchange — can be 5-10% of the issued size for similar offerings. Tokenization is materially cheaper, particularly at smaller issuance sizes.

## What the investor sees

From the investor's point of view, the entire eight-week process is invisible. The investor encounters the asset only at Step 7 — the marketplace listing. What they see is the result of the verification work: a listing with a complete dossier, a clear price, terms, and an issuer that has been put through KYB and DD.

This is intentional. The platform's job is to do the work of verification so the investor can focus on the investment decision itself: does this asset, at this price, fit my portfolio? Not: is the issuer real, is the asset properly described, is the smart contract safe.

That said, every investor should still read the listing dossier carefully. The DD memo is the platform's view, not a substitute for the investor's own due diligence. Where investors have questions, the platform's investor relations team can answer; where the question is technical or regulatory, our team will route to the right specialist.

## What if the asset doesn't make it through

Not every asset that enters Step 1 gets to Step 8. Some are declined at KYB (sanctions exposure, undisclosed UBO issues). Some are declined at due diligence (overstated valuation, undisclosed liabilities). Some fail to clear legal structuring (the proposed token doesn't reliably represent the economic rights). Some fail at the compliance committee.

Decline rates vary by asset category. For first-time issuers, expect roughly 30-50% of initial enquiries not to reach Step 7. For issuers with multiple successful prior listings, the rate falls substantially.

This is intentional. The platform exists to give investors a curated, verified marketplace. Listings that fail verification protect investors from being offered something that shouldn't have been offered in the first place.

## How to start

If you are an issuer interested in tokenizing an asset, the starting point is the [tokenize page](/tokenize) on the Nextoken Capital site. The form there gathers the initial information our team needs to do a fit assessment. We'll typically respond within 2 business days.

For investors, the corresponding starting point is [register](/register) — complete the registration, complete KYC, and you'll have access to whatever is currently listed and to all future listings as they go live.

For specific questions about the tokenization process, the [Help Center](/help) or our [contact form](/contact) reach the right team.

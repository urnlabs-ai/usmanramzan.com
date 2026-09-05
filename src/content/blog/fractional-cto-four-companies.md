---
title: "What fractional CTO work actually looks like: four companies, four very different problems"
description: "Four fractional CTO engagements: healthcare SOC 2 readiness, a travel-sector AI assistant, manufacturing GDPR remediation, and media operations on AWS EKS."
pubDate: 2026-05-20
draft: true
---

Alongside my role as CTO at Eprecisio, I work as a fractional CTO for four companies. The title sounds vague, so this post is about what the work actually is: four companies, four completely different problems, and a pattern underneath them that keeps repeating.

## Healthcare: SOC 2 readiness

A healthcare SaaS needed to pass enterprise security review to close deals, and its roadmap was blocked on it. A penetration test had left 22 findings, and nobody had the time or the context to work through them.

The actual work was less dramatic than "security remediation" sounds. We triaged the findings by real risk instead of by how scary they read, fixed the ones that mattered in order, documented why the rest were acceptable, and built the evidence trail an auditor expects: access reviews, policies people actually follow, logging you can point at. Twenty-two findings became a clean position and a sales team that could answer security questionnaires without panicking. Compliance did not slow the roadmap down. It was the thing unblocking it.

## Travel: an AI assistant that had to be right

A travel company with about 1,300 people wanted an internal knowledge assistant so staff could stop digging through documents to answer customer questions. We built it on Azure OpenAI with retrieval augmented generation, which meant most of the effort went somewhere counterintuitive: not the model, the retrieval.

Answers the company could trust meant caring about which documents were authoritative, how they were chunked and indexed, and how the assistant behaved when it did not know. A confident wrong answer about a visa rule is worse than no answer. The model was one decision among many. The information architecture was the product.

## Manufacturing: GDPR remediation

A manufacturer needed to get a data problem under control: personal data scattered across systems with no clear record of what lived where or why it was kept. GDPR remediation here was mostly unglamorous inventory work. We mapped where personal data actually was, deleted what had no reason to exist, put retention rules on what stayed, and set up the process so the next data subject request is an afternoon of work instead of a fire drill. Nothing about it required novel technology. It required someone with the standing to ask "why do we still have this?" and act on the answer.

## Media: keeping AWS and EKS honest

The fourth company runs workloads on AWS with EKS, including GPU nodes for its heavier jobs. Here I operate closer to a senior infrastructure engineer with a mandate: cost visibility, sane cluster operations, and making sure GPU capacity is actually used instead of idling on a bill. Weekly cadence, concrete numbers, small permanent improvements instead of a big rewrite nobody has time for.

## What the weeks actually look like

Across all four, the rhythm is similar. One or two focused days per week per company. Every engagement starts with a written picture of where things stand, because opinions are cheap and a ranked list of risks with owners is not. Then it is a loop: pick the top item, do it or get it done, update the list. The value is rarely a heroic build. It is judgement applied consistently: which problem is actually first, which vendor pitch to ignore, which control is load-bearing.

## When a fractional CTO is the wrong hire

Not every company should hire one. If you need someone writing production code every day, hire a staff engineer. If your problem is one deep specialty, hire that specialist. And if nobody inside the company will act on recommendations, a part-time advisor becomes an expensive diary. The engagement works when there is a team that executes and a founder who wants the thinking challenged.

The common thread in all four is that none of them needed a full-time executive yet, and all of them needed senior technical judgement now. That gap is the whole job.

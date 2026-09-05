---
title: "Migrating forty apps from AWS EKS to OCI OKE without downtime"
description: "How we moved about forty applications and twenty databases from AWS EKS to OCI OKE across ten teams, and what the migration actually cost in planning."
pubDate: 2026-07-14
draft: false
---

At Unifonic I led the migration of roughly forty applications and twenty databases from AWS EKS to Oracle Cloud's OKE. Ten teams owned those services. We finished with zero customer-facing downtime, and the platform ended up fifteen to twenty thousand dollars a month cheaper to run. This post is the shape of that project: why we did it, what we moved first, what broke, and what I would do differently.

## Why multi-cloud at all

I will not pretend the decision was purely technical. Messaging is a business where a platform handling over ten billion messages a year lives or dies on whether one cloud region can take it offline. Spreading the platform across providers was a resilience decision first and a cost decision second, and it only became defensible once the cost numbers started holding up month after month.

The honest part is that multi-cloud is not free. You give up single-vendor convenience and you take on the job of making two clouds feel like one platform. That job is what this migration actually was.

## The shape of the move

We did not lift forty apps in one dramatic weekend. We built a repeatable path and walked apps down it one batch at a time. A few things made that possible:

- Terraform modules written once and reused across every app and every team. The same module provisioned an OKE cluster, its node pools, its ingress, and its observability. Nobody hand-built an environment.
- Rancher sat on top of both EKS and OKE, so onboarding a team to the new cloud looked identical to what they already knew.
- Every batch had an owner on the app team and an owner on the platform side. Migration is coordination work before it is infrastructure work, and with ten teams the coordination was the hard part.

We sequenced by blast radius: stateless services first, then anything with a queue, then the databases. Each batch proved the tooling before the next batch leaned on it.

## Databases were the real work

The stateless apps were easy. The twenty databases, PostgreSQL and Cassandra among them, were the project. Replication had to be established into OCI, caught up, verified, and only then could we think about cutting over writes. We rehearsed the cutover on non-production workloads until the runbook was boring, which was the point. Kafka and Redis had their own tracks with the same discipline: mirror, verify, switch, and keep the old path warm until we were sure.

Every step kept an agreed rollback position. A cutover you cannot undo is a cutover you should not perform on a platform where downtime is not an option.

## The DNS cutover and what broke

The actual traffic switch was anticlimactic by design. We lowered TTLs well in advance, shifted weights gradually, watched error and latency dashboards at every step, and held between steps. Because we could shift gradually, the customer-facing risk at any single moment was small.

Things still broke, just on our side and at low stakes. Some apps had hardcoded assumptions about AWS endpoints and needed small code changes. A few teams found their observability costs roughly doubled because agents ran in two places during the overlap. IAM was the slowest thing to get right; every cloud names its permissions differently and somebody has to translate.

## What I would do differently

Three things. I would invest in the IAM and networking translation layer even earlier, because it blocked more batches than any Kubernetes issue did. I would publish a shared dashboard of migration progress per team from week one, because ten teams move at ten speeds and visibility keeps the slow ones from being surprised. And I would task the platform team with deleting the temporary dual-run tooling immediately after the last batch, because temporary infrastructure has a way of becoming permanent.

Was it worth it? Yes. The platform ended up across two providers with a real failure domain between them, the bill dropped meaningfully every month, and no customer saw a single second of the work. That last part is the only metric I actually care about.

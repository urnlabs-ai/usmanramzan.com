---
title: "Agentic engineering in production starts with boundaries"
description: "A practical way to decide where an agent belongs, which tools it can use, what needs approval, and how to evaluate the whole workflow."
pubDate: 2026-10-09
draft: false
---

Agent demos are good at making a workflow look finished. A model receives a request, calls a few tools, and returns an answer. Production engineering starts with the questions around that loop: what can it read, what can it change, how does it recover, and how will anyone know what happened?

The examples below are hypothetical design sketches. They show how I would give a model room to reason where judgment helps, while keeping system boundaries explicit in ordinary code.

## Start with a workflow, then earn autonomy

Not every task needs an agent. If the steps are known in advance, a deterministic workflow is easier to reason about: validate input, fetch the required records, apply a rule, and return a result. A model can still help with a narrow step, such as classifying a request or drafting an explanation, while the surrounding control flow remains fixed.

An agent becomes useful when it needs to choose among tools or adapt its next step to what it finds. That flexibility also means the path through the system is less predictable. Anthropic describes this distinction between fixed workflows and agents that direct their own process, and recommends starting with simple, composable patterns before adding complexity ([Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)).

I use that as a design test: can a small deterministic workflow solve the problem? If yes, keep it small. If the task really needs adaptive tool use, make the agent's choices observable and constrain the effects those choices can have.

## Separate reading, proposing, and applying

A useful boundary is to give the system three distinct capabilities:

1. **Read** the minimum data needed to understand the request.
2. **Propose** a specific, reviewable change with its target and reason.
3. **Apply** that change through a narrow service that enforces authorization and policy.

The model can help interpret evidence and prepare a proposal. It should not be the authority that decides whether the proposal is permitted. The apply step should check identity, scope, current state, and policy in application code. A prompt that says “only change this environment” is not a permission boundary.

For example, imagine an infrastructure assistant asked to resize a deployment. It could inspect the deployment and its limits, then prepare a diff showing the namespace, workload, current value, proposed value, and expected effect. A person reviews that exact proposal. A separate apply service verifies that the person can approve it and that the target still matches the reviewed version before changing anything.

Infrastructure mutation should stop for explicit human approval. The review should bind to the exact action: the resource, environment, before-and-after values, and any relevant expiry or rollback details. If the target changes after review, the old approval should no longer authorize the new action. OpenAI's Agents SDK documentation describes how a run can pause before a tool executes and resume after approval. It also explains why validation should sit next to the tool that creates a side effect ([guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)).

## Treat retries as part of the design

Tool calls fail. The agent may time out after a service completed the action but before it received the response. It may retry. Without a stable request identity, that retry can create the same change twice.

For actions with side effects, use an idempotency key tied to the approved proposal and make the apply service record the result. Repeating the same request should return the known result instead of applying the change again. When the system cannot tell whether an action completed, stop and reconcile state before trying again. Do not let the model invent a different retry strategy on every turn.

Set hard limits too: maximum tool calls, maximum loop steps, token budget, time budget, and a clear terminal state for approval declined, policy denied, or evidence missing. A bounded failure is easier to recover from than a workflow that keeps exploring until it exhausts its budget or reaches a tool with broader access.

## Evaluate the failures, not just the demo

A production evaluation should check whether the workflow does the right thing and whether it stops safely. A small test set can include ordinary requests plus cases such as:

- The requested resource is outside the caller's allowed scope.
- The approval is declined or expires.
- The resource changes after the reviewer sees the proposal.
- A tool times out after a side effect may have occurred.
- A retry repeats the same request.
- Retrieved text contains instructions that conflict with the user's request or system policy.
- The agent cannot find authoritative evidence and should say so.

Measure the full run: task outcome, tool selection, tool arguments, policy decisions, approval state, retries, and final state. A fluent final answer does not prove that a tool acted correctly. OpenAI documents traces for tool calls, handoffs, guardrails, and other run events in its [Agents SDK observability guide](https://developers.openai.com/api/docs/guides/agents/integrations-observability). That kind of record helps explain the path to an outcome, while evaluations tell you whether the path was acceptable.

Keep evaluation cases after launch. When a model, prompt, retrieval source, or tool contract changes, rerun the ordinary and failure cases. The question is not simply whether the agent still responds. It is whether the same boundaries hold when the path through the workflow changes.

## A small permission surface is a product feature

An agent is easier to trust when every tool has a clear purpose, narrow inputs, and a result that can be checked. Read tools should not quietly inherit write access. A proposal should be data, not an executable command. Apply tools should accept typed, validated fields rather than broad natural-language instructions. Authorization should be checked at the point of action, including after handoffs or retries.

These boundaries do not remove the need for judgment. They give judgment a safe place to operate. The model can help decide what to inspect and how to explain a recommendation. The system remains responsible for deciding whether an action is allowed, whether approval is current, and whether the resulting state is correct.

For an infrastructure assistant, I would begin with read-only inspection and reviewable proposals. Broader tools come later, once evaluations show that permissions, retries, approvals, and failure states work together.

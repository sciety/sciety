# 7. Deploy on a Libero Kubernetes cluster

Date: 2020-05-04

## Status

Proposed

## Context

Libero is the umbrella under which the PRC project is being developed.

It helps to keep the Libero infrastructure isolated from the journal-specific eLife infrastructure.

## Decision

Deploy on a [Kubernetes cluster] inside the Libero AWS account.

## Consequences

Public URLs end in `.libero.pub`.

The scope of [Libero infrastructure] should be expanded.

[Kubernetes cluster]: https://github.com/libero/infrastructure/blob/master/tf/envs/main.tf
[Libero infrastructure]: https://github.com/libero/community/blob/master/doc/adr/0008-libero-infrastructure.md

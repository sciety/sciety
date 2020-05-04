# 7. Deploy on a Libero Kubernetes cluster

Date: 2020-05-04

## Status

Accepted

## Context

PRC needs to be deployed publicly from day 1.

The [Libero infrastructure] is isolated from the journal-specific eLife infrastructure.

## Decision

Deploy on a [Kubernetes cluster] inside the Libero AWS account.

## Consequences

Public URLs end in `.libero.pub`.

The scope of Libero infrastructure is in conflict with this usage.

[Kubernetes cluster]: https://github.com/libero/infrastructure/blob/master/tf/envs/main.tf
[Libero infrastructure]: https://github.com/libero/community/blob/master/doc/adr/0008-libero-infrastructure.md

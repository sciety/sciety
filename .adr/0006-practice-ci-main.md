# 6. Practice Continuous Integration on the main branch

Date: 2020-05-01

## Status

Accepted

## Context

Feature branches are at big risk of problematic integration when working with an evolutionary architecture.

## Decision

Practice [Trunk Based Development] on the main branch rather than working in long-lived feature branches.

[Integrate often], by rebasing and pushing small commits.

## Consequences

The main branch should always be release ready.

No [feature branches][FeatureBranch] or pull requests should normally be opened in the project.

The [Andon cord] is a Slack notification in the `#sciety-general` channel for broken builds.

[Branch By Abstraction][BranchByAbstraction] can be used to execute large scale changes.

[Andon cord]: https://en.wikipedia.org/wiki/Andon_(manufacturing)
[BranchByAbstraction]: https://www.martinfowler.com/bliki/BranchByAbstraction.html
[FeatureBranch]: https://www.martinfowler.com/bliki/FeatureBranch.html
[Integrate often]: http://www.extremeprogramming.org/rules/integrateoften.html
[Trunk Based Development]: https://trunkbaseddevelopment.com/5-min-overview/

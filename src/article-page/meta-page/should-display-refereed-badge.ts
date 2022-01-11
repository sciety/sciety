import { DomainEvent } from '../../domain-events';
import { Doi } from '../../types/doi';

type ShouldDisplayRefereedBadge = (articleId: Doi) => (events: ReadonlyArray<DomainEvent>) => boolean;

export const shouldDisplayRefereedBadge: ShouldDisplayRefereedBadge = () => () => true;

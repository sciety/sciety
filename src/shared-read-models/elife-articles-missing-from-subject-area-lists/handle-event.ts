import { DomainEvent } from '../../domain-events';
import { Doi } from '../../types/doi';

export type MissingArticles = { articleIds: ReadonlyArray<Doi> };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleEvent = (readmodel: MissingArticles, event: DomainEvent): MissingArticles => readmodel;

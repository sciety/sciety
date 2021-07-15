import { DomainEvent } from '../types/domain-events';

type ListDetails = {
  articleCount: number,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getEvaluatedArticlesListDetails = (events: ReadonlyArray<DomainEvent>): ListDetails => ({
  articleCount: 0,
});

import { DomainEvent } from '../domain-events';
import { ArticleActivity } from '../types/article-activity';
import { Doi } from '../types/doi';

type AllArticleActivityReadModel = Record<string, ArticleActivity>;

type AllArticleActivity = (events: ReadonlyArray<DomainEvent>) => AllArticleActivityReadModel;

export const allArticleActivity: AllArticleActivity = () => ({
  '10.1101/2021.05.20.21257512': {
    doi: new Doi('10.1101/2021.05.20.21257512'),
    latestActivityDate: new Date('2021-07-09'),
    evaluationCount: 2,
  },
});

export const activityFor = (
  doi: Doi,
) => (
  activities: AllArticleActivityReadModel,
): ArticleActivity => activities[doi.value];

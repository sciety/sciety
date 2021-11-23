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
  '10.1101/2021.03.21.436299': {
    doi: new Doi('10.1101/2021.03.21.436299'),
    latestActivityDate: new Date('2021-09-27'),
    evaluationCount: 2,
  },
  '10.1101/2021.07.05.451181': {
    doi: new Doi('10.1101/2021.07.05.451181'),
    latestActivityDate: new Date('2021-09-08'),
    evaluationCount: 3,
  },
});

export const activityForDoi = (
  activities: AllArticleActivityReadModel,
) => (
  doi: Doi,
): ArticleActivity => activities[doi.value];

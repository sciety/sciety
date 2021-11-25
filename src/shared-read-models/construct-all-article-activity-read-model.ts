import { DomainEvent } from '../domain-events';
import { ArticleActivity } from '../types/article-activity';
import { Doi } from '../types/doi';

export type AllArticleActivityReadModel = Record<string, ArticleActivity>;

type ConstructAllArticleActivityReadModel = (events: ReadonlyArray<DomainEvent>) => AllArticleActivityReadModel;

export const constructAllArticleActivityReadModel: ConstructAllArticleActivityReadModel = () => ({
  // NCRC High impact:
  '10.1101/2021.11.04.467308': {
    doi: new Doi('10.1101/2021.11.04.467308'),
    latestActivityDate: new Date('2021-11-19'),
    evaluationCount: 2,
  },
  '10.1101/2021.09.15.21263613': {
    doi: new Doi('10.1101/2021.09.15.21263613'),
    latestActivityDate: new Date('2021-10-18'),
    evaluationCount: 2,
  },
  '10.1101/2021.08.30.21262866': {
    doi: new Doi('10.1101/2021.08.30.21262866'),
    latestActivityDate: new Date('2021-09-20'),
    evaluationCount: 2,
  },
  '10.1101/2021.07.31.21261387': {
    doi: new Doi('10.1101/2021.07.31.21261387'),
    latestActivityDate: new Date('2021-09-10'),
    evaluationCount: 2,
  },
  '10.1101/2021.08.03.21261496': {
    doi: new Doi('10.1101/2021.08.03.21261496'),
    latestActivityDate: new Date('2021-08-23'),
    evaluationCount: 2,
  },
  '10.1101/2021.05.20.21257512': {
    doi: new Doi('10.1101/2021.05.20.21257512'),
    latestActivityDate: new Date('2021-07-09'),
    evaluationCount: 2,
  },
  '10.1101/2021.06.02.21258076': {
    doi: new Doi('10.1101/2021.06.02.21258076'),
    latestActivityDate: new Date('2021-06-18'),
    evaluationCount: 2,
  },
  '10.1101/2021.05.13.21256639': {
    doi: new Doi('10.1101/2021.05.13.21256639'),
    latestActivityDate: new Date('2021-05-28'),
    evaluationCount: 2,
  },
  '10.1101/2021.02.26.21252554': {
    doi: new Doi('10.1101/2021.02.26.21252554'),
    latestActivityDate: new Date('2021-04-07'),
    evaluationCount: 2,
  },
  '10.1101/2021.02.27.21252597': {
    doi: new Doi('10.1101/2021.02.27.21252597'),
    latestActivityDate: new Date('2021-03-22'),
    evaluationCount: 2,
  },
  '10.1101/2021.02.26.21252482': {
    doi: new Doi('10.1101/2021.02.26.21252482'),
    latestActivityDate: new Date('2021-03-15'),
    evaluationCount: 2,
  },
  // Biophysics Colab:
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

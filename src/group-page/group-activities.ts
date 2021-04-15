import * as O from 'fp-ts/Option';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';

type ArticleActivity = { doi: Doi, latestActivityDate: Date, evaluationCount: number };

type GroupActivities = (groupId: GroupId) => O.Option<ReadonlyArray<ArticleActivity>>;

export const groupActivities: GroupActivities = () => O.some([
  {
    doi: new Doi('10.1101/2020.09.15.286153'),
    latestActivityDate: new Date('2020-12-15'),
    evaluationCount: 1,
  },
  {
    doi: new Doi('10.1101/2019.12.20.884056'),
    latestActivityDate: new Date('2021-03-10'),
    evaluationCount: 4,
  },
  {
    doi: new Doi('10.1101/760082'),
    latestActivityDate: new Date('2019-12-05'),
    evaluationCount: 1,
  },
  {
    doi: new Doi('10.1101/661249'),
    latestActivityDate: new Date('2019-12-05'),
    evaluationCount: 1,
  },
]);

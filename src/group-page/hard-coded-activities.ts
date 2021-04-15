import { Doi } from '../types/doi';

export const hardCodedActivities = [
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
];

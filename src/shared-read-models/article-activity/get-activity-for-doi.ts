/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import { Doi } from '../../types/doi';
import { ReadModel } from './handle-event';

// ts-unused-exports:disable-next-line
export const getActivityForDoi = (readmodel: ReadModel) => (articleId: Doi) => ({
  articleId,
  latestActivityDate: O.none,
  evaluationCount: 0,
  listMembershipCount: 0,
});

import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import {
  CanonicalExpressionDoi,
  eqExpressionDoi,
  ExpressionDoi,
  fromValidatedString,
} from '../../../../types/expression-doi';

const isAppropriateDoi = (
  expressionDoi: ExpressionDoi,
) => (doiToBeChecked: ExpressionDoi): boolean => eqExpressionDoi.equals(doiToBeChecked, expressionDoi);

const constructJoinDiscussionLinkHref = (bonfireDiscussionId: string, expressionDoi: CanonicalExpressionDoi) => pipe(
  expressionDoi,
  O.fromPredicate(isAppropriateDoi(fromValidatedString('10.7554/elife.95814.3'))),
  O.map(() => `https://discussions.sciety.org/post/${bonfireDiscussionId}`),
);

export type BonfireManagement = {
  startDiscussionLinkHref: string,
  optionalJoinDiscussionLinkHref: O.Option<string>,
  expressionDoi: CanonicalExpressionDoi,
};

export const constructBonfireManagement = (
  dependencies: Dependencies,
  latestExpressionDoi: CanonicalExpressionDoi,
): T.Task<BonfireManagement> => pipe(
  latestExpressionDoi,
  dependencies.fetchBonfireDiscussionId,
  TE.match(
    () => O.none,
    (bonfireDiscussionId) => constructJoinDiscussionLinkHref(bonfireDiscussionId, latestExpressionDoi),
  ),
  T.map((optionalJoinDiscussionLinkHref) => ({
    startDiscussionLinkHref: 'https://discussions.sciety.org/signup',
    optionalJoinDiscussionLinkHref,
    expressionDoi: latestExpressionDoi,
  })),
);

import * as O from 'fp-ts/Option';
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

const constructJoinDiscussionLinkHref = (dependencies: Dependencies, expressionDoi: CanonicalExpressionDoi) => pipe(
  expressionDoi,
  O.fromPredicate(isAppropriateDoi(fromValidatedString('10.7554/elife.95814.3'))),
  O.map(dependencies.fetchBonfireDiscussionId),
  O.map((postId) => `https://discussions.sciety.org/post/${postId}`),
);

export type BonfireManagement = {
  startDiscussionLinkHref: string,
  optionalJoinDiscussionLinkHref: O.Option<string>,
  expressionDoi: CanonicalExpressionDoi,
};

export const constructBonfireManagement = (
  dependencies: Dependencies,
  latestExpressionDoi: CanonicalExpressionDoi,
): BonfireManagement => ({
  startDiscussionLinkHref: 'https://discussions.sciety.org/signup',
  optionalJoinDiscussionLinkHref: constructJoinDiscussionLinkHref(dependencies, latestExpressionDoi),
  expressionDoi: latestExpressionDoi,
});

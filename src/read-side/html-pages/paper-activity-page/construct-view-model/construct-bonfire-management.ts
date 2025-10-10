import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import {
  CanonicalExpressionDoi,
  eqExpressionDoi,
  ExpressionDoi,
  fromValidatedString,
} from '../../../../types/expression-doi';

const isAppropriateDoi = (
  expressionDoi: ExpressionDoi,
) => (doiToBeChecked: ExpressionDoi): boolean => eqExpressionDoi.equals(doiToBeChecked, expressionDoi);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const retrievePostId = (expressionDoi: CanonicalExpressionDoi) => '01K6MQC5NZFYEHXYQ23VCK047B';

const constructJoinDiscussionLinkHref = (expressionDoi: CanonicalExpressionDoi) => pipe(
  expressionDoi,
  O.fromPredicate(isAppropriateDoi(fromValidatedString('10.7554/elife.95814.3'))),
  O.map(() => retrievePostId(expressionDoi)),
  O.map((postId) => `https://discussions.sciety.org/post/${postId}`),
);

export type BonfireManagement = {
  startDiscussionLinkHref: string,
  optionalJoinDiscussionLinkHref: O.Option<string>,
  expressionDoi: CanonicalExpressionDoi,
};

export const constructBonfireManagement = (latestExpressionDoi: CanonicalExpressionDoi): BonfireManagement => ({
  startDiscussionLinkHref: 'https://discussions.sciety.org/signup',
  optionalJoinDiscussionLinkHref: constructJoinDiscussionLinkHref(latestExpressionDoi),
  expressionDoi: latestExpressionDoi,
});

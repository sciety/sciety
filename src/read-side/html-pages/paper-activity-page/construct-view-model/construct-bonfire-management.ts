import * as O from 'fp-ts/Option';
import { CanonicalExpressionDoi } from '../../../../types/expression-doi';

export type BonfireManagement = {
  startDiscussionLinkHref: string,
  joinDiscussionLinkHref: string,
  optionalJoinDiscussionLinkHref: O.Option<string>,
  expressionDoi: CanonicalExpressionDoi,
};

export const constructBonfireManagement = (latestExpressionDoi: CanonicalExpressionDoi): BonfireManagement => ({
  startDiscussionLinkHref: 'https://discussions.sciety.org/signup',
  joinDiscussionLinkHref: 'https://discussions.sciety.org/post/01K6MQC5NZFYEHXYQ23VCK047B',
  optionalJoinDiscussionLinkHref: O.some('https://discussions.sciety.org/post/01K6MQC5NZFYEHXYQ23VCK047B'),
  expressionDoi: latestExpressionDoi,
});

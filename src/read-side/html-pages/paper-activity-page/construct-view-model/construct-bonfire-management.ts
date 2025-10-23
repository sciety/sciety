import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import {
  CanonicalExpressionDoi,
} from '../../../../types/expression-doi';
import { UserId } from '../../../../types/user-id';

export type BonfireManagement = {
  startDiscussionLinkHref: string,
  optionalJoinDiscussionLinkHref: O.Option<string>,
  expressionDoi: CanonicalExpressionDoi,
  userId: O.Option<{ id: UserId }>,
  userIsLoggedIn: boolean,
};

const constructStartDiscussionLinkHref = (expressionDoi: CanonicalExpressionDoi) => ((process.env.EXPERIMENT_ENABLED === 'true') ? `https://discussions.sciety.org/signup?doi=${expressionDoi}` : 'https://discussions.sciety.org/signup');

export const constructBonfireManagement = (
  dependencies: Dependencies,
  latestExpressionDoi: CanonicalExpressionDoi,
  userId: O.Option<{ id: UserId }>,
): T.Task<BonfireManagement> => pipe(
  latestExpressionDoi,
  dependencies.fetchBonfireDiscussionId,
  TE.match(
    () => O.none,
    (bonfireDiscussionId) => O.some(`https://discussions.sciety.org/post/${bonfireDiscussionId}`),
  ),
  T.map((optionalJoinDiscussionLinkHref) => ({
    startDiscussionLinkHref: constructStartDiscussionLinkHref(latestExpressionDoi),
    optionalJoinDiscussionLinkHref,
    expressionDoi: latestExpressionDoi,
    userId,
    userIsLoggedIn: O.isSome(userId),
  })),
);

import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { UserFollowedEditorialCommunityEvent } from '../../domain-events';
import { templateDate } from '../../shared-components/date';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

type GetGroup = (id: GroupId) => TO.TaskOption<Group>;

type GetUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, {
  handle: string,
  avatarUrl: string,
}>;

type UserFollowedAGroupCard = (
  getUserDetails: GetUserDetails,
  getGroup: GetGroup,
) => (event: UserFollowedEditorialCommunityEvent) => TE.TaskEither<DE.DataError, HtmlFragment>;

// ts-unused-exports:disable-next-line
export const userFollowedAGroupCard: UserFollowedAGroupCard = (getUserDetails) => (event) => pipe(
  event.userId,
  getUserDetails,
  TE.map(flow(
    ({ handle, avatarUrl }) => `
      <img src="${avatarUrl}" alt=""> ${handle} followed a group
      ${templateDate(event.date, 'sciety-feed-card__event_date')}
    `,
    toHtmlFragment,
  )),
);

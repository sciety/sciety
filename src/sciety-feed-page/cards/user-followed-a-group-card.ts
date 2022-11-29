import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ScietyFeedCard } from './sciety-feed-card';
import { DomainEvent, UserFollowedEditorialCommunityEvent } from '../../domain-events';
import { GetGroup } from '../../shared-ports';
import { GetUserDetails } from '../../shared-ports/get-user-details';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  getGroup: GetGroup,
  getUserDetails: GetUserDetails,
};

type UserFollowedAGroupCard = (
  ports: Ports
) => (event: UserFollowedEditorialCommunityEvent) => TE.TaskEither<DE.DataError, ScietyFeedCard>;

export const userFollowedAGroupCard: UserFollowedAGroupCard = (ports) => (event) => pipe(
  {
    group: pipe(
      ports.getGroup(event.editorialCommunityId),
      T.of,
    ),
    userDetails: pipe(
      event.userId,
      ports.getUserDetails,
      TE.orElse(() => TE.right({
        handle: 'A user',
        avatarUrl: '/static/images/sciety-logo.jpg',
      })),
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.map(({ group, userDetails }) => ({
    linkUrl: `/groups/${group.slug}/about`,
    avatarUrl: userDetails.avatarUrl,
    titleText: `${userDetails.handle} followed a group`,
    date: event.date,
    details: {
      title: toHtmlFragment(group.name),
      content: toHtmlFragment(`<p>${group.shortDescription}</p>`),
    },
  })),
);

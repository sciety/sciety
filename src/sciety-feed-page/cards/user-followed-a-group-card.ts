import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { ScietyFeedCard } from './sciety-feed-card';
import { DomainEvent, UserFollowedEditorialCommunityEvent } from '../../domain-events';
import { GetGroup, GetUser } from '../../shared-ports';
import { toHtmlFragment } from '../../types/html-fragment';

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  getGroup: GetGroup,
  getUser: GetUser,
};

type UserFollowedAGroupCard = (
  ports: Ports
) => (event: UserFollowedEditorialCommunityEvent) => O.Option<ScietyFeedCard>;

export const userFollowedAGroupCard: UserFollowedAGroupCard = (ports) => (event) => pipe(
  {
    group: pipe(
      ports.getGroup(event.editorialCommunityId),
    ),
    userDetails: pipe(
      event.userId,
      ports.getUser,
      O.getOrElseW(
        () => ({
          handle: 'A user',
          avatarUrl: '/static/images/sciety-logo.jpg',
        }),
      ),
      O.some,
    ),
  },
  sequenceS(O.Apply),
  O.map(({ group, userDetails }) => ({
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

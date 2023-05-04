import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { UserFollowedEditorialCommunityEvent } from '../../../domain-events';
import { toHtmlFragment } from '../../../types/html-fragment';
import { ScietyFeedCard } from '../view-model';
import { Queries } from '../../../shared-read-models';

export type Ports = Pick<Queries, 'getGroup' | 'lookupUser'>;

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
      ports.lookupUser,
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

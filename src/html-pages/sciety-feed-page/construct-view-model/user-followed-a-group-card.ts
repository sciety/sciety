import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { EventOfType } from '../../../domain-events/index.js';
import { toHtmlFragment } from '../../../types/html-fragment.js';
import { ScietyFeedCard } from '../view-model.js';
import { Dependencies } from './dependencies.js';

type UserFollowedAGroupCard = (
  dependencies: Dependencies
) => (event: EventOfType<'UserFollowedEditorialCommunity'>) => O.Option<ScietyFeedCard>;

export const userFollowedAGroupCard: UserFollowedAGroupCard = (dependencies) => (event) => pipe(
  {
    group: pipe(
      dependencies.getGroup(event.editorialCommunityId),
    ),
    userDetails: pipe(
      event.userId,
      dependencies.lookupUser,
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
    feedItemHref: `/groups/${group.slug}`,
    avatarUrl: userDetails.avatarUrl,
    titleText: `${userDetails.handle} followed a group`,
    date: event.date,
    details: {
      title: toHtmlFragment(group.name),
      content: toHtmlFragment(`<p>${group.shortDescription}</p>`),
    },
  })),
);

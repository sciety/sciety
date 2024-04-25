import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { EventOfType } from '../../../../domain-events';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { UserHandle } from '../../../../types/user-handle';
import { constructUserAvatarSrc } from '../../../paths';
import { rawUserInput } from '../../../raw-user-input';
import { ScietyFeedCard } from '../view-model';

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
          id: event.userId,
          handle: 'A user' as UserHandle,
          displayName: 'A user',
          avatarUrl: '/static/images/sciety-logo.jpg',
        }),
      ),
      O.some,
    ),
  },
  sequenceS(O.Apply),
  O.map(({ group, userDetails }) => ({
    feedItemHref: `/groups/${group.slug}`,
    avatarSrc: constructUserAvatarSrc(userDetails),
    titleText: `${userDetails.handle} followed a group`,
    date: event.date,
    details: {
      title: toHtmlFragment(group.name),
      content: rawUserInput(group.shortDescription),
    },
  })),
);

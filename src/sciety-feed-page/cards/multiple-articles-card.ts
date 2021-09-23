import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { scietyFeedCard } from './sciety-feed-card';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';

type GetGroup = (id: GroupId) => TO.TaskOption<Group>;

export type MultipleArticlesCard = {
  groupId: GroupId,
  articleCount: number,
  date: Date,
};

export const multipleArticlesCard = (
  getGroup: GetGroup,
) => (
  card: MultipleArticlesCard,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  card.groupId,
  getGroup,
  TO.map((group) => pipe(
    {
      titleText: `${group.name} evaluated ${card.articleCount} articles`,
      linkUrl: `/groups/${group.slug}`,
      avatarUrl: group.avatarPath,
      date: card.date,
    },
    scietyFeedCard,
  )),
  T.map(E.fromOption(() => DE.unavailable)),
);

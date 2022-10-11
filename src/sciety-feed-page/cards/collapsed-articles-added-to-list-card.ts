import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ScietyFeedCard } from './sciety-feed-card';
import { ArticleAddedToListEvent } from '../../domain-events';
import { GetAllEvents } from '../../shared-ports';
import { getGroup } from '../../shared-read-models/groups';
import { getList, List } from '../../shared-read-models/lists';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import {CollapsedArticlesAddedToList} from '../collapse-close-events';

type Ports = {
  getAllEvents: GetAllEvents,
};

const addListOwnerName = (ports: Ports) => (list: List) => {
  switch (list.ownerId.tag) {
    case 'group-id':
      return pipe(
        ports.getAllEvents,
        TE.rightTask,
        TE.chainEitherK(getGroup(list.ownerId.value)),
        TE.map((group) => ({
          ...list,
          ownerName: group.name,
          ownerAvatarUrl: group.avatarPath,
        })),
      );
    case 'user-id':
      return TE.right({
        ...list,
        ownerName: 'A user',
        ownerAvatarUrl: '/static/images/sciety-logo.jpg',
      });
  }
};

type CollapsedArticlesAddedToListCard = (
  ports: Ports,
) => (event: CollapsedArticlesAddedToList) => TE.TaskEither<DE.DataError, ScietyFeedCard>;

export const collapsedArticlesAddedToListCard: CollapsedArticlesAddedToListCard = (ports) => (event) => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain(getList(event.listId)),
  TE.chain(addListOwnerName(ports)),
  TE.map((extendedListMetadata) => ({
    ownerName: extendedListMetadata.ownerName,
    ownerAvatarUrl: extendedListMetadata.ownerAvatarUrl,
    listName: extendedListMetadata.name,
    listDescription: extendedListMetadata.description,
  })),
  TE.map(
    (viewModel) => ({
      titleText: `${viewModel.ownerName} added multiple articles to a list`,
      linkUrl: `/lists/${event.listId}`,
      avatarUrl: viewModel.ownerAvatarUrl,
      date: event.date,
      details: {
        title: toHtmlFragment(viewModel.listName),
        content: toHtmlFragment(viewModel.listDescription),
      },
    }),
  ),
);

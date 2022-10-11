import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ScietyFeedCard } from './sciety-feed-card';
import { ArticleAddedToListEvent } from '../../domain-events';
import { GetAllEvents } from '../../shared-ports';
import { getList, List } from '../../shared-read-models/lists';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';

type Ports = {
  getAllEvents: GetAllEvents,
};

const addListOwnerName = (list: List) => {
  switch (list.ownerId.tag) {
    case 'group-id':
      return {
        ...list,
        ownerName: 'A group',
      };
    case 'user-id':
      return {
        ...list,
        ownerName: 'A user',
      };
  }
};

type ArticleAddedToListCard = (
  ports: Ports,
) => (event: ArticleAddedToListEvent) => TE.TaskEither<DE.DataError, ScietyFeedCard>;

export const articleAddedToListCard: ArticleAddedToListCard = (ports) => (event) => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain(getList(event.listId)),
  TE.map(addListOwnerName),
  TE.map((extendedListMetadata) => ({
    ownerName: extendedListMetadata.ownerName,
    listName: extendedListMetadata.name,
    listDescription: extendedListMetadata.description,
  })),
  TE.map(
    (viewModel) => ({
      titleText: `${viewModel.ownerName} added an article to a list`,
      linkUrl: `/lists/${event.listId}`,
      avatarUrl: '/static/images/sciety-logo.jpg',
      date: event.date,
      details: {
        title: toHtmlFragment(viewModel.listName),
        content: toHtmlFragment(viewModel.listDescription),
      },
    }),
  ),
);

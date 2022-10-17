import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { addListOwnershipInformation } from './article-added-to-list-card';
import { ScietyFeedCard } from './sciety-feed-card';
import { GetAllEvents } from '../../shared-ports';
import { getList } from '../../shared-read-models/lists';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';
import { CollapsedArticlesAddedToList } from '../collapse-close-events';

type GetUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, {
  handle: string,
  avatarUrl: string,
}>;

type Ports = {
  getAllEvents: GetAllEvents,
  getUserDetails: GetUserDetails,
};

type CollapsedArticlesAddedToListCard = (
  ports: Ports,
) => (event: CollapsedArticlesAddedToList) => TE.TaskEither<DE.DataError, ScietyFeedCard>;

export const collapsedArticlesAddedToListCard: CollapsedArticlesAddedToListCard = (ports) => (collapsedEvents) => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain(getList(collapsedEvents.listId)),
  // TE.chain(addListOwnerName(ports)),
  TE.chain(addListOwnershipInformation(ports)),
  TE.map((extendedListMetadata) => ({
    ownerName: extendedListMetadata.ownerName,
    ownerAvatarUrl: extendedListMetadata.ownerAvatarUrl,
    listName: extendedListMetadata.name,
    listDescription: extendedListMetadata.description,
    linkUrl: extendedListMetadata.linkUrl,
  })),
  TE.map(
    (viewModel) => ({
      titleText: `${viewModel.ownerName} added ${collapsedEvents.articleCount} articles to a list`,
      linkUrl: viewModel.linkUrl,
      avatarUrl: viewModel.ownerAvatarUrl,
      date: collapsedEvents.date,
      details: {
        title: toHtmlFragment(viewModel.listName),
        content: toHtmlFragment(viewModel.listDescription),
      },
    }),
  ),
);

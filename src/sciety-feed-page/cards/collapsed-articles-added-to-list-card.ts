import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { addListOwnershipInformation, Ports as AddListOwnershipInformationPorts } from './add-list-ownership-information';
import { ScietyFeedCard } from './sciety-feed-card';
import { GetAllEvents } from '../../shared-ports';
import { getList } from '../../shared-read-models/lists';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { CollapsedArticlesAddedToList } from '../feed-item';

type Ports = {
  getAllEvents: GetAllEvents,
} & AddListOwnershipInformationPorts;

type CollapsedArticlesAddedToListCard = (
  ports: Ports,
) => (event: CollapsedArticlesAddedToList) => TE.TaskEither<DE.DataError, ScietyFeedCard>;

export const collapsedArticlesAddedToListCard: CollapsedArticlesAddedToListCard = (ports) => (collapsedEvents) => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain(getList(collapsedEvents.listId)),
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

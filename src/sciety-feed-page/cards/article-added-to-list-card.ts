import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { addListOwnershipInformation, Ports as AddListOwnershipInformationPorts } from './add-list-ownership-information';
import { ScietyFeedCard } from './sciety-feed-card';
import { ArticleAddedToListEvent } from '../../domain-events';
import { GetAllEvents } from '../../shared-ports';
import { getList } from '../../shared-read-models/lists';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';

type Ports = {
  getAllEvents: GetAllEvents,
} & AddListOwnershipInformationPorts;

type ArticleAddedToListCard = (
  ports: Ports,
) => (event: ArticleAddedToListEvent) => TE.TaskEither<DE.DataError, ScietyFeedCard>;

export const articleAddedToListCard: ArticleAddedToListCard = (ports) => (event) => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain(getList(event.listId)),
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
      titleText: `${viewModel.ownerName} added an article to a list`,
      linkUrl: viewModel.linkUrl,
      avatarUrl: viewModel.ownerAvatarUrl,
      date: event.date,
      details: {
        title: toHtmlFragment(viewModel.listName),
        content: toHtmlFragment(viewModel.listDescription),
      },
    }),
  ),
);

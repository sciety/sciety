import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { addListOwnershipInformation, Ports as AddListOwnershipInformationPorts } from './add-list-ownership-information';
import { ScietyFeedCard } from './sciety-feed-card';
import { ArticleAddedToListEvent } from '../../domain-events';
import { GetList } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';

export type Ports = {
  getList: GetList,
} & AddListOwnershipInformationPorts;

type ArticleAddedToListCard = (
  ports: Ports,
) => (event: ArticleAddedToListEvent) => TE.TaskEither<DE.DataError, ScietyFeedCard>;

export const articleAddedToListCard: ArticleAddedToListCard = (ports) => (event) => pipe(
  event.listId,
  ports.getList,
  TE.fromOption(() => DE.notFound),
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

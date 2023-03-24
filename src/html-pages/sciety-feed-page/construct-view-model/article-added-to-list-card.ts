import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { addListOwnershipInformation, Ports as AddListOwnershipInformationPorts } from './add-list-ownership-information';
import { ScietyFeedCard } from './sciety-feed-card';
import { ArticleAddedToListEvent } from '../../../domain-events';
import { LookupList } from '../../../shared-ports';
import { toHtmlFragment } from '../../../types/html-fragment';

export type Ports = {
  lookupList: LookupList,
} & AddListOwnershipInformationPorts;

type ArticleAddedToListCard = (
  ports: Ports,
) => (event: ArticleAddedToListEvent) => O.Option<ScietyFeedCard>;

export const articleAddedToListCard: ArticleAddedToListCard = (ports) => (event) => pipe(
  event.listId,
  ports.lookupList,
  O.map(addListOwnershipInformation(ports)),
  O.map((extendedListMetadata) => ({
    ownerName: extendedListMetadata.ownerName,
    ownerAvatarUrl: extendedListMetadata.ownerAvatarUrl,
    listName: extendedListMetadata.name,
    listDescription: extendedListMetadata.description,
    linkUrl: extendedListMetadata.linkUrl,
  })),
  O.map(
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

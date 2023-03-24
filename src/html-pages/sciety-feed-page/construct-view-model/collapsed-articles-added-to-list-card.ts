import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { addListOwnershipInformation, Ports as AddListOwnershipInformationPorts } from './add-list-ownership-information';
import { ScietyFeedCard } from '../view-model';
import { LookupList } from '../../../shared-ports';
import { toHtmlFragment } from '../../../types/html-fragment';
import { CollapsedArticlesAddedToList } from './feed-item';

export type Ports = {
  lookupList: LookupList,
} & AddListOwnershipInformationPorts;

type CollapsedArticlesAddedToListCard = (
  ports: Ports,
) => (event: CollapsedArticlesAddedToList) => O.Option<ScietyFeedCard>;

export const collapsedArticlesAddedToListCard: CollapsedArticlesAddedToListCard = (ports) => (collapsedEvents) => pipe(
  collapsedEvents.listId,
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

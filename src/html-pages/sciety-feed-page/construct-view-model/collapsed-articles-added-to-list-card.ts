import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { addListOwnershipInformation, Ports as AddListOwnershipInformationPorts } from './add-list-ownership-information';
import { ScietyFeedCard } from '../view-model';
import { toHtmlFragment } from '../../../types/html-fragment';
import { CollapsedArticlesAddedToList } from './feed-item';
import { Queries } from '../../../shared-read-models';

export type Ports = AddListOwnershipInformationPorts & {
  lookupList: Queries['lookupList'],
};

export const collapsedArticlesAddedToListCard = (
  dependencies: Ports,
) => (collapsedEvents: CollapsedArticlesAddedToList): O.Option<ScietyFeedCard> => pipe(
  collapsedEvents.listId,
  dependencies.lookupList,
  O.map(addListOwnershipInformation(dependencies)),
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

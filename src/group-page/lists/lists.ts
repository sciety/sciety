import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { lists as listsData } from '../../ncrc-featured-articles-page/lists';
import { ListCardViewModel, renderListCard } from '../../shared-components/list-card/render-list-card';
import { templateListItems } from '../../shared-components/list-items';
import { allLists, selectAllListsOwnedBy } from '../../shared-read-models/all-lists';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = {
  getAllEvents: GetAllEvents,
};

const renderCards = (cards: ReadonlyArray<HtmlFragment>) => pipe(
  cards,
  (items) => templateListItems(items, 'group-page-followers-list__item'),
  (listContent) => `
    <section class="group-page-lists">
      <ul class="group-page-followers-list" role="list">
        ${listContent}
      </ul>
    </section>
  `,
  toHtmlFragment,
);

const addNcrcListCardViewModelOnNcrcPage = (
  groupSlug: string,
) => (
  cardViewModels: ReadonlyArray<ListCardViewModel>,
) => ((groupSlug === 'ncrc')
  ? [{
    href: '/lists/cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7',
    title: 'High interest articles',
    articleCountLabel: 'This list contains',
    description: 'Articles that have been identified as high interest by NCRC editors.',
    articleCount: listsData['cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7'].length,
    lastUpdated: O.some(new Date('2021-11-24')),
  }, ...cardViewModels]
  : cardViewModels);

const addBiophysicsColabListCardViewModelOnBiophysicsColabPage = (
  groupSlug: string,
) => (
  cardViewModels: ReadonlyArray<ListCardViewModel>,
) => ((groupSlug === 'biophysics-colab')
  ? [{
    href: '/lists/5ac3a439-e5c6-4b15-b109-92928a740812',
    title: 'Endorsed articles',
    articleCountLabel: 'This list contains',
    description: 'Articles that have been endorsed by Biophysics Colab.',
    articleCount: listsData['5ac3a439-e5c6-4b15-b109-92928a740812'].length,
    lastUpdated: O.some(new Date('2021-11-22T15:09:00Z')),
  }, ...cardViewModels]
  : cardViewModels);

export const lists = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.map(allLists),
  TE.map(selectAllListsOwnedBy(group.id)),
  TE.map((details) => ({
    ...details,
    href: `/groups/${group.slug}/evaluated-articles`,
    title: details.name,
    articleCountLabel: 'This group has evaluated',
  })),
  TE.map((cardViewModel) => [cardViewModel]),
  TE.map(addNcrcListCardViewModelOnNcrcPage(group.slug)),
  TE.map(addBiophysicsColabListCardViewModelOnBiophysicsColabPage(group.slug)),
  TE.map(RA.map(renderListCard)),
  TE.map(renderCards),
);

import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { ListCardViewModel, renderListCard } from '../../shared-components/list-card/render-list-card';
import { templateListItems } from '../../shared-components/list-items';
import { selectArticlesBelongingToList } from '../../shared-read-models/list-articles';
import { selectAllListsOwnedBy } from '../../shared-read-models/lists';
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

const addNcrcListCardViewModelOnNcrcPage = (groupSlug: string) => (cardViewModels: ReadonlyArray<ListCardViewModel>) => (events: ReadonlyArray<DomainEvent>) => ((groupSlug === 'ncrc')
  ? pipe(
    events,
    selectArticlesBelongingToList('cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7'),
    E.map((articleIds) => [
      {
        href: '/lists/cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7',
        title: 'High interest articles',
        articleCountLabel: 'This list contains',
        description: 'Articles that have been identified as high interest by NCRC editors.',
        lastUpdated: O.some(new Date('2021-11-24')),
        articleCount: articleIds.length,
      },
      ...cardViewModels,
    ]),
  )
  : E.right(cardViewModels)
);

const addBiophysicsColabListCardViewModelOnBiophysicsColabPage = (groupSlug: string) => (cardViewModels: ReadonlyArray<ListCardViewModel>) => (events: ReadonlyArray<DomainEvent>) => ((groupSlug === 'biophysics-colab')
  ? pipe(
    events,
    selectArticlesBelongingToList('5ac3a439-e5c6-4b15-b109-92928a740812'),
    E.map((articleIds) => [
      {
        href: '/lists/5ac3a439-e5c6-4b15-b109-92928a740812',
        title: 'Endorsed articles',
        articleCountLabel: 'This list contains',
        description: 'Articles that have been endorsed by Biophysics Colab.',
        lastUpdated: O.some(new Date('2021-11-22T15:09:00Z')),
        articleCount: articleIds.length,
      },
      ...cardViewModels,
    ]),
  )
  : E.right(cardViewModels)
);

const addElifeListCardViewModelOnElifePage = (groupSlug: string) => (cardViewModels: ReadonlyArray<ListCardViewModel>) => (events: ReadonlyArray<DomainEvent>) => ((groupSlug === 'elife')
  ? pipe(
    events,
    selectArticlesBelongingToList('c7237468-aac1-4132-9598-06e9ed68f31d'),
    E.map((articleIds) => [
      {
        href: '/lists/c7237468-aac1-4132-9598-06e9ed68f31d',
        title: 'Medicine',
        articleCountLabel: 'This list contains',
        description: 'Medicine articles that have been evaluated by eLife.',
        lastUpdated: O.some(new Date('2022-02-01T13:14:00Z')),
        articleCount: articleIds.length,
      },
      ...cardViewModels,
    ]),
  )
  : E.right(cardViewModels)
);

export const lists = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.map(selectAllListsOwnedBy(group.id)),
  TE.map(RA.match(
    () => [],
    (l) => pipe(
      l[0],
      (details) => ({
        ...details,
        href: `/groups/${group.slug}/evaluated-articles`,
        title: details.name,
        articleCountLabel: 'This group has evaluated',
      }),
      ((cardViewModel) => [cardViewModel]),
    ),
  )),
  TE.chain((cardViewModels) => pipe(
    ports.getAllEvents,
    T.map(addNcrcListCardViewModelOnNcrcPage(group.slug)(cardViewModels)),
  )),
  TE.chain((cardViewModels) => pipe(
    ports.getAllEvents,
    T.map(addBiophysicsColabListCardViewModelOnBiophysicsColabPage(group.slug)(cardViewModels)),
  )),
  TE.chain((cardViewModels) => pipe(
    ports.getAllEvents,
    T.map(addElifeListCardViewModelOnElifePage(group.slug)(cardViewModels)),
  )),
  TE.map(RA.match(
    () => toHtmlFragment('<p class="static-message">This group doesn\'t have any lists yet.</p>'),
    flow(
      RA.map(renderListCard),
      renderCards,
    ),
  )),
);

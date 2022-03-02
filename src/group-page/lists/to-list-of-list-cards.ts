import { sequenceS } from 'fp-ts/Apply';
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
import { List } from '../../shared-read-models/lists';
import { addLastUpdatedFromEvents } from '../../shared-read-models/lists/get-list';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import * as Gid from '../../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import * as Lid from '../../types/list-id';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type Ports = {
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

const addElifeListCardViewModelOnElifePage = (
  groupSlug: string,
) => (cardViewModels: ReadonlyArray<ListCardViewModel>) => (events: ReadonlyArray<DomainEvent>) => {
  if (groupSlug !== 'elife') {
    return E.right(cardViewModels);
  }

  const medicineList = pipe(
    events,
    selectArticlesBelongingToList('c7237468-aac1-4132-9598-06e9ed68f31d'),
    E.map((articleIds) => ({
      id: Lid.fromValidatedString('c7237468-aac1-4132-9598-06e9ed68f31d'),
      name: 'Medicine',
      description: 'Medicine articles that have been evaluated by eLife.',
      createdOn: new Date('2022-02-01T13:14:00Z'),
      ownerId: Gid.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
      articleCount: articleIds.length,
    })),
    E.map(addLastUpdatedFromEvents(
      events,
      Lid.fromValidatedString('c7237468-aac1-4132-9598-06e9ed68f31d'),
    )),
    E.map((list) => (
      {
        ...list,
        href: '/lists/c7237468-aac1-4132-9598-06e9ed68f31d',
        title: list.name,
        articleCountLabel: 'This list contains',
        lastUpdated: O.some(list.lastUpdated),
      }
    )),
  );

  const cellBiologyList = pipe(
    events,
    selectArticlesBelongingToList('cb15ef21-944d-44d6-b415-a3d8951e9e8b'),
    E.map((articleIds) => ({
      id: Lid.fromValidatedString('cb15ef21-944d-44d6-b415-a3d8951e9e8b'),
      name: 'Cell Biology',
      description: 'Cell Biology articles that have been evaluated by eLife.',
      createdOn: new Date('2022-02-09T09:43:00Z'),
      ownerId: Gid.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
      articleCount: articleIds.length,
    })),
    E.map(addLastUpdatedFromEvents(
      events,
      Lid.fromValidatedString('cb15ef21-944d-44d6-b415-a3d8951e9e8b'),
    )),
    E.map((list) => (
      {
        ...list,
        href: '/lists/cb15ef21-944d-44d6-b415-a3d8951e9e8b',
        title: list.name,
        articleCountLabel: 'This list contains',
        lastUpdated: O.some(list.lastUpdated),
      }
    )),
  );

  return pipe(
    {
      medicineList,
      cellBiologyList,
    },
    sequenceS(E.Apply),
    E.map((lists) => [
      lists.cellBiologyList,
      lists.medicineList,
      ...cardViewModels,
    ]),
  );
};

type ToListOfListCards = (ports: Ports, group: Group)
=> (lists: ReadonlyArray<List>)
=> TE.TaskEither<DE.DataError, HtmlFragment>;

export const toListOfListCards: ToListOfListCards = (ports, group) => (lists) => pipe(
  lists,
  RA.match(
    () => [],
    (l) => pipe(
      l[0],
      (details) => ({
        ...details,
        href: `/groups/${group.slug}/evaluated-articles`,
        title: details.name,
        articleCountLabel: 'This group has evaluated',
      }),
      (unshimmedCardViewModel) => (
        { ...unshimmedCardViewModel, lastUpdated: O.some(unshimmedCardViewModel.lastUpdated) }
      ),
      ((cardViewModel) => [cardViewModel]),
    ),
  ),
  TE.right,
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

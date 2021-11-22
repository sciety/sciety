import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { renderListCard } from '../../shared-components/list-card/render-list-card';
import { templateListItems } from '../../shared-components/list-items';
import { allLists, Ports as GroupListPorts } from '../../shared-read-models/all-lists';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = GroupListPorts & {
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

export const lists = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain(allLists(ports, group.id)),
  TE.map((details) => ({
    ...details,
    href: `/groups/${group.slug}/evaluated-articles`,
    title: details.name,
    articleCountLabel: 'This group has evaluated',
  })),
  TE.map((cardViewModel) => [cardViewModel]),
  TE.map((cardViewModels) => ((group.slug === 'ncrc')
    ? [...cardViewModels, {
      href: '/lists/cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7',
      title: 'Featured articles',
      articleCountLabel: 'This list contains',
      description: 'Articles that have been identified as high-impact by NCRC editors.',
      ownerName: 'NCRC',
      ownerHref: '/groups/ncrc',
      ownerAvatarPath: '/static/groups/ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg',
      articleCount: 1,
      lastUpdated: O.some(new Date('2021-11-18T11:33:00Z')),
    }]
    : cardViewModels)),
  TE.map(RA.map(renderListCard)),
  TE.map(renderCards),
);

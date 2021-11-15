import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { renderListCard } from '../../shared-components/list-card/render-list-card';
import { groupList } from '../../shared-read-models/group-list';
import { Group } from '../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { defaultGroupListDescription } from '../messages';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = {
  getAllEvents: GetAllEvents,
};

const renderLists = (evaluatedArticlesListCard: HtmlFragment) => toHtmlFragment(`
  <section class="group-page-lists">
    ${evaluatedArticlesListCard}
  </section>
`);

export const lists = (ports: Ports) => (group: Group): TE.TaskEither<never, HtmlFragment> => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain(groupList(group.id)),
  TE.map((details) => ({
    ...details,
    href: `/groups/${group.slug}/evaluated-articles`,
    title: 'Evaluated articles',
    description: defaultGroupListDescription(group.name),
    articleCountLabel: 'This group has evaluated',
  })),
  TE.map(renderListCard),
  TE.map(renderLists),
);

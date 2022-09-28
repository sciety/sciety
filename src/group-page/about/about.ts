import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchStaticFile, renderDescription } from './render-description';
import { renderLists } from './render-lists';
import { List } from '../../shared-read-models/lists';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import * as LOID from '../../types/list-owner-id';
import { ListOwnerId } from '../../types/list-owner-id';

export type Ports = {
  fetchStaticFile: FetchStaticFile,
  getListsOwnedBy: (ownerId: ListOwnerId) => TE.TaskEither<DE.DataError, ReadonlyArray<List>>,
};

type RenderAbout = (about: { lists: HtmlFragment, description: HtmlFragment }) => HtmlFragment;

const renderAbout: RenderAbout = (about) => toHtmlFragment(`
  <div class="group-page-about">
    ${about.lists}
    ${about.description}
  </div>
`);

type ListViewModel = {
  articleCount: number,
  lastUpdated: O.Option<Date>,
  href: string,
  title: string,
  description: string,
};

type ToListViewModel = (list: List) => ListViewModel;

export const toListViewModel: ToListViewModel = (list) => ({
  ...list,
  href: `/lists/${list.id}`,
  title: list.name,
  lastUpdated: O.some(list.lastUpdated),
});

const lists = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, ReadonlyArray<ListViewModel>> => pipe(
  group.id,
  LOID.fromGroupId,
  ports.getListsOwnedBy,
  TE.map(RA.map(toListViewModel)),
);

export const about = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  `groups/${group.descriptionPath}`,
  ports.fetchStaticFile,
  TE.map(renderDescription),
  TE.map((renderedDescription) => ({
    description: renderedDescription,
    lists: renderLists(lists),
  })),
  TE.map(renderAbout),
);

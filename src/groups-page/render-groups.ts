import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { constant, flow, pipe } from 'fp-ts/function';
import { Group, RenderGroup } from './render-group';
import { templateListItems } from '../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderGroups = (userId: O.Option<UserId>) => T.Task<HtmlFragment>;

export type GetAllGroups = T.Task<RNEA.ReadonlyNonEmptyArray<Group>>;

const render = (links: RNEA.ReadonlyNonEmptyArray<HtmlFragment>) => `
  <section class="groups-page">
    <header class="page-header">
      <h1>
        Groups
      </h1>
      <p>
        A Sciety group is a team of scientists who evaluate, curate and screen research articles. <a href="https://blog.sciety.org/sciety-groups/">Read more about Sciety groups</a>.
      </p>
      <p>
        Built for researchers to learn about the latest results, Sciety adds to its growing network by showcasing open preprint evaluations from groups of experts. <a href="https://blog.sciety.org/covid-groups/">Read more about how groups are selected for Sciety</a>.
        </p>
    </header>
    <ol class="group-list" role="list">
      ${templateListItems(links, 'group-list__item')}
    </ol>
  </section>
`;

export const renderGroups = (
  editorialCommunities: GetAllGroups,
  renderGroup: RenderGroup,
): RenderGroups => (userId) => (
  pipe(
    editorialCommunities,
    T.chain(T.traverseArray(renderGroup(userId))),
    T.map(flow(
      RNEA.fromReadonlyArray, // TODO shouldn't be needed, fp-ts types needs fixing
      O.fold(constant(''), render),
      toHtmlFragment,
    )),
  )
);

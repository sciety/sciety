import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Group, RenderGroup } from './render-group';
import { templateListItems } from '../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderGroups = T.Task<HtmlFragment>;

export type GetAllGroups = T.Task<RNEA.ReadonlyNonEmptyArray<Group>>;

const render = (links: RNEA.ReadonlyNonEmptyArray<HtmlFragment>) => `
  <div class="page-content__background">
    <div class="sciety-grid sciety-grid--one-column">
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
    </div>
  </div>
`;

export const renderGroups = (
  editorialCommunities: GetAllGroups,
  renderGroup: RenderGroup,
): RenderGroups => (
  pipe(
    editorialCommunities,
    T.map(flow(
      RNEA.map(renderGroup),
      render,
      toHtmlFragment,
    )),
  )
);

import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchStaticFile, renderDescription } from './render-description';
import { renderLists } from './render-lists';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export type Ports = {
  fetchStaticFile: FetchStaticFile,
};

type RenderAbout = (about: { lists: HtmlFragment, description: HtmlFragment }) => HtmlFragment;

const renderAbout: RenderAbout = (about) => toHtmlFragment(`
  <div class="group-page-about">
    ${about.lists}
    ${about.description}
  </div>
`);

export const about = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  `groups/${group.descriptionPath}`,
  ports.fetchStaticFile,
  TE.map(renderDescription),
  TE.map((renderedDescription) => ({
    description: renderedDescription,
    lists: renderLists(),
  })),
  TE.map(renderAbout),
);

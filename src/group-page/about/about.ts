import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchStaticFile, renderDescription } from './render-description';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export type Ports = {
  fetchStaticFile: FetchStaticFile,
};

const lists = process.env.EXPERIMENT_ENABLED ? 'Placeholder for group lists' : '';

const renderAbout = (description: HtmlFragment) => toHtmlFragment(`
  <div class="group-page-about">
    ${lists}
    ${description}
  </div>
`);

export const about = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  `groups/${group.descriptionPath}`,
  ports.fetchStaticFile,
  TE.map(renderDescription),
  TE.map(renderAbout),
);

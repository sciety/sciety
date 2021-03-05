import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { Remarkable } from 'remarkable';
import { Group } from '../types/group';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderDescription = (group: Group) => TE.TaskEither<'not-found' | 'unavailable', HtmlFragment>;

type FetchStaticFile = (filename: string) => TE.TaskEither<'not-found' | 'unavailable', string>;

const convertMarkdownToHtml = (md: string) => new Remarkable({ html: true }).render(md);

const renderAsSection = (desc: string) => `
  <section>
    ${desc}
  </section>
`;

export const renderDescription = (
  fetchStaticFile: FetchStaticFile,
): RenderDescription => (group) => pipe(
  `groups/${group.descriptionPath}`,
  fetchStaticFile,
  TE.map(flow(
    convertMarkdownToHtml,
    renderAsSection,
    toHtmlFragment,
  )),
);

import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { Remarkable } from 'remarkable';
import * as DE from '../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderDescription = (description: string) => HtmlFragment;

export type FetchStaticFile = (filename: string) => TE.TaskEither<DE.DataError, string>;

const convertMarkdownToHtml = (md: string) => new Remarkable({ html: true }).render(md);

const renderAsSection = (desc: string) => `
  <section>
    ${desc}
  </section>
`;

export const renderDescription: RenderDescription = flow(
  convertMarkdownToHtml,
  renderAsSection,
  toHtmlFragment,
);

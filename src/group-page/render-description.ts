import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { Remarkable } from 'remarkable';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderDescription = (description: string) => HtmlFragment;

export type FetchStaticFile = (filename: string) => TE.TaskEither<'not-found' | 'unavailable', string>;

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

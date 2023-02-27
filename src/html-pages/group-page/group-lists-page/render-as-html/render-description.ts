import { flow } from 'fp-ts/function';
import { Remarkable } from 'remarkable';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

type RenderDescription = (description: string) => HtmlFragment;

const convertMarkdownToHtml = (md: string) => new Remarkable({ html: true }).render(md);

export const renderDescription: RenderDescription = flow(
  convertMarkdownToHtml,
  toHtmlFragment,
);

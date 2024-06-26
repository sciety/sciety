import { toHtmlFragment } from '../../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../html-page';

export const renderAsHtml = (): HtmlPage => toHtmlPage({
  title: 'Category page',
  content: toHtmlFragment('Category page'),
});

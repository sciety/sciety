import { HtmlFragment } from '../../../types/html-fragment';
import { HtmlPage, NotHtml, toHtmlPage } from '../html-page';

export const renderAsHtml = (content: HtmlFragment): HtmlPage => toHtmlPage({
  title: 'Groups',
  content,
  openGraph: {
    title: 'Sciety Groups',
    description: 'Content creators helping you decide which preprints to read and trust.' as NotHtml,
  },
});

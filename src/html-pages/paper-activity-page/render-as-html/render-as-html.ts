import striptags from 'striptags';
import { renderDescriptionMetaTagContent } from './render-description-meta-tag-content';
import { renderPage } from './render-page';
import { HtmlPage, NotHtml, toHtmlPage } from '../../html-page';
import { ViewModel } from '../view-model';

export const renderAsHtml = (viewmodel: ViewModel): HtmlPage => toHtmlPage({
  content: renderPage(viewmodel),
  title: striptags(viewmodel.title),
  description: renderDescriptionMetaTagContent(viewmodel) as NotHtml,
  openGraph: {
    title: striptags(viewmodel.title),
    description: striptags(viewmodel.abstract) as NotHtml,
  },
});

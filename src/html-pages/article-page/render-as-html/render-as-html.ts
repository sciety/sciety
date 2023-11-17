import striptags from 'striptags';
import { renderDescriptionMetaTagContent } from './render-description-meta-tag-content.js';
import { renderPage } from './render-page.js';
import { HtmlPage } from '../../html-page.js';
import { ViewModel } from '../view-model.js';

export const renderAsHtml = (viewmodel: ViewModel): HtmlPage => ({
  content: renderPage(viewmodel),
  title: striptags(viewmodel.title),
  description: renderDescriptionMetaTagContent(viewmodel),
  openGraph: {
    title: striptags(viewmodel.title),
    description: striptags(viewmodel.abstract),
  },
});

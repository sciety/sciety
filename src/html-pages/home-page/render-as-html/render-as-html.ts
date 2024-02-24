import { pipe } from 'fp-ts/function';
import { HtmlPage, toHtmlPage } from '../../html-page.js';
import { renderHomepage } from './render-home-page.js';
import { ViewModel } from '../view-model.js';

export const renderAsHtml = (viewmodel: ViewModel): HtmlPage => pipe(
  viewmodel,
  renderHomepage,
  (content) => toHtmlPage({
    title: `Sciety: ${viewmodel.pageHeading}`,
    content,
  }),
);

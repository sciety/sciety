import { pipe } from 'fp-ts/function';
import { renderHomepage } from './render-home-page';
import { HtmlPage, toHtmlPage } from '../../html-page';
import { ViewModel } from '../view-model';

export const renderAsHtml = (viewmodel: ViewModel): HtmlPage => pipe(
  viewmodel,
  renderHomepage,
  (content) => toHtmlPage({
    title: `Sciety: ${viewmodel.pageHeading}`,
    content,
  }),
);

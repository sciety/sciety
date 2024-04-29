import { renderDescription } from './render-description';
import { renderPage } from './render-page';
import { HtmlPage, toHtmlPage } from '../../../../../html-pages/html-page';
import { ViewModel } from '../view-model';

export const renderAsHtml = (viewmodel: ViewModel): HtmlPage => toHtmlPage({
  title: viewmodel.userDetails.displayName,
  openGraph: {
    title: viewmodel.userDetails.displayName,
    description: renderDescription(viewmodel),
  },
  content: renderPage(viewmodel),
});

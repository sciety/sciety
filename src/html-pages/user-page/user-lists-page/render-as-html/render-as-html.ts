import { HtmlPage, toHtmlPage } from '../../../html-page';
import { ViewModel } from '../view-model';
import { renderDescription } from './render-description';
import { renderPage } from './render-page';

export const renderAsHtml = (viewmodel: ViewModel): HtmlPage => toHtmlPage({
  title: viewmodel.userDetails.displayName,
  openGraph: {
    title: viewmodel.userDetails.displayName,
    description: renderDescription(viewmodel),
  },
  content: renderPage(viewmodel),
});

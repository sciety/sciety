import { HtmlPage } from '../../../html-page.js';
import { ViewModel } from '../view-model.js';
import { renderDescription } from './render-description.js';
import { renderPage } from './render-page.js';

export const renderAsHtml = (viewmodel: ViewModel): HtmlPage => ({
  title: viewmodel.userDetails.displayName,
  openGraph: {
    title: viewmodel.userDetails.displayName,
    description: renderDescription(viewmodel),
  },
  content: renderPage(viewmodel),
});

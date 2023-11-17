import { HtmlPage } from '../../../html-page.js';
import { ViewModel } from '../view-model.js';
import { renderPage } from './render-page.js';

export const renderAsHtml = (viewmodel: ViewModel): HtmlPage => ({
  title: viewmodel.group.name,
  content: renderPage(viewmodel),
});

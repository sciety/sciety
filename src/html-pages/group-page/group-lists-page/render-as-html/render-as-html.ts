import { HtmlPage } from '../../../html-page';
import { ViewModel } from '../view-model';
import { renderPage } from './render-page';

export const renderAsHtml = (viewmodel: ViewModel): HtmlPage => ({
  title: viewmodel.group.name,
  content: renderPage(viewmodel),
});

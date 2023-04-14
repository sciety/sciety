import { ViewModel } from '../view-model';
import { Page } from '../../../types/page';
import { renderPage } from './render-page';

export const renderAsHtml = (viewModel: ViewModel): Page => ({
  title: 'Lists',
  content: renderPage(viewModel),
});

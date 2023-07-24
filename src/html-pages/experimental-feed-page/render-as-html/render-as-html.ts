import { Page } from '../../../types/page';
import { ViewModel } from '../view-model';
import { renderPage } from './render-page';

export const renderAsHtml = (viewModel: ViewModel): Page => ({
  title: 'Sciety Feed',
  content: renderPage(viewModel),
});

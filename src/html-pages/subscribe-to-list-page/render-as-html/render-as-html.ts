import { ViewModel } from '../view-model';
import { renderPage } from './render-page';
import { Page } from '../../../types/page';

export const renderAsHtml = (viewModel: ViewModel): Page => ({
  title: `Subscribe to ${viewModel.listName}`,
  content: renderPage(viewModel),
});

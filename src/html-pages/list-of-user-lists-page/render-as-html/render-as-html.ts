import { ViewModel } from '../view-model';
import { Page } from '../../../types/page';
import { renderPage } from './render-page';

export const renderAsHtml = (viewModel: ViewModel): Page => ({
  title: 'Most active user lists',
  content: renderPage(viewModel),
});

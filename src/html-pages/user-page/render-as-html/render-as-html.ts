import { Page } from '../../../types/page';
import { ViewModel } from '../view-model';
import { renderPage } from './render-page';

export const renderAsHtml = (viewmodel: ViewModel): Page => ({
  title: viewmodel.userDisplayName,
  openGraph: {
    title: viewmodel.userDisplayName,
    description: viewmodel.description,
  },
  content: renderPage(viewmodel),
});

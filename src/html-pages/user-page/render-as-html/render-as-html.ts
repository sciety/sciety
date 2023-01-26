import { Page } from '../../../types/page';
import { ViewModel } from '../view-model';
import { renderDescription } from './render-description';
import { renderPage } from './render-page';

export const renderAsHtml = (viewmodel: ViewModel): Page => ({
  title: viewmodel.user.displayName,
  openGraph: {
    title: viewmodel.user.displayName,
    description: renderDescription(viewmodel),
  },
  content: renderPage(viewmodel),
});

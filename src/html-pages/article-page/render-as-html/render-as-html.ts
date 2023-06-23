import striptags from 'striptags';
import { renderDescriptionMetaTagContent } from './render-description-meta-tag-content';
import { renderPage } from './render-page';
import { Page } from '../../../types/page';
import { ViewModel } from '../view-model';

export const renderAsHtml = (viewmodel: ViewModel): Page => ({
  content: renderPage(viewmodel),
  title: striptags(viewmodel.title),
  description: renderDescriptionMetaTagContent(viewmodel),
  openGraph: {
    title: striptags(viewmodel.title),
    // TODO: how do we express language in an opengraph description for a social media preview card of this page?
    description: striptags(viewmodel.abstract.content),
  },
});

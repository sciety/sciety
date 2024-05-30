import { ViewModel } from './construct-view-model/construct-view-model';
import { renderPage } from './render-page';
import { HtmlPage, NotHtml, toHtmlPage } from '../html-page';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: viewModel.title,
  content: renderPage(viewModel),
  openGraph: {
    title: 'Sciety Groups',
    description: 'Content creators helping you decide which preprints to read and trust.' as NotHtml,
  },
});

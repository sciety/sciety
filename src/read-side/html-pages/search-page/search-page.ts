import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderAsHtml } from './render-as-html/render-as-html';
import { ViewModel } from './view-model';
import { ErrorPageViewModel } from '../construct-error-page-view-model';
import { HtmlPage } from '../html-page';

const viewModel: ViewModel = [
  {
    title: 'Infectious Diseases (except HIV/AIDS)',
    href: 'https://labs.sciety.org/categories/articles?category=Infectious%20Diseases%20(except%20HIV/AIDS)',
  },
  {
    title: 'Epidemiology',
    href: 'https://labs.sciety.org/categories/articles?category=Epidemiology',
  },
];

export const searchPage: TE.TaskEither<ErrorPageViewModel, HtmlPage> = pipe(
  viewModel,
  renderAsHtml,
  TE.right,
);

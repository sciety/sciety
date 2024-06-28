import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { renderArticlesList } from './render-articles-list';
import { ViewModel } from './view-model';
import { HtmlFragment } from '../../../types/html-fragment';

export const renderCategoryContent = (viewModel: ViewModel['categoryContent']): HtmlFragment => pipe(
  [E.right(viewModel)],
  renderArticlesList,
);

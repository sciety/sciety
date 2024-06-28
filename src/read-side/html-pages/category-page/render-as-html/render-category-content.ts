import { pipe } from 'fp-ts/function';
import { renderArticlesList } from './render-articles-list';
import { HtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';

export const renderCategoryContent = (viewModel: ViewModel['categoryContent']): HtmlFragment => pipe(
  viewModel,
  renderArticlesList,
);

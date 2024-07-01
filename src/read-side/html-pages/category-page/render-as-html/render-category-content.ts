import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { renderArticlesList } from './render-articles-list';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';

export const renderCategoryContent = (viewModel: ViewModel['categoryContent']): HtmlFragment => pipe(
  viewModel,
  RA.match(
    () => toHtmlFragment('<p>No evaluated articles were found for this category.</p>'),
    renderArticlesList,
  ),
);

import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment } from '../../../types/html-fragment';
import {
  ArticleCardViewModel, renderArticleCard,
} from '../shared-components/article-card';
import { renderArticleList } from '../shared-components/article-list';
import { renderListItems } from '../shared-components/list-items';

export const renderArticlesList = (articleCardViewModels: ReadonlyArray<ArticleCardViewModel>): HtmlFragment => pipe(
  articleCardViewModels,
  RA.map(renderArticleCard),
  (listItems) => renderListItems(listItems),
  (list) => renderArticleList(list),
);

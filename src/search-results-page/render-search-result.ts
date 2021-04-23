import * as O from 'fp-ts/Option';
import { GroupViewModel, renderGroupSearchResult } from './render-group-search-result';
import { renderArticleActivity } from '../shared-components';
import { Doi } from '../types/doi';
import { HtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type ArticleViewModel = {
  _tag: 'Article',
  doi: Doi,
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
  postedDate: Date,
  latestVersionDate: O.Option<Date>,
  latestActivityDate: O.Option<Date>,
  evaluationCount: number,
};

export type ItemViewModel = ArticleViewModel | GroupViewModel;

type RenderSearchResult = (result: ItemViewModel) => HtmlFragment;

export const renderSearchResult: RenderSearchResult = (result) => {
  switch (result._tag) {
    case 'Article':
      return renderArticleActivity(result);
    case 'Group':
      return renderGroupSearchResult(result);
  }
};

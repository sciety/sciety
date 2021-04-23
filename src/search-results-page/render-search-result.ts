import { GroupViewModel, renderGroupSearchResult } from './render-group-search-result';
import { ArticleViewModel, renderArticleActivity } from '../shared-components';
import { HtmlFragment } from '../types/html-fragment';

export type ItemViewModel = ArticleViewModel & { _tag: 'Article' } | GroupViewModel & { _tag: 'Group' };

type RenderSearchResult = (result: ItemViewModel) => HtmlFragment;

export const renderSearchResult: RenderSearchResult = (result) => {
  switch (result._tag) {
    case 'Article':
      return renderArticleActivity(result);
    case 'Group':
      return renderGroupSearchResult(result);
  }
};

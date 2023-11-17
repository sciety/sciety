import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model.js';
import { Dependencies } from '../dependencies.js';
import { GroupId } from '../../../types/group-id.js';
import { HtmlFragment } from '../../../types/html-fragment.js';
import { ArticleId } from '../../../types/article-id.js';

export type CurationStatement = {
  articleId: ArticleId,
  groupId: GroupId,
  quote: HtmlFragment,
  articleTitle: HtmlFragment,
};

export const constructCurationTeaser = (dependencies: Dependencies) => (curationStatement: CurationStatement): ViewModel['curationTeasers'][number] => pipe(
  curationStatement.groupId,
  dependencies.getGroup,
  O.match(
    () => {
      dependencies.logger('error', 'Group missing from readmodel', { groupId: curationStatement.groupId });
      return 'Curated by unknown';
    },
    (group) => `Curated by ${group.name}`,
  ),
  (caption) => ({
    ...curationStatement,
    caption,
    articleHref: `/articles/${curationStatement.articleId.value}`,
  }),
);

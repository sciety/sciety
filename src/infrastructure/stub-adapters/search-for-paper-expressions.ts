import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { ArticleId } from '../../types/article-id';
import { ExternalQueries } from '../../third-parties';

export const searchForPaperExpressions: ExternalQueries['searchForPaperExpressions'] = () => () => TE.right({
  items: [
    new ArticleId('10.1101/2022.12.15.520598'),
    new ArticleId('10.1101/123457'),
  ],
  total: 2,
  nextCursor: O.none,
});

import * as TE from 'fp-ts/TaskEither';
import { ArticleId } from '../../types/article-id';
import { ExternalQueries } from '../../third-parties';

const hardcodedResponse = [
  {
    articleId: new ArticleId('10.1101/2023.03.24.534097'),
  },
  {
    articleId: new ArticleId('10.1101/2023.03.21.533689'),
  },
];

export const fetchRelatedArticles: ExternalQueries['fetchRelatedArticles'] = () => TE.right(hardcodedResponse);

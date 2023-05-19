import * as TE from 'fp-ts/TaskEither';
import { ExternalQueries } from '../../types/external-queries';

export const getArticleSubjectArea: ExternalQueries['getArticleSubjectArea'] = () => TE.right({
  value: 'some biorxiv category',
  server: 'biorxiv' as const,
});

import { Queries } from '../../read-models';
import { ExternalQueries } from '../../third-parties/external-queries';
import { ViewModel } from './view-model';

export type Dependencies = Queries & ExternalQueries;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const constructViewModel = (articleId: string, listId: string, dependencies: Dependencies): ViewModel => ({
  articleId,
  listId,
});

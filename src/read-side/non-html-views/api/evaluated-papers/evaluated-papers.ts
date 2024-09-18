import * as TE from 'fp-ts/TaskEither';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { NonHtmlView } from '../../non-html-view';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const evaluatedPapers = (dependencies: DependenciesForViews): NonHtmlView => () => TE.right({
  state: '',
  mediaType: '',
});

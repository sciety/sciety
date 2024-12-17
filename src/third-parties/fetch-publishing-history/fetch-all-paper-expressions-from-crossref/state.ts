import { CrossrefWork } from './crossref-work';
import { ExpressionDoi } from '../../../types/expression-doi';

export type State = {
  queue: ReadonlyArray<string>,
  collectedWorks: Map<ExpressionDoi, CrossrefWork>,
};

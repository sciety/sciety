import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { EvaluationFetcher } from './fetch-review';
import { toHtmlFragment } from '../types/html-fragment';

export const fetchPrelightsHighlight: EvaluationFetcher = (key: string) => TE.right({
  url: new URL(key),
  fullText: toHtmlFragment('All endothelial roads lead to “Rome”: understanding the cell plasticity of cardiac blood vessels'),
});

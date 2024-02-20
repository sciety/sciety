import { pipe } from 'fp-ts/function';
import { XMLBuilder } from 'fast-xml-parser';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';
import { Evaluation } from '../../types/evaluation';
import { AcmiJats } from './acmi-jats';

const builder = new XMLBuilder();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getEvaluationFullText = (subArticleId: string) => (response: AcmiJats): Evaluation['fullText'] => pipe(
  builder.build(response.article['sub-article'][3].body).toString() as string,
  toHtmlFragment,
  sanitise,
);

import * as TE from 'fp-ts/TaskEither';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type EvaluationContent = TE.TaskEither<RenderPageError, Page>;

export const evaluationContent: EvaluationContent = TE.right({
  title: 'evaluation',
  content: toHtmlFragment('evaluation'),
});

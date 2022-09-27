import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import * as RID from '../types/review-id';

type EvaluationContent = TE.TaskEither<RenderPageError, Page>;

export const paramsCodec = t.type({
  reviewid: RID.reviewIdCodec,
});

type Params = t.TypeOf<typeof paramsCodec>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const evaluationContent = (params: Params): EvaluationContent => TE.right({
  title: 'evaluation',
  content: toHtmlFragment('evaluation'),
});

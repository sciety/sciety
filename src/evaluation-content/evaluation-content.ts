import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import * as RID from '../types/review-id';

type EvaluationContent = TE.TaskEither<RenderPageError, Page>;

export const paramsCodec = t.type({
  reviewid: RID.reviewIdCodec,
});

type FetchReview = (id: RID.ReviewId) => TE.TaskEither<unknown, {
  fullText: HtmlFragment,
  url: URL,
}>;

export type Ports = {
  fetchReview: FetchReview,
};

type Params = t.TypeOf<typeof paramsCodec>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const evaluationContent = (ports: Ports) => (params: Params): EvaluationContent => TE.right({
  title: 'evaluation',
  content: toHtmlFragment('evaluation'),
});

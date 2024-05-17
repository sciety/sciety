import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { Dependencies } from './dependencies';
import { decodeParams } from './filter-by-params';
import { NonHtmlViewError, toNonHtmlViewError } from '../../non-html-view-error';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../../non-html-view-representation';
import { renderDocmap } from '../docmap/render-docmap';

type DocmapIndex = (dependencies: Dependencies) => (query: Record<string, unknown>) => TE.TaskEither<
NonHtmlViewError,
NonHtmlViewRepresentation
>;

export const docmapIndex: DocmapIndex = (dependencies) => (query) => pipe(
  query,
  decodeParams,
  TE.fromEither,
  TE.chain(constructViewModel(dependencies)),
  TE.mapLeft((internalErrorResponse) => toNonHtmlViewError(
    internalErrorResponse.body.error,
    internalErrorResponse.status,
  )),
  TE.map(RA.map(renderDocmap)),
  TE.map((docmaps) => toNonHtmlViewRepresentation({ articles: docmaps }, 'application/ld+json')),
);

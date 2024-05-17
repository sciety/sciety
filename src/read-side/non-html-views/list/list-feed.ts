import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Dependencies, constructViewModel, paramsCodec } from './construct-view-model';
import { renderAsAtom } from './render-as-atom';
import { NonHtmlView } from '../non-html-view';
import { toNonHtmlViewError } from '../non-html-view-error';
import { toNonHtmlViewRepresentation } from '../non-html-view-representation';

export const listFeed = (dependencies: Dependencies): NonHtmlView => (nonHtmlViewParams) => pipe(
  nonHtmlViewParams,
  paramsCodec.decode,
  E.mapLeft(() => StatusCodes.BAD_REQUEST),
  TE.fromEither,
  TE.chain(flow(
    constructViewModel(dependencies),
    TE.mapLeft(() => StatusCodes.SERVICE_UNAVAILABLE),
  )),
  TE.map(renderAsAtom),
  TE.bimap(
    (status) => toNonHtmlViewError(
      'Cannot generate a Atom feed',
      status,
    ),
    (body) => toNonHtmlViewRepresentation(body, 'application/atom+xml'),
  ),
);

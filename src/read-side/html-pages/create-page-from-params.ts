import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { ErrorPageViewModel, toErrorPageViewModel } from './construct-error-page-view-model';
import { ConstructPage } from './construct-page';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';

export const toNotFound = (): ErrorPageViewModel => toErrorPageViewModel({
  type: DE.notFound,
  message: toHtmlFragment('Page not found.'),
});

type ConstructPageFromDecodedParams<P> = (params: P) => ReturnType<ConstructPage>;

export const createPageFromParams = <P>(
  codec: t.Decoder<unknown, P>,
  constructPageFromDecodedParams: ConstructPageFromDecodedParams<P>,
): ConstructPage => (input) => pipe(
    input,
    codec.decode,
    E.mapLeft(toNotFound),
    TE.fromEither,
    TE.chain(constructPageFromDecodedParams),
  );

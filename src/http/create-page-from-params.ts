import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../types/error-page-body-view-model';
import { HtmlPage } from '../html-pages/html-page';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';

const toNotFound = () => toErrorPageBodyViewModel({
  type: DE.notFound,
  message: toHtmlFragment('Page not found'),
});

type GeneratePage<P> = (params: P) => TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

export const createPageFromParams = <P>(
  codec: t.Decoder<unknown, P>,
  generatePage: GeneratePage<P>,
) => (input: unknown): ReturnType<GeneratePage<P>> => pipe(
    input,
    codec.decode,
    E.mapLeft(toNotFound),
    TE.fromEither,
    TE.chain(generatePage),
  );

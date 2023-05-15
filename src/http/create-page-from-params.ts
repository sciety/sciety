import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { RenderPageError } from '../types/render-page-error';
import { Page } from '../types/page';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const toNotFound = () => ({
  type: DE.notFound,
  message: toHtmlFragment('Page not found'),
});

type GeneratePage<P> = (params: P) => TE.TaskEither<RenderPageError, Page>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createPageFromParams = <P>(codec: t.Decoder<unknown, P>, generatePage: GeneratePage<P>) => flow(
  codec.decode,
  E.mapLeft(toNotFound),
  TE.fromEither,
  TE.chain(generatePage),
);

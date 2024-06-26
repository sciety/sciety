import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { Dependencies } from './dependencies';
import { paramsCodec } from './params';
import * as DE from '../../../types/data-error';
import { toHtmlFragment } from '../../../types/html-fragment';
import { constructErrorPageViewModel } from '../construct-error-page-view-model';
import { ConstructPage } from '../construct-page';
import { toHtmlPage } from '../html-page';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const categoryPage = (dependencies: Dependencies): ConstructPage => (input) => pipe(
  input,
  paramsCodec.decode,
  E.mapLeft((errors) => {
    dependencies.logger('warn', 'category-page params codec failed', { errors: formatValidationErrors(errors) });
    return DE.notFound;
  }),
  TE.fromEither,
  TE.mapLeft(constructErrorPageViewModel),
  TE.map(() => toHtmlPage({
    title: 'Category page',
    content: toHtmlFragment('Category page'),
  })),
);

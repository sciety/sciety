import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { constructViewModel } from './construct-view-model';
import { Dependencies } from './dependencies';
import { paramsCodec } from './params';
import { renderAsHtml } from './render-as-html';
import * as DE from '../../../types/data-error';
import { constructErrorPageViewModel } from '../construct-error-page-view-model';
import { ConstructPage } from '../construct-page';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const categoryPage = (dependencies: Dependencies): ConstructPage => (input) => pipe(
  input,
  paramsCodec.decode,
  E.mapLeft((errors) => {
    dependencies.logger('warn', 'category-page params codec failed', { errors: formatValidationErrors(errors) });
    return DE.notFound;
  }),
  E.map(constructViewModel),
  E.mapLeft(constructErrorPageViewModel),
  E.map(renderAsHtml),
  TE.fromEither,
);

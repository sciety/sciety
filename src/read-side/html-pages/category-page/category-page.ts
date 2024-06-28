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

export const categoryPage = (dependencies: Dependencies): ConstructPage => (input) => pipe(
  input,
  paramsCodec.decode,
  E.mapLeft((errors) => {
    dependencies.logger('warn', 'category-page params codec failed', { errors: formatValidationErrors(errors) });
    return DE.notFound;
  }),
  TE.fromEither,
  TE.chain(constructViewModel(dependencies)),
  TE.mapLeft(constructErrorPageViewModel),
  TE.map(renderAsHtml),
);

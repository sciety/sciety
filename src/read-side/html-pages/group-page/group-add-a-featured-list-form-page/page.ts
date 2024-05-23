import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { constructViewModel } from './construct-view-model';
import { Dependencies } from './dependencies';
import { paramsCodec } from './params';
import { renderAsHtml } from './render-as-html';
import { toNotFound } from '../../../../http/create-page-from-params';
import { ConstructPage } from '../../construct-page';

export const page = (
  dependencies: Dependencies,
): ConstructPage => (input) => pipe(
  input,
  paramsCodec.decode,
  E.mapLeft((errors) => {
    dependencies.logger('warn', 'group-add-a-featured-list-form-page params codec failed', { errors: formatValidationErrors(errors) });
    return errors;
  }),
  E.chainW(constructViewModel(dependencies)),
  E.bimap(
    toNotFound,
    renderAsHtml,
  ),
  TE.fromEither,
);

import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { renderAsHtml } from './render-as-html.js';
import { constructViewModel } from './construct-view-model.js';
import * as DE from '../../types/data-error.js';
import { toHtmlFragment } from '../../types/html-fragment.js';
import { paramsCodec } from './params.js';
import { Dependencies } from './dependencies.js';
import { ConstructPage } from '../construct-page.js';
import { toErrorPageBodyViewModel } from '../../types/error-page-body-view-model.js';

export const saveArticleFormPage = (
  dependencies: Dependencies,
): ConstructPage => (
  input,
) => pipe(
  input,
  paramsCodec.decode,
  E.mapLeft((errors) => {
    dependencies.logger('warn', 'saveArticleFormPage params codec failed', { errors: formatValidationErrors(errors) });
    return errors;
  }),
  TE.fromEither,
  TE.chainW(constructViewModel(dependencies)),
  TE.bimap(
    () => toErrorPageBodyViewModel({
      type: DE.unavailable,
      message: toHtmlFragment('Sorry, something went wrong. Please try again later.'),
    }),
    renderAsHtml,
  ),
);

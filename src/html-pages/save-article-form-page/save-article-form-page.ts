import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { renderAsHtml } from './render-as-html';
import { constructViewModel } from './construct-view-model';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { paramsCodec } from './params';
import { Dependencies } from './dependencies';
import { ConstructPage } from '../construct-page';
import { toErrorPageBodyViewModel } from '../../types/error-page-body-view-model';
import { Recovery } from './recovery';

export const saveArticleFormPage = (
  dependencies: Dependencies, recovery: Recovery,
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
    (viewModel) => renderAsHtml(viewModel, recovery),
  ),
);

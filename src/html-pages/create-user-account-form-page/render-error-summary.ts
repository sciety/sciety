import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import * as RA from 'fp-ts/ReadonlyArray';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ValidationRecovery } from '../validation-recovery';

type Viewmodel<T extends Record<string, unknown>> = O.Option<ValidationRecovery<T>>;

export const renderErrorSummary = <T extends Record<string, unknown>>(viewmodel: Viewmodel<T>): HtmlFragment => pipe(
  viewmodel,
  O.map(R.map((r) => r.error)),
  O.map(R.compact),
  O.map(R.toArray),
  O.map(RA.map(([key, error]) => `<li><a href="#${key}">${error}</a></li>`)),
  O.map(RA.match(
    () => '',
    (errors) => `
    <div role='alert' class='error-summary'>
      <h3>There is a problem</h3>
      <ul>
      ${errors.join('\n')}
      </ul>
    </div>
    `,
  )),
  O.getOrElse(() => ''),
  toHtmlFragment,
);

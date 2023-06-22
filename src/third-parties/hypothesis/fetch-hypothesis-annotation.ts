import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { formatValidationErrors } from 'io-ts-reporters';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { Logger } from '../../shared-ports';
import { EvaluationFetcher } from '../fetch-review';
import { Evaluation } from '../../types/evaluation';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';
import { HypothesisAnnotation, hypothesisAnnotation } from './HypothesisAnnotation';
import * as DE from '../../types/data-error';
import { CallXYZ } from '../query-external-service';

const converter = new Remarkable({ html: true }).use(linkify);

export const insertSelectedText = (response: HypothesisAnnotation): string => pipe(
  response.target,
  RA.head,
  O.chain((couldContainSelector) => O.fromNullable(couldContainSelector.selector)),
  O.map(RA.filter((selector): selector is { type: 'TextQuoteSelector', exact: string } => selector.type === 'TextQuoteSelector')),
  O.chain(RA.head),
  O.match(
    () => response.text,
    (textQuoteSelector) => `> ${textQuoteSelector.exact}

${response.text}`,
  ),
);

const toReview = (logger: Logger) => (response: HypothesisAnnotation) => {
  const evaluation: Evaluation = {
    fullText: pipe(
      insertSelectedText(response),
      (text) => converter.render(text),
      toHtmlFragment,
      sanitise,
    ),
    url: new URL(response.links.incontext),
  };
  logger('debug', 'Retrieved evaluation', { ...evaluation, fullText: '[text]' });
  return evaluation;
};

export const fetchHypothesisAnnotation = (
  foo: CallXYZ,
  logger: Logger,
): EvaluationFetcher => (key) => pipe(
  `https://api.hypothes.is/api/annotations/${key}`,
  foo(),
  TE.chainEitherKW(flow(
    hypothesisAnnotation.decode,
    E.mapLeft(formatValidationErrors),
    E.mapLeft((errors) => {
      logger('error', 'Invalid response from hypothes.is', { key, errors });
      return DE.unavailable;
    }),
  )),
  TE.map(toReview(logger)),
);

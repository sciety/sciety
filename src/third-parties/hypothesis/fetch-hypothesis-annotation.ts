import { URL } from 'url';
import axios from 'axios';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { formatValidationErrors } from 'io-ts-reporters';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { hypothesisAnnotation, HypothesisAnnotation } from '../../infrastructure/codecs/HypothesisAnnotation';
import { EvaluationFetcher } from '../fetch-review';
import { Logger } from '../../infrastructure/logger';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { Evaluation } from '../../types/evaluation';
import { GetJson } from '../../shared-ports';

const converter = new Remarkable({ html: true }).use(linkify);

const logAndTransformToDataError = (logger: Logger, url: string) => (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 404) {
    logger('warn', 'Missing hypothesis annotation', { error });
    return DE.notFound;
  }
  if (axios.isAxiosError(error)) {
    logger('error', 'Failed to fetch hypothesis evaluation', { error });
  } else {
    logger('error', 'Failed to fetch hypothesis evaluation', { url, error });
  }
  return DE.unavailable;
};

// ts-unused-exports:disable-next-line
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
    ),
    url: new URL(response.links.incontext),
  };
  logger('debug', 'Retrieved evaluation', { ...evaluation, fullText: '[text]' });
  return evaluation;
};

export const fetchHypothesisAnnotation = (getJson: GetJson, logger: Logger): EvaluationFetcher => (key) => {
  const url = `https://api.hypothes.is/api/annotations/${key}`;
  logger('debug', 'Fetching evaluation from Hypothesis', { url });
  return pipe(
    TE.tryCatch(
      async () => getJson(url),
      logAndTransformToDataError(logger, url),
    ),
    TE.chainEitherKW(flow(
      hypothesisAnnotation.decode,
      E.mapLeft(formatValidationErrors),
      E.mapLeft((errors) => {
        logger('error', 'Invalid response from hypothes.is', { url, errors });
        return DE.unavailable;
      }),
    )),
    TE.map(toReview(logger)),
  );
};

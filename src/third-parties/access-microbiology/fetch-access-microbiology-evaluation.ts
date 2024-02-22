import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { Logger } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { EvaluationFetcher } from '../evaluation-fetcher';
import { QueryExternalService } from '../query-external-service';
import * as AED from './acmi-evaluation-doi';
import { toFullTextsOfEvaluations } from './to-full-texts-of-evaluations';

export const fetchAccessMicrobiologyEvaluation = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationFetcher => (key: string) => {
  logger('debug', 'calling fetchAccessMicrobiology', { key });
  if (key === '10.1099/acmi.0.000530.v1.3') {
    return pipe(
      'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000530.v1/acmi.0.000530.v1.xml',
      queryExternalService(),
      TE.chainEitherK(toFullTextsOfEvaluations),
      TE.chainEitherKW((fullTexts) => pipe(
        fullTexts.get(AED.fromValidatedString(key)),
        (fullText) => (fullText !== undefined ? E.right(fullText) : E.left(DE.notFound)),
      )),
      TE.map((fullText) => ({
        url: new URL(`https://doi.org/${key}`),
        fullText,
      })),
    );
  }
  if (key === '10.1099/acmi.0.000569.v1.4') {
    return pipe(
      'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000569.v1/acmi.0.000569.v1.xml',
      queryExternalService(),
      TE.chainEitherK(toFullTextsOfEvaluations),
      TE.chainEitherKW((fullTexts) => pipe(
        fullTexts.get(AED.fromValidatedString(key)),
        (fullText) => (fullText !== undefined ? E.right(fullText) : E.left(DE.notFound)),
      )),
      TE.map((fullText) => ({
        url: new URL(`https://doi.org/${key}`),
        fullText,
      })),
    );
  }
  return TE.left(DE.unavailable);
};

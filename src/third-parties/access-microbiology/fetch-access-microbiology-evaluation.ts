import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as DE from '../../types/data-error';
import { EvaluationFetcher } from '../evaluation-fetcher';
import { QueryExternalService } from '../query-external-service';
import { deriveFullTextsOfEvaluations, lookupFullText } from './derive-full-texts-of-evaluations';

const toJatsXmlUrlOfPublisher = (key: string) => {
  if (key === '10.1099/acmi.0.000530.v1.3') {
    return O.some('https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000530.v1/acmi.0.000530.v1.xml');
  }
  if (key === '10.1099/acmi.0.000569.v1.4') {
    return O.some('https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000569.v1/acmi.0.000569.v1.xml');
  }
  return O.none;
};

export const fetchAccessMicrobiologyEvaluation = (
  queryExternalService: QueryExternalService,
): EvaluationFetcher => (key: string) => pipe(
  key,
  toJatsXmlUrlOfPublisher,
  TE.fromOption(() => DE.unavailable),
  TE.chain(queryExternalService()),
  TE.chainEitherK(deriveFullTextsOfEvaluations),
  TE.chainEitherKW(lookupFullText(key)),
  TE.map((fullText) => ({
    url: new URL(`https://doi.org/${key}`),
    fullText,
  })),
);

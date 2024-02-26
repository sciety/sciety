import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';
import { EvaluationFetcher } from '../evaluation-fetcher';
import { QueryExternalService } from '../query-external-service';
import { deriveFullTextsOfEvaluations, lookupFullText } from './derive-full-texts-of-evaluations';
import { Logger } from '../../shared-ports';
import { toJatsXmlUrlOfPublisher } from './to-jats-xml-url-of-publisher';
import { acmiEvaluationDoiCodec } from './acmi-evaluation-doi';

export const fetchAccessMicrobiologyEvaluation = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationFetcher => (key: string) => {
  const acmiEvaluationDoi = acmiEvaluationDoiCodec.decode(key);
  if (E.isLeft(acmiEvaluationDoi)) {
    return TE.left(DE.unavailable);
  }
  return pipe(
    acmiEvaluationDoi,
    E.chainOptionK(() => DE.unavailable)(toJatsXmlUrlOfPublisher),
    TE.fromEither,
    TE.chain(queryExternalService()),
    TE.chainEitherK(deriveFullTextsOfEvaluations(logger)),
    TE.chainEitherKW(lookupFullText(acmiEvaluationDoi.right)),
    TE.map((fullText) => ({
      url: new URL(`https://doi.org/${acmiEvaluationDoi.right}`),
      fullText,
    })),
  );
};

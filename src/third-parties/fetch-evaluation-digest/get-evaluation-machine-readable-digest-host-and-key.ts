import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { EvaluationLocator } from '../../types/evaluation-locator';
import * as EL from '../../types/evaluation-locator';

type DigestHost = 'zenodo' | 'access-microbiology' | 'hypothesis' | 'ncrc' | 'prelights' | 'rapid-reviews';

export type DigestHostAndKey = {
  host: DigestHost,
  key: string,
};

const extractHost = (evaluationLocator: EvaluationLocator): O.Option<DigestHost> => {
  const service = EL.service(evaluationLocator);
  const evaluationLocatorKey = EL.key(evaluationLocator);
  switch (service) {
    case 'doi':
      if (evaluationLocatorKey.startsWith('10.5281/')) {
        return O.some('zenodo');
      }
      if (evaluationLocatorKey.startsWith('10.1099/')) {
        return O.some('access-microbiology');
      }
      return O.none;
    case 'rapidreviews':
      return O.some('rapid-reviews');
    default:
      return O.some(service);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getEvaluationMachineReadableDigestHostAndKey = (
  evaluationLocator: EvaluationLocator,
): O.Option<DigestHostAndKey> => pipe(
  evaluationLocator,
  extractHost,
  O.map((host) => ({
    host,
    key: EL.key(evaluationLocator),
  })),
);

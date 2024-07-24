import * as O from 'fp-ts/Option';
import { EvaluationLocator } from '../../types/evaluation-locator';
import * as EL from '../../types/evaluation-locator';

type DigestHost = 'zenodo' | 'access-microbiology' | 'hypothesis' | 'ncrc' | 'prelights' | 'rapidreviews';

export type DigestHostAndKey = {
  host: DigestHost,
  key: string,
};

const extractHost = (evaluationLocator: EvaluationLocator) => {
  const service = EL.service(evaluationLocator);
  switch (service) {
    case 'doi':
      return 'zenodo';
    default:
      return service;
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getEvaluationMachineReadableDigestHostAndKey = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  evaluationLocator: EvaluationLocator,
): O.Option<DigestHostAndKey> => O.some({
  host: extractHost(evaluationLocator),
  key: 'bar',
});

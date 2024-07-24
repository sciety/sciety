import * as O from 'fp-ts/Option';
import { EvaluationLocator } from '../../types/evaluation-locator';

type DigestHost = 'zenodo' | 'access-microbiology' | 'hypothesis' | 'ncrc' | 'prelights' | 'rapidreviews';

export type DigestHostAndKey = {
  host: DigestHost,
  key: string,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getEvaluationMachineReadableDigestHostAndKey = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  evaluationLocator: EvaluationLocator,
): O.Option<DigestHostAndKey> => O.some({
  host: 'access-microbiology',
  key: 'bar',
});

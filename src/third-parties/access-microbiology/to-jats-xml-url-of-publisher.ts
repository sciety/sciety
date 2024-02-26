import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { EvaluationFetcherKey } from './evaluation-fetcher-key';

const deriveExpressionDoiSuffix = (key: EvaluationFetcherKey) => {
  const acmiEvaluationDoiRegex = /^10.1099\/(acmi\.0\.[0-9]{6,}\.v[0-9]+)\.[0-9]+$/;
  return pipe(
    acmiEvaluationDoiRegex.exec(key),
    O.fromNullable,
    O.chain(RA.lookup(1)),
  );
};

export const toJatsXmlUrlOfPublisher = (key: EvaluationFetcherKey): O.Option<string> => pipe(
  key,
  deriveExpressionDoiSuffix,
  O.map((s) => `https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/${s}/${s}.xml`),
);

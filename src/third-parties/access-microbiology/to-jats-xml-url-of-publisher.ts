import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { AcmiEvaluationDoi } from './acmi-evaluation-doi';

const deriveExpressionDoiSuffix = (doi: AcmiEvaluationDoi) => {
  const acmiEvaluationDoiRegex = /^10.1099\/(acmi\.0\.[0-9]{6,}\.v[0-9]+)\.[0-9]+$/;
  return pipe(
    acmiEvaluationDoiRegex.exec(doi),
    O.fromNullable,
    O.chain(RA.lookup(1)),
  );
};

export const toJatsXmlUrlOfPublisher = (key: AcmiEvaluationDoi): O.Option<string> => pipe(
  key,
  deriveExpressionDoiSuffix,
  O.map((s) => `https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/${s}/${s}.xml`),
);

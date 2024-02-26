import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { AcmiEvaluationDoi } from './acmi-evaluation-doi';

const deriveExpressionDoiSuffix = (doi: AcmiEvaluationDoi) => {
  const acmiEvaluationDoiRegex = /^10.1099\/acmi\.0\.[0-9]{6,}\.v[0-9]+\.[0-9]+$/;
  const evaluationDoiSuffix = doi.substring(doi.indexOf('/') + 1);
  const expressionDoiSuffix = evaluationDoiSuffix.substring(0, evaluationDoiSuffix.lastIndexOf('.'));
  if (acmiEvaluationDoiRegex.test(doi)) {
    return O.some(expressionDoiSuffix);
  }
  return O.none;
};

export const toJatsXmlUrlOfPublisher = (key: AcmiEvaluationDoi): O.Option<string> => {
  if (key === '10.1099/acmi.0.000530.v1.3') {
    return O.some('https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000530.v1/acmi.0.000530.v1.xml');
  }
  if (
    key === '10.1099/acmi.0.000569.v1.4'
    || key === '10.1099/acmi.0.000569.v1.5'
    || key === '10.1099/acmi.0.000569.v1.3'
    || key === '10.1099/acmi.0.000569.v1.6') {
    return O.some('https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000569.v1/acmi.0.000569.v1.xml');
  }
  return pipe(
    key,
    deriveExpressionDoiSuffix,
    O.map((s) => `https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/${s}/${s}.xml`),
  );
};

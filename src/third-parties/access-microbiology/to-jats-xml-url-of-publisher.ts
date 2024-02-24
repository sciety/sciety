import * as O from 'fp-ts/Option';
import { AcmiEvaluationDoi } from './acmi-evaluation-doi.js';

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
  return O.none;
};

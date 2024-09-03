import * as O from 'fp-ts/Option';
import { getElement } from '../crossref/get-element';

export const detectUnrecoverableError = (xml: Document): O.Option<string> => {
  const crossrefElement = getElement(xml, 'crossref');
  if (!crossrefElement) {
    return O.some('missing-crossref-xml-element');
  }
  if (getElement(crossrefElement, 'error')) {
    return O.some('contains-error-xml-element');
  }
  return O.none;
};

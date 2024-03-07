import { getElement } from './get-element';

export const containsUnrecoverableError = (xml: Document): boolean => {
  const crossrefElement = getElement(xml, 'crossref');
  if (!crossrefElement) {
    return true;
  }
  if (getElement(crossrefElement, 'error')) {
    return true;
  }
  return false;
};

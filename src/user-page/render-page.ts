import { toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';

export const renderErrorPage = (e: 'not-found' | 'unavailable'): RenderPageError => {
  if (e === 'not-found') {
    return {
      type: 'not-found',
      message: toHtmlFragment('User not found'),
    };
  }
  return {
    type: 'unavailable',
    message: toHtmlFragment('User information unavailable'),
  };
};

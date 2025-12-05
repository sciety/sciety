import { URL } from 'url';

export const isUriFromBiorxivMedrxiv = (uri: string): boolean => {
  try {
    const url = new URL(uri);
    const hostname = url.hostname;
    return hostname === 'biorxiv.org' || hostname === 'medrxiv.org';
  } catch (e) {
    return false;
  }
};

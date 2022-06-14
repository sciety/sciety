import { Lazy } from 'fp-ts/function';

export const notFound = { _type: 'not-found' as const };
export const unavailable = { _type: 'unavailable' as const };

export type DataError = typeof notFound | typeof unavailable;

export const isNotFound = (de: DataError): boolean => de === notFound;

export const isUnavailable = (de: DataError): boolean => de === unavailable;

export const fold = <B>(opts: Record<'notFound' | 'unavailable', Lazy<B>>) => (e: DataError): B => {
  switch (e._type) {
    case 'not-found':
      return opts.notFound();
    case 'unavailable':
      return opts.unavailable();
  }
};

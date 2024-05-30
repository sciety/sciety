import { Lazy } from 'fp-ts/function';

export const notFound = 'not-found' as const;
export const unavailable = 'unavailable' as const;
export const notAuthorised = 'not-authorised' as const;

export type DataError = typeof notFound | typeof unavailable | typeof notAuthorised;

export const isNotFound = (de: DataError): boolean => de === notFound;

export const isUnavailable = (de: DataError): boolean => de === unavailable;

export const isNotAuthorised = (de: DataError): boolean => de === notAuthorised;

export const match = <B>(opts: Record<'notFound' | 'unavailable' | 'notAuthorised', Lazy<B>>) => (e: DataError): B => {
  if (isNotFound(e)) {
    return opts.notFound();
  }
  if (isUnavailable(e)) {
    return opts.unavailable();
  }
  return opts.notAuthorised();
};

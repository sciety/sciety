import { Lazy } from 'fp-ts/function';

export const notFound = 'not-found' as const;
export const unavailable = 'unavailable' as const;

export type DataError = typeof notFound | typeof unavailable;

// ts-unused-exports:disable-next-line
export const isNotFound = (de: DataError): boolean => de === notFound;

// ts-unused-exports:disable-next-line
export const isUnavailable = (de: DataError): boolean => de === unavailable;

export const fold = <B>(opts: Record<'notFound' | 'unavailable', Lazy<B>>) => (e: DataError): B => (
  isNotFound(e) ? opts.notFound() : opts.unavailable()
);

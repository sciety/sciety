import { Lazy } from 'fp-ts/function';

export const notFound = 'not-found';

export type DataError = typeof notFound | 'unavailable';

// ts-unused-exports:disable-next-line
export const isNotFound = (de: DataError): boolean => de === notFound;

export const fold = <B>(opts: Record<'notFound' | 'unavailable', Lazy<B>>) => (e: DataError): B => (
  isNotFound(e) ? opts.notFound() : opts.unavailable()
);

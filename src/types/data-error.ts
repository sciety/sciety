export const notFound = 'not-found';

type DataError = typeof notFound | 'unavailable';

// ts-unused-exports:disable-next-line
export const isNotFound = (de: DataError): boolean => de === notFound;

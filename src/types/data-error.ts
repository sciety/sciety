/* eslint-disable @typescript-eslint/ban-types */
import { Lazy } from 'fp-ts/function';
import { ADT } from 'ts-adt';

export type DataError = ADT<{
  notFound: {},
  unavailable: {},
}>;

type DataErrorTypes = DataError['_type'];

const create = (type: DataErrorTypes): DataError => ({ _type: type });

export const notFound = create('notFound');
export const unavailable = create('unavailable');

export const isNotFound = (de: DataError): boolean => de === notFound;
export const isUnavailable = (de: DataError): boolean => de === unavailable;

export const fold = <B>(opts: Record<'notFound' | 'unavailable', Lazy<B>>) => (e: DataError): B => {
  switch (e._type) {
    case 'notFound':
      return opts.notFound();
    case 'unavailable':
      return opts.unavailable();
  }
};

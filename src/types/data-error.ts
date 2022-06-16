/* eslint-disable @typescript-eslint/ban-types */
import { ADT } from 'ts-adt';

export type DataError = ADT<{
  notFound: { message?: string },
  unavailable: { message?: string },
  badRequest: { message?: string },
}>;

type DataErrorTypes = DataError['_type'];

export const create = (type: DataErrorTypes, message?: string): DataError => ({ _type: type, message });

export const notFound = create('notFound');
export const unavailable = create('unavailable');
export const badRequest = create('badRequest');

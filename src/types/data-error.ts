/* eslint-disable @typescript-eslint/ban-types */
import { ADT } from 'ts-adt';

export type DataError = ADT<{
  notFound: {},
  unavailable: {},
}>;

type DataErrorTypes = DataError['_type'];

const create = (type: DataErrorTypes): DataError => ({ _type: type });

export const notFound = create('notFound');
export const unavailable = create('unavailable');

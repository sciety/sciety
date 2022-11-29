import * as O from 'fp-ts/Option';
import { ReadModel } from './handle-event';
import { GetList } from '../../shared-ports';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getList = (readModel: ReadModel): GetList => () => O.none;

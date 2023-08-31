import { Json } from 'fp-ts/Json';
import { ReadModel } from './handle-event';

export const followingsStatus = (readmodel: ReadModel) => (): Json => ({
  total: Object.values(readmodel).length,
});

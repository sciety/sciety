import { Json } from 'fp-ts/Json';
import { ReadModel } from './handle-event.js';

export const followingsStatus = (readmodel: ReadModel) => (): Json => ({
  total: Object.values(readmodel).length,
});

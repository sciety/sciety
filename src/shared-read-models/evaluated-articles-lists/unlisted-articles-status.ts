import { Json } from 'fp-ts/Json';
import { ReadModel } from './handle-event';

export const unlistedArticlesStatus = (readmodel: ReadModel) => (): Json => ({
  total: Object.values(readmodel).length,
});

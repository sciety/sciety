import { Json } from 'fp-ts/Json';

export type GetJson = (uri: string) => Promise<Json>;

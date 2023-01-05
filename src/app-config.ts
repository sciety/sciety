import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { levelNameCodec } from './infrastructure/logger';

export const appConfigCodec = t.type({
  PRETTY_LOG: tt.withFallback(tt.BooleanFromString, false),
  LOG_LEVEL: tt.withFallback(levelNameCodec, 'debug'),
  CROSSREF_API_BEARER_TOKEN: tt.optionFromNullable(t.string),
  TWITTER_API_BEARER_TOKEN: tt.withFallback(t.string, ''),
  PGUSER: t.string,
  PGHOST: t.string,
  PGPASSWORD: t.string,
  PGDATABASE: t.string,
});

export type AppConfig = t.TypeOf<typeof appConfigCodec>;

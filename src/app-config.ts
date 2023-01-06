import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { strategyCodec } from './http/authentication/login-middlewares';
import { levelNameCodec } from './infrastructure/logger';

export const appConfigCodec = t.type({
  PRETTY_LOG: tt.withFallback(tt.BooleanFromString, false),
  LOG_LEVEL: tt.withFallback(levelNameCodec, 'debug'),

  APP_ORIGIN: t.string,
  APP_SECRET: tt.withFallback(t.string, 'this-is-not-secret'),
  ALLOW_SITE_CRAWLERS: tt.withFallback(tt.BooleanFromString, false),
  SCIETY_TEAM_API_BEARER_TOKEN: tt.NonEmptyString,

  CROSSREF_API_BEARER_TOKEN: tt.optionFromNullable(t.string),
  TWITTER_API_BEARER_TOKEN: tt.withFallback(t.string, ''),

  PGUSER: t.string,
  PGHOST: t.string,
  PGPASSWORD: t.string,
  PGDATABASE: t.string,

  AUTHENTICATION_STRATEGY: tt.withFallback(strategyCodec, 'twitter'),
  USE_STUB_ADAPTERS: tt.withFallback(tt.BooleanFromString, false),
});

export type AppConfig = t.TypeOf<typeof appConfigCodec>;

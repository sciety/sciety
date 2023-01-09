import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { strategyCodec } from './http/authentication/login-middlewares';
import { CacheStrategyCodec } from './infrastructure/get-cached-axios-request';
import { levelNameCodec } from './infrastructure/logger';

export const appConfigCodec = t.type({
  // Logging
  PRETTY_LOG: tt.withFallback(tt.BooleanFromString, false),
  LOG_LEVEL: tt.withFallback(levelNameCodec, 'debug'),

  // Sciety Application
  APP_ORIGIN: tt.NonEmptyString,
  APP_SECRET: tt.NonEmptyString,
  APP_CACHE: tt.withFallback(CacheStrategyCodec, 'memory'),
  ALLOW_SITE_CRAWLERS: tt.withFallback(tt.BooleanFromString, false),
  SCIETY_TEAM_API_BEARER_TOKEN: tt.NonEmptyString,
  USE_STUB_ADAPTERS: tt.withFallback(tt.BooleanFromString, false),

  // Access to third parties
  CROSSREF_API_BEARER_TOKEN: tt.optionFromNullable(t.string),
  TWITTER_API_BEARER_TOKEN: tt.NonEmptyString,

  // Persistence of events
  PGUSER: tt.NonEmptyString,
  PGHOST: tt.NonEmptyString,
  PGPASSWORD: tt.NonEmptyString,
  PGDATABASE: tt.NonEmptyString,

  // User authentication
  AUTHENTICATION_STRATEGY: tt.withFallback(strategyCodec, 'twitter'),
  TWITTER_API_KEY: tt.NonEmptyString,
  TWITTER_API_SECRET_KEY: tt.NonEmptyString,
});

export type AppConfig = t.TypeOf<typeof appConfigCodec>;

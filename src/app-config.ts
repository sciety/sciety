import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { strategyCodec } from './http/authentication/login-middlewares';
import { CacheStrategyCodec } from './infrastructure/get-cached-axios-request';
import { levelNameCodec } from './infrastructure/logger';

const withDefaultIfEmpty = <C extends t.Any>(
  codec: C,
  ifEmpty: t.TypeOf<C>,
) => tt.withValidate(
    codec,
    (input, context) => pipe(
      tt.NonEmptyString.validate(input, context),
      E.orElse(() => t.success(String(ifEmpty))),
      E.chain((nonEmptyString) => codec.validate(nonEmptyString, context)),
    ),
  );

export const appConfigCodec = t.strict({
  // Logging
  PRETTY_LOG: withDefaultIfEmpty(tt.BooleanFromString, false),
  LOG_LEVEL: withDefaultIfEmpty(levelNameCodec, 'debug'),

  // Sciety Application
  APP_ORIGIN: tt.NonEmptyString,
  APP_SECRET: tt.NonEmptyString,
  APP_CACHE: withDefaultIfEmpty(CacheStrategyCodec, 'memory'),
  ALLOW_SITE_CRAWLERS: withDefaultIfEmpty(tt.BooleanFromString, false),
  SCIETY_TEAM_API_BEARER_TOKEN: tt.NonEmptyString,
  USE_STUB_ADAPTERS: withDefaultIfEmpty(tt.BooleanFromString, false),

  // Access to third parties
  CROSSREF_API_BEARER_TOKEN: tt.optionFromNullable(t.string),
  TWITTER_API_BEARER_TOKEN: tt.NonEmptyString,

  // Persistence of events
  PGUSER: tt.NonEmptyString,
  PGHOST: tt.NonEmptyString,
  PGPASSWORD: tt.NonEmptyString,
  PGDATABASE: tt.NonEmptyString,

  // User authentication
  AUTHENTICATION_STRATEGY: withDefaultIfEmpty(strategyCodec, 'twitter'),
  TWITTER_API_KEY: tt.NonEmptyString,
  TWITTER_API_SECRET_KEY: tt.NonEmptyString,
});

export type AppConfig = t.TypeOf<typeof appConfigCodec>;

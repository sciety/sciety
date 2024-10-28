import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';

const withDefaultIfEmpty = <C extends t.Any>(
  codec: C,
  ifEmpty: t.TypeOf<C>,
) => tt.withValidate(codec, (input, context) => pipe(
    tt.NonEmptyString.validate(input, context),
    E.orElse(() => t.success(String(ifEmpty))),
    E.chain((nonEmptyString) => codec.validate(nonEmptyString, context)),
  ));

export const environmentVariablesCodec = t.type({
  APP_ORIGIN: tt.NonEmptyString,
  SCIETY_TEAM_API_BEARER_TOKEN: tt.NonEmptyString,
  COAR_NOTIFICATION_DELIVERY_ENABLED: withDefaultIfEmpty(tt.BooleanFromString, false),
});

export type EnvironmentVariables = t.TypeOf<typeof environmentVariablesCodec>;

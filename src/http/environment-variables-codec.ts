import * as t from 'io-ts';
import * as tt from 'io-ts-types';

export const environmentVariablesCodec = t.type({
  APP_ORIGIN: tt.NonEmptyString,
  SCIETY_TEAM_API_BEARER_TOKEN: tt.NonEmptyString,
});

export type EnvironmentVariables = t.TypeOf<typeof environmentVariablesCodec>;

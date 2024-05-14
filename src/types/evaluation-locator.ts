import * as E from 'fp-ts/Either';
import * as Eq from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as t from 'io-ts';

export type EvaluationLocator = string & { readonly EvaluationLocator: unique symbol };

const extractService = (candidate: string) => {
  const [, service] = /^(.+?):(.+)$/.exec(candidate) ?? [];
  return service;
};

const supportedServices = ['doi', 'hypothesis', 'ncrc', 'prelights', 'rapidreviews'] as const;

type EvaluationLocatorService = typeof supportedServices[number];

const isEvaluationLocator = (candidate: unknown): candidate is EvaluationLocator => (
  typeof candidate === 'string' && (supportedServices as ReadonlyArray<string>).includes(extractService(candidate))
);

export const toEvaluationLocator = (serialization: string): EvaluationLocator => {
  if (isEvaluationLocator(serialization)) {
    return serialization as unknown as EvaluationLocator;
  }

  throw new Error(`Unable to unserialize EvaluationLocator: "${serialization}"`);
};

export const deserialize = (value: string): O.Option<EvaluationLocator> => O.tryCatch(() => toEvaluationLocator(value));

export const serialize = (id: EvaluationLocator): string => id;

export const service = (id: EvaluationLocator): EvaluationLocatorService => id.split(':')[0] as EvaluationLocatorService;

export const key = (id: EvaluationLocator): string => id.slice(id.indexOf(':') + 1);

const eq: Eq.Eq<EvaluationLocator> = pipe(
  S.Eq,
  Eq.contramap(serialize),
);

export const { equals } = eq;

export const evaluationLocatorCodec = new t.Type(
  'evaluationLocatorCodec',
  isEvaluationLocator,
  (input, context) => pipe(
    t.string.validate(input, context),
    E.chain(flow(
      deserialize,
      O.match(
        () => t.failure(input, context),
        t.success,
      ),
    )),
  ),
  serialize,
);

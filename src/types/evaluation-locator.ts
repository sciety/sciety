import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as Eq from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { flow, pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as t from 'io-ts';

export type EvaluationLocator = string & { readonly EvaluationLocator: unique symbol };

const extractService = (candidate: string) => {
  const [, service] = /^(.+?):(.+)$/.exec(candidate) ?? [];
  return service;
};

const supportedServices = ['doi', 'hypothesis', 'ncrc', 'prelights', 'rapidreviews'];

const isEvaluationLocator = (candidate: unknown): candidate is EvaluationLocator => (
  typeof candidate === 'string' && supportedServices.includes(extractService(candidate))
);

export const toEvaluationLocator = (serialization: string): EvaluationLocator => {
  if (isEvaluationLocator(serialization)) {
    return serialization as unknown as EvaluationLocator;
  }

  throw new Error(`Unable to unserialize EvaluationLocator: "${serialization}"`);
};

export const deserialize = (value: string): O.Option<EvaluationLocator> => O.tryCatch(() => toEvaluationLocator(value));

export const serialize = (id: EvaluationLocator): string => id;

export const service = (id: EvaluationLocator): string => id.split(':')[0];

export const key = (id: EvaluationLocator): string => id.slice(id.indexOf(':') + 1);

const urlTemplates = ({
  doi: (id: EvaluationLocator) => `https://doi.org/${key(id)}`,
  hypothesis: (id: EvaluationLocator) => `https://hypothes.is/a/${key(id)}`,
  prelights: (id: EvaluationLocator) => key(id),
  rapidreviews: (id: EvaluationLocator) => key(id),
});

export const inferredSourceUrl = (id: EvaluationLocator): O.Option<URL> => pipe(
  urlTemplates,
  R.lookup(service(id)),
  O.map((template) => template(id)),
  O.map((u) => new URL(u)),
);

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

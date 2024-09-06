import { serializeError } from 'serialize-error';

export const replacer = (_key: string, value: unknown): unknown => {
  if (_key === 'Authorization' || _key === 'Crossref-Plus-API-Token') {
    return '--redacted--';
  }
  if (value instanceof Error) {
    return serializeError(value);
  }
  if (value instanceof Set) {
    return { _javascript_set: Array.from(value.values()) };
  }
  return value;
};

import { replacer } from './replacer';

export const logCatastrophicFailure = (error: unknown): void => {
  process.stderr.write(`Unable to start:\n${JSON.stringify(error, null, 2)}\n`);
  process.stderr.write(`Error object: ${JSON.stringify(error, replacer, 2)}\n`);
};

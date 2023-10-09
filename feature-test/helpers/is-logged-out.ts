import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { $ } from 'taiko';

export const isLoggedOut = async (): Promise<boolean> => {
  const links = await pipe(
    async () => $('.utility-bar a').elements(),
    T.chain(T.traverseArray((element) => async () => element.text())),
  )();
  return links.includes('Log In');
};

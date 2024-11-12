import { URL } from 'url';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../src/types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../src/types/sanitised-html-fragment';

export const arbitraryNumber = (min: number, max: number): number => (
  Math.floor(Math.random() * (max - min + 1) + min)
);

export const arbitraryWord = (length: number = arbitraryNumber(3, 15)): string => (
  [...Array(length)]
    .map(() => Math.random().toString(36)[2])
    .join('')
    .replace(/^[0-9]/, 'x')
    .replace(/0x/, '0y')
);

export const arbitraryString = (): string => pipe(
  [...Array(arbitraryNumber(3, 20))],
  A.map(() => arbitraryNumber(2, 10)),
  A.map((n) => arbitraryWord(n)),
).join(' ');

export const arbitraryHtmlFragment = (): HtmlFragment => pipe(
  arbitraryString(),
  toHtmlFragment,
);

export const arbitrarySanitisedHtmlFragment = (): SanitisedHtmlFragment => pipe(
  arbitraryHtmlFragment(),
  sanitise,
);

export const arbitraryUri = (): string => `http://localhost/${arbitraryWord()}`;

export const arbitraryUrl = (): URL => new URL(arbitraryUri());

export const arbitraryTextLongerThan = (min: number): string => 'xy '.repeat(min);

export const arbitraryDate = (): Date => (
  new Date(`${arbitraryNumber(2000, 2021)}-${arbitraryNumber(1, 12)}-${arbitraryNumber(1, 28)}`)
);

export const arbitraryBoolean = (): boolean => arbitraryNumber(0, 1) === 1;

const shuffle = <T>(originalArray: ReadonlyArray<T>) => {
  const array = Array.from(originalArray);
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  // eslint-disable-next-line no-loops/no-loops
  while (currentIndex !== 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

export const arbitraryOrderSet = <T>(input: ReadonlyArray<T>): Set<T> => new Set(shuffle(input));

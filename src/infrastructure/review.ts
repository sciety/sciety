import { URL } from 'url';
import { Maybe } from 'true-myth';

export interface Review {
  publicationDate: Maybe<Date>;
  fullText: Maybe<string>;
  url: URL;
}

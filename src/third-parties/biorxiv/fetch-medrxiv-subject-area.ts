import { Json } from 'fp-ts/Json';
import * as TE from 'fp-ts/TaskEither';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';

type GetJson = (url: string, headers: Record<string, string>) => Promise<Json>;

type Ports = {
  getJson: GetJson,
};

type FetchMedrvixSubjectArea = (ports: Ports) => (articleId: Doi) => TE.TaskEither<DE.DataError, string>;

// ts-unused-exports:disable-next-line
export const fetchMedrxivSubjectArea: FetchMedrvixSubjectArea = () => () => TE.left(DE.unavailable);

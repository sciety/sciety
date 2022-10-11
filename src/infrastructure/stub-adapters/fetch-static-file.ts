import * as TE from 'fp-ts/TaskEither';
import { FetchStaticFile } from '../../group-page/about/render-description';

export const fetchStaticFile: FetchStaticFile = () => TE.right('');

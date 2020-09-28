import { Result } from 'true-myth';
import Doi from '../types/doi';

type RenderFeed = (doi: Doi) => Promise<Result<string, never>>;

export default (): RenderFeed => async () => Promise.resolve(Result.ok(''));

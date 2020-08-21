import { promises as fs } from 'fs';
import path from 'path';
import { Logger } from './logger';

export type FetchStaticFile = (filename: string) => Promise<string>;

export default (logger: Logger): FetchStaticFile => (
  async (filename: string): Promise<string> => {
    const fullPath: string = path.resolve(__dirname, '..', '..', 'static', filename);
    logger('debug', 'Fetch static file', { filename, fullPath });
    const text = await fs.readFile(fullPath);
    return text.toString();
  }
);

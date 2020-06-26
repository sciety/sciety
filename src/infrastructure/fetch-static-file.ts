import { promises as fs } from 'fs';
import path from 'path';
import createLogger from '../logger';

export type FetchStaticFile = (filename: string) => Promise<string>;

export default (): FetchStaticFile => (
  async (filename: string): Promise<string> => {
    const log = createLogger('api:fetch-static-file');
    const fullPath: string = path.resolve(__dirname, '..', '..', 'static', filename);
    log(`Fetch static file ${fullPath}`);
    const text = await fs.readFile(fullPath);
    return text.toString();
  }
);

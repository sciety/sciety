import fs from 'fs';
import path from 'path';
import createLogger from '../logger';

export default (filename: string): string => {
  const log = createLogger('api:fetch-static-file');
  const fullPath: string = path.resolve(__dirname, '..', '..', 'static', filename);
  log(`Fetch static file ${fullPath}`);
  const text = fs.readFileSync(fullPath);
  return text.toString();
};

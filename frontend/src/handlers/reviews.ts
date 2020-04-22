import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { CREATED } from 'http-status-codes';

export default (): Handler<HTTPVersion.V1> => (
  (request: IncomingMessage, response: ServerResponse): void => {
    response.writeHead(CREATED);
    response.end('');
  }
);

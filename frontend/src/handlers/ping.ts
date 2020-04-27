import { IncomingMessage, ServerResponse } from 'http';
import { Handler, HTTPVersion } from 'find-my-way';
import { OK } from 'http-status-codes';

export default (): Handler<HTTPVersion.V1> => (
  (request: IncomingMessage, response: ServerResponse): void => {
    response.setHeader('Cache-Control', 'no-store, must-revalidate');
    response.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    response.writeHead(OK);
    response.end('pong');
  }
);

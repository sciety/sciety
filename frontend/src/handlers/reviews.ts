import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { SEE_OTHER } from 'http-status-codes';
import parseBody from 'co-body';

export default (): Handler<HTTPVersion.V1> => (
  async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    const body: { articledoi: string; reviewdoi: string } = await parseBody.form(request);
    response.setHeader('Location', `/articles/${encodeURIComponent(body.articledoi)}`);
    response.writeHead(SEE_OTHER);
    response.end('');
  }
);

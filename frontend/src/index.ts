import http, { IncomingMessage, ServerResponse } from 'http';
import handler from 'serve-handler';

const server = http.createServer(async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
  await handler(request, response, { public: 'static' });
})

server.listen(80, (): void => {
  console.log('Server running');
});

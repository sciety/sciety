import { IncomingMessage, ServerResponse } from 'http';
import handler from 'serve-handler';

export default async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
  await handler(request, response, { public: 'static' });
};

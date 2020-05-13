import { Request, Response } from 'mock-http';
import Koa, { DefaultState, ExtendableContext, ParameterizedContext } from 'koa';

export default <Context extends ExtendableContext = ExtendableContext>
({ request = new Request(), response = new Response() } = {}): ParameterizedContext<DefaultState, Context> => (
  new Koa<DefaultState, Context>().createContext(request, response) as ParameterizedContext<DefaultState, Context>
);

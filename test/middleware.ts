import { ExtendableContext } from 'koa';
import { Middleware } from 'koa-compose';
import createContext from './context';

export default async <CustomT extends ExtendableContext>(
  middleware: Middleware<CustomT>,
  context: CustomT = createContext(),
  next?: Middleware<CustomT>,
): Promise<CustomT> => {
  await middleware(
    context,
    next ? async (): Promise<void> => {
      await next(context, jest.fn());
    } : jest.fn(),
  );

  return context;
};

import { Context, Middleware, Next } from 'koa';
import showdown from 'showdown';

export default (): Middleware => {
  const converter = new showdown.Converter({ noHeaderId: true });
  return async ({ response, state }: Context, next: Next): Promise<void> => {
    const text: string = await state.markdown;
    const html: string = converter.makeHtml(text);
    response.body = `
      <header class="ui basic padded vertical segment">
        <h1 class="ui header">
          About the Untitled Publish&ndash;Review&ndash;Curate Platform
        </h1>
      </header>
      <section class="ui basic vertical segment">
        ${html}
      </section>`;
    await next();
  };
};

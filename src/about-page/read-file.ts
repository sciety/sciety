import { Context, Middleware, Next } from 'koa';

export default (path: string): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    ctx.state.path = path;
    ctx.state.markdown = `
# About the PRC Platform

## Current direction

The desired behaviour change we are currently exploring is that authors will increasingly rely
on the platform for feedback rather than traditional peer review afforded by a journal.
In order to drive this behaviour we assume that we will need to provide the same (and greater)
value to its users that they currently get from journal submission and eventual publication.

To read the full statement see [this Google doc](https://docs.google.com/document/d/1sKjhRy55kLaNv3a4vK1PsEPTFfivKbJRvJPwNx0HOS4/edit?usp=sharing).
`;

    await next();
  }
);

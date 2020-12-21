declare module 'remarkable' {

  export class Remarkable {
    constructor(options: { html: boolean });

    render: (markdown: string) => string;

    use: (plugin: () => void) => this;
  }

}

declare module 'remarkable/linkify' {

  export const linkify: () => void;

}

declare module 'devtools-protocol' {
  export namespace Network {
    export type Cookie = unknown;
  }
}

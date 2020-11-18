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

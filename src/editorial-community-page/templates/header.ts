interface Header {
  name: string;
  description: string;
}

export default (header: Header): string => (`
  <header class="content-header">

    <h1>
      ${header.name}
    </h1>

  </header>

  <section>

    <p>
      ${header.description}
    </p>

  </section>
`);

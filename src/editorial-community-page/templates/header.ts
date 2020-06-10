interface Header {
  name: string;
  logo: string|undefined;
  description: string;
}

export default (header: Header): string => {
  let h1: string;
  if (header.logo !== undefined) {
    h1 = `<img src="${header.logo}" alt="${header.name}" class="ui image">`;
  } else {
    h1 = header.name;
  }
  return `
  <header class="ui padded basic container segment">

    <h1 class="ui header">
      ${h1}
    </h1>

  </header>

  <section>

    ${header.description}

  </section>
  `;
};

interface Header {
  name: string;
  logo?: string;
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
  <header class="ui basic padded vertical segment">

    <h1 class="ui header">
      ${h1}
    </h1>

  </header>

  <section class="ui basic vertical segment">

    ${header.description}

  </section>
  `;
};

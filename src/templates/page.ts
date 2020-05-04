export default (main: string): string => (
  `<!doctype html>

<meta charset="utf-8">

<meta name="viewport" content="width=device-width, initial-scale=1">
  
<title>
  PRC
</title>

<link rel="stylesheet" href="/static/style.css">

<header>

  <nav>

    <ul>

      <li>
        <a href="/">Home</a>
      </li>

    </ul>

  </nav>

</header>

<main>
  ${main}
</main>`
);

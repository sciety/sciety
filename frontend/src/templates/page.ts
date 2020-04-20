export default (main: string): string => (
  `<!doctype html>

<meta charset="utf-8">

<title>
  PRC
</title>

<link rel="stylesheet" href="style.css">

<header>

  <nav>

    <ul>

      <li>
        <a href="./">Home</a>
      </li>

    </ul>

  </nav>

</header>

${main}`
);

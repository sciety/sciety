import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';
import templatePage from '../templates/page';

export default (): Handler<HTTPVersion.V1> => {
  const page = templatePage(`<main>

  <header>

    <h1>
      PRC
    </h1>

  </header>

  <section>

    <h2>
      Add a review
    </h2>

    <form method="get" action="article1">

      <label>
        DOI of the review
        <input type="text" name="doi">
      </label>

      <input type="submit" value="Add review">

    </form>

  </section>

</main>`);

  return (request: IncomingMessage, response: ServerResponse): void => {
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    response.writeHead(OK);
    response.end(page);
  };
};

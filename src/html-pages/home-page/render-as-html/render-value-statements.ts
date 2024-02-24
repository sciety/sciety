import { toHtmlFragment } from '../../../types/html-fragment.js';

export const renderValueStatements = toHtmlFragment(`
    <section class="home-page-value-statements-wrapper">
      <div class="home-page-value-statements">
        <h2 class="home-page-value-statements__title">How does Sciety work?</h2>
        <article class="home-page-value-statement">
            <div class="home-page-value-statement__copy">
                <h3 class="home-page-value-statement__heading">Explore preprints, reviews and recommendations</h3>
                <p>Sciety brings together groups of researchers who are evaluating and curating the preprints they find interesting or important in a central place.</p>
            </div>
            <img src="/static/images/home-page/value-statements/illustration-1.svg" alt="" class="home-page-value-statement__image">
        </article>
        <article class="home-page-value-statement home-page-value-statement--reverse-order">
            <div class="home-page-value-statement__copy">
                <h3 class="home-page-value-statement__heading">Discover the next advancement in your field</h3>
                <p>Search and sort through the vast preprint literature and find relevant and impactful studies in your area of expertise, alongside evaluations from trusted experts.</p>
            </div>
            <img src="/static/images/home-page/value-statements/illustration-2.svg" alt="" class="home-page-value-statement__image">
        </article>
        <article class="home-page-value-statement">
            <div class="home-page-value-statement__copy">
                <h3 class="home-page-value-statement__heading">Organise and share what you are reading</h3>
                <p>Create lists of the preprints you find interesting that you can return to in the future or share with your research community.</p>
            </div>
            <img src="/static/images/home-page/value-statements/illustration-3.svg" alt="" class="home-page-value-statement__image">
        </article>
        </div>
    </section>
  `);

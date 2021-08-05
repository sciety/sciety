export const hardcodedNcrcArticle = {
  '@context': {
    dcterms: 'http://purl.org/dc/terms/',
    foaf: 'http://xmlns.com/foaf/0.1/',
    cnt: 'http://www.w3.org/2011/content#',
    fabio: 'http://purl.org/spar/fabio/',
    frbr: 'http://purl.org/vocab/frbr/core#',
    pso: 'http://purl.org/spar/pso/',
    pwo: 'http://purl.org/spar/pwo/',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
    prism: 'http://prismstandard.org/namespaces/basic/2.0/',
    pro: 'http://purl.org/spar/pro/',
    prov: 'https://www.w3.org/TR/prov-o/',
    taskex: 'http://www.ontologydesignpatterns.org/cp/owl/taskexecution.owl#',
    ti: 'http://www.ontologydesignpatterns.org/cp/owl/timeinterval.owl#',
    id: '@id',
    type: '@type',
    docmap: 'pwo:Workflow',
    created: {
      '@id': 'dcterms:created',
      '@type': 'xsd:date',
    },
    description: 'dcterms:description',
    title: {
      '@id': 'dcterms:title',
      '@container': '@language',
    },
    doi: 'prism:doi',
    creator: {
      '@id': 'dcterms:creator',
      '@container': '@set',
      '@type': '@id',
    },
    published: {
      '@id': 'prism:publicationDate',
      '@type': 'xsd:date',
    },
    name: 'foaf:name',
    person: 'foaf:Person',
    publisher: {
      '@id': 'dcterms:publisher',
      '@type': 'foaf:organization',
    },
    logo: 'foaf:logo',
    homepage: 'foaf:homepage',
    account: 'foaf:onlineAccount',
    service: 'foaf:accountServiceHomepage',
    process: 'prov:process',
    provenance: 'dcterms:provenance',
    inputs: {
      '@id': 'pwo:needs',
      '@container': '@set',
      '@type': '@id',
    },
    outputs: {
      '@id': 'pwo:produces',
      '@container': '@set',
      '@type': '@id',
    },
    assertions: {
      '@id': 'pso:resultsInAcquiring',
      '@container': '@set',
      '@type': '@id',
      '@context': {
        item: {
          '@id': 'pso:isStatusHeldBy',
          '@type': '@id',
        },
        status: {
          '@id': 'pso:withStatus',
          '@type': '@vocab',
          '@context': {
            '@vocab': 'http://purl.org/spar/pso/',
          },
        },
      },
    },
    steps: {
      '@id': 'pwo:hasStep',
      '@container': [
        '@id',
      ],
    },
    'first-step': {
      '@id': 'pwo:hasFirstStep',
      '@type': '@id',
    },
    'next-step': {
      '@id': 'pwo:hasNextStep',
      '@type': '@id',
    },
    'previous-step': {
      '@id': 'pwo:hasPreviousStep',
      '@type': '@id',
    },
    content: {
      '@id': 'fabio:hasManifestation',
      '@type': '@id',
      '@container': '@set',
    },
    url: {
      '@id': 'fabio:hasURL',
      '@type': 'xsd:anyURI',
    },
    'review-article': 'fabio:ReviewArticle',
    'web-page': 'fabio:WebPage',
    participants: {
      '@id': 'pro:isDocumentContextFor',
      '@container': '@set',
      '@type': '@id',
    },
    role: {
      '@id': 'pro:withRole',
      '@type': '@vocab',
      '@context': {
        '@vocab': 'http://purl.org/spar/pro/',
      },
    },
    actor: {
      '@id': 'pro:isHeldBy',
      '@type': '@id',
    },
    email: 'fabio:Email',
    file: {
      '@id': 'fabio:DigitalManifestation',
      '@context': {
        text: 'cnt:chars',
      },
    },
    letter: 'fabio:Letter',
    manuscript: 'fabio:Manuscript',
    format: {
      '@id': 'dcterms:format',
      '@type': '@vocab',
      '@context': {
        '@vocab': 'https://w3id.org/spar/mediatype/',
      },
    },
    includes: 'frbr:part',
    actions: {
      '@id': 'taskex:isExecutedIn',
      '@container': '@set',
      '@type': '@id',
    },
    happened: {
      '@id': 'pwo:happened',
      '@type': '@id',
    },
    'at-date': {
      '@id': 'ti:hasIntervalDate',
      '@type': 'xsd:date',
    },
    'realization-of': {
      '@id': 'frbr:realizationOf',
      '@type': '@id',
    },
    reply: 'fabio:Reply',
    comment: 'fabio:Comment',
    editorial: 'fabio:Editorial',
  },
  id: 'http://example.com/docmap/456',
  type: 'docmap',
  created: '2021-04-23',
  publisher: {
    id: 'https://ncrc.jhsph.edu/',
    logo: 'https://sciety.org/static/groups/ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg',
    homepage: 'https://ncrc.jhsph.edu/',
    account: {
      id: 'https://sciety.org/groups/62f9b0d0-8d43-4766-a52a-ce02af61bc6a',
      service: 'https://sciety.org',
    },
  },
  'first-step': '_:b0',
  steps: {
    '_:b0': {
      assertions: [
        {
          item: 'http://ec2-18-234-60-140.compute-1.amazonaws.com:8080/10.1101/2021.04.06.21254882v2',
          status: 'reviewed',
        },
      ],
      inputs: [
        'http://ec2-18-234-60-140.compute-1.amazonaws.com:8080/10.1101/2021.04.06.21254882v2',
      ],
      actions: [
        {
          participants: [
            {
              actor: {
                type: 'person',
                name: 'Andrew Redd',
              },
              role: 'peer-reviewer',
            },
          ],
          outputs: [
            {
              type: 'review-article',
              published: '2021-04-23',
              content: [
                {
                  type: 'web-page',
                  url: 'https://ncrc.jhsph.edu/research/evidence-for-increased-breakthrough-rates-of-sars-cov-2-variants-of-concern-in-bnt162b2-mrna-vaccinated-individuals/',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2020.11.09.374330#ncrc:c0e4f483-eb58-4c13-b475-66c3d86fb430',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

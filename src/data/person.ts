/** Shared Person facts for JSON-LD and llms.txt alignment. */
export const siteUrl = 'https://usmanramzan.com';

export const person = {
  name: 'Muhammad Usman Ramzan',
  alternateName: 'Usman Ramzan',
  jobTitle: 'Chief Technology Officer',
  description:
    'CTO and fractional CTO. Seven years running multi-cloud Kubernetes platforms for companies where downtime is not an option.',
  email: 'mailto:usman.ramzan0505@gmail.com',
  url: siteUrl,
  image: `${siteUrl}/usman-portrait.jpg`,
  sameAs: [
    'https://www.linkedin.com/in/usman-ramzan',
    'https://github.com/usmanramzan',
    siteUrl,
  ],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'FAST-NUCES',
    alternateName: 'National University of Computer and Emerging Sciences',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lahore',
    addressCountry: 'PK',
  },
} as const;

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: person.name,
    alternateName: person.alternateName,
    jobTitle: person.jobTitle,
    description: person.description,
    url: person.url,
    image: person.image,
    email: person.email,
    sameAs: [...person.sameAs],
    alumniOf: person.alumniOf,
    address: person.address,
    knowsAbout: [
      'Kubernetes',
      'multi-cloud infrastructure',
      'fractional CTO',
      'platform engineering',
      'SOC 2',
      'cost optimization',
    ],
  };
}

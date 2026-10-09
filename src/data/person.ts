/** Shared Person facts for JSON-LD and llms.txt alignment. */
import { consulting } from './consulting';

export const siteUrl = 'https://usmanramzan.com';

export const person = {
  name: 'Muhammad Usman Ramzan',
  alternateName: 'Usman Ramzan',
  jobTitle: 'Chief Technology Officer',
  description:
    'Fractional CTO, DevOps and AI-agent consultant working with B2B SaaS teams through URN Labs.',
  email: `mailto:${consulting.email}`,
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
    affiliation: { '@type': 'Organization', '@id': `${consulting.brandUrl}#organization`, name: 'URN Labs', url: consulting.brandUrl },
    alumniOf: person.alumniOf,
    address: person.address,
    knowsAbout: [
      'DevOps consulting',
      'AI-agent engineering',
      'Kubernetes',
      'multi-cloud infrastructure',
      'fractional CTO',
      'platform engineering',
      'SOC 2',
      'cost optimization',
    ],
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${consulting.brandUrl}#organization`,
    name: consulting.brand,
    url: consulting.brandUrl,
    description: consulting.description,
    email: consulting.email,
    contactPoint: { '@type': 'ContactPoint', email: consulting.email, contactType: 'consulting enquiries' },
  };
}

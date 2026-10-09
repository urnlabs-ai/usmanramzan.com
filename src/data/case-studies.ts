export type CaseStudy = {
  slug: string;
  sector: string;
  title: string;
  summary: string;
  problem: string;
  work: string[];
  outcome: string;
  limits: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'healthcare-security-readiness',
    sector: 'Healthcare software',
    title: 'Make security review a path forward',
    summary: 'Turning a stalled enterprise security review into an actionable remediation plan.',
    problem:
      'Enterprise security review was blocking the sales roadmap. A penetration test had left 22 findings, with too little time and context to work through them.',
    work: [
      'Sorted findings by practical risk, then prioritized the issues that mattered most.',
      'Documented why remaining findings were acceptable and assembled evidence around access reviews, usable policies, and logging.',
    ],
    outcome:
      'The team moved from 22 open findings to a clean security position, with evidence for auditor questions and a sales team better prepared for security questionnaires.',
    limits:
      'This engagement covered security remediation and SOC 2 readiness. It is not presented as a completed certification audit.',
  },
  {
    slug: 'travel-knowledge-assistant',
    sector: 'Travel',
    title: 'Build an assistant that can admit uncertainty',
    summary: 'A retrieval-based internal knowledge assistant for a company of about 1,300 people.',
    problem:
      'Staff needed a faster way to find reliable answers in company documents while responding to customer questions. A confident answer based on the wrong visa guidance could be worse than no answer.',
    work: [
      'Built an internal assistant with Azure OpenAI and retrieval augmented generation.',
      'Focused on which documents counted as authoritative, how information was chunked and indexed, and how the assistant should respond when it could not find a reliable answer.',
    ],
    outcome:
      'The result was an internal knowledge assistant designed around the quality and authority of its source material, for a workforce of about 1,300 people.',
    limits:
      'The summary describes the delivered assistant and its design. It does not claim measured answer accuracy, adoption, or time savings.',
  },
  {
    slug: 'manufacturing-data-remediation',
    sector: 'Manufacturing',
    title: 'Get personal data under control',
    summary: 'Practical GDPR remediation through data inventory, deletion, retention, and process.',
    problem:
      'Personal data was spread across systems without a clear record of what existed, where it lived, or why it was being retained.',
    work: [
      'Mapped where personal data was held and removed data without a continuing purpose.',
      'Set retention rules for data that remained and established a repeatable process for data subject requests.',
    ],
    outcome:
      'The engagement replaced an unclear data inventory and ad hoc response with documented locations, retention rules, and a defined request process.',
    limits:
      'The engagement covered data inventory, retention, and request handling. No certification or quantified performance improvement is claimed.',
  },
  {
    slug: 'media-cloud-operations',
    sector: 'Media',
    title: 'Make cloud and GPU spend visible',
    summary: 'Steady AWS and EKS operations, including closer attention to GPU capacity use.',
    problem:
      'The company ran AWS workloads on EKS, including GPU nodes for heavier jobs, and needed clearer cost visibility and more deliberate cluster operations.',
    work: [
      'Worked alongside the infrastructure team on cost visibility and practical cluster operations.',
      'Reviewed whether GPU capacity was being used or sitting idle, using a weekly cadence and small permanent improvements.',
    ],
    outcome:
      'The work established a recurring operating rhythm focused on concrete numbers and incremental improvements instead of a disruptive rewrite.',
    limits:
      'This was ongoing cloud operations work. No specific savings figure or GPU utilization improvement is claimed.',
  },
];

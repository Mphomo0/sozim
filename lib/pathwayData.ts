export type PathwayStep = {
  title: string
  description: string | string[] // Can be a string or a list of bullet points
  requirements?: string
  n_q_f_level?: number | string
}

export type CareerPathway = {
  id: string
  title: string
  n_q_f_level: number | string
  credits: number
  description: string
  steps: PathwayStep[]
  registration?: string[]
}

export const careerPathways: CareerPathway[] = [
  // --- Assessment Practitioner Data ---
  {
    id: 'assessor',
    title: 'Assessment Practitioner (SP-220320)',
    n_q_f_level: 5,
    credits: 20,
    description:
      'An Assessment Practitioner steps into the learning ecosystem as a kind of cartographer, mapping whether learners truly meet the standards required in their field. The journey usually unfolds in stages.',
    steps: [
      {
        title: '1. Entry Into the Field',
        requirements:
          'Matric / NQF Level 4; Occupational or professional experience; Completion of the Assessor Skills Programme (SP-220320)',
        description: [
          'Early role:',
          'Assistant Assessor / Assessment Administrator',
          'Supporting senior assessors, preparing evidence files, recording results',
        ],
      },
      {
        title: '2. Qualified Assessment Practitioner',
        n_q_f_level: 5,
        requirements:
          'Completion of SP-220320 and SETA/Professional Body Registration',
        description: [
          'After completing SP-220320 and registering with the relevant ETDP SETA or professional body, you may perform full assessments.',
          '',
          '<strong>Key Responsibilities:</strong>',
          '• Conduct assessments against unit standards, qualifications, or occupational curricula',
          '• Moderate evidence before submission',
          '• Maintain assessment records',
          '• Ensure fairness, reliability, and consistency in assessments',
          '',
          '<strong>Work Environments:</strong>',
          '• TVET colleges',
          '• Private training providers',
          '• Sector Education and Training Authorities (SETAs)',
          '• Corporate training departments',
        ],
      },
      {
        title: '3. Career Growth Options',
        description: [
          '**A. Moderator (NQF Level 6):** Quality gatekeeper, ensuring assessments are consistent and compliant. (*Req: Moderator Skills Programme*)',
          '**B. Skills Development Facilitator (SDF):** Help organisations plan learning, analyse training needs, and submit Workplace Skills Plans.',
          '**C. Facilitator / Trainer (NQF Level 5):** Guide learning (Facilitator) while measuring it (Assessor).',
          '**D. Quality Assurance (QA) Specialist:** Verify provider assessments, approve accreditation, and monitor compliance.',
          '**E. Learning & Development Manager:** Manage training programmes, employee development, and accreditation compliance.',
          '**F. Curriculum & Learning Material Designer:** Pivot into designing learning programmes, assessment guides, and occupational curricula.',
        ],
      },
      {
        title: '4. Long-Term Trajectory (NQF Level 6–7 and Beyond)',
        description: [
          'ETD Practitioner',
          'Academic Lecturer',
          'Training Centre Manager',
          'QCTO Occupational Qualification Designer',
          'Independent ETD Consultant',
        ],
      },
    ],
    registration: [
      'ETDP SETA (as Assessors or Moderators)',
      'Professional bodies related to their field of expertise',
      'QCTO (for occupational qualifications)',
    ],
  },
  // --- Learning & Development Facilitator Data ---
  {
    id: 'facilitator',
    title: 'Learning & Development Facilitator (SP-220319)',
    n_q_f_level: 5,
    credits: 36,
    description:
      'A Learning & Development Facilitator begins as a guide in the learning landscape—someone who helps others navigate new skills, concepts, and competencies. With time, this role expands into wider realms of education, organisational growth, and strategic development.',
    steps: [
      {
        title: '1. Entry Into the Field',
        requirements:
          'NQF Level 4 (Matric); Subject expertise; Completion of the Learning & Development Facilitator Programme (SP-220319)',
        description: [
          '**Early role:** Facilitation Assistant / Junior Facilitator',
          'Supporting trainers, preparing learning resources, conducting small-group sessions',
        ],
      },
      {
        title: '2. Qualified Learning & Development Facilitator',
        n_q_f_level: 5,
        requirements: 'Completion of SP-220319 and practical experience.',
        description: [
          'Once you have completed SP-220319 and gained practical experience, you can operate independently as a facilitator.',
          '',
          '<strong>Key Responsibilities:</strong>',
          '• Deliver accredited and non-accredited training',
          '• Support learners through guidance, feedback, and development activities',
          '• Apply adult education principles',
          '• Prepare classrooms, learning materials, and training schedules',
          '• Monitor learner progress and provide academic support',
          '• Conduct formative assessments',
          '• Maintain accurate training and learner records',
          '',
          '<strong>Typical Workplaces:</strong>',
          '• TVET colleges',
          '• Private training academies',
          '• Corporate training departments',
          '• SETA-accredited training providers',
          '• NGOs and community-based learning institutions',
        ],
      },
      {
        title: '3. Professional Growth Pathways',
        description: [
          'The career journey widens into several promising directions:',
          '',
          '<strong>A. Assessor (NQF Level 5 – SP-220320)</strong>',
          '• Measure learner competence formally against unit standards, qualifications, and occupational curricula.',
          '',
          '<strong>B. Moderator (NQF Level 6)</strong>',
          '• Verify and quality-check assessment processes to ensure fairness, reliability, and consistency.',
          '',
          '<strong>C. Skills Development Facilitator (SDF)</strong>',
          'For those drawn to organisational planning:',
          '• Workplace Skills Plans',
          '• Annual Training Reports',
          '• Skills audits',
          '• Stakeholder coordination',
          '',
          '<strong>D. Learning Programme Developer / Instructional Designer</strong>',
          'You may create:',
          '• Learning materials',
          '• Curriculum structures',
          '• Assessment guides',
          '• E-learning content',
          'A good fit for facilitators who enjoy designing learning journeys.',
          '',
          '<strong>E. Occupational Trainer / Mentor</strong>',
          '• Specialise in practical, hands-on workplace training and mentoring.',
          '',
          '<strong>F. E-Learning Specialist</strong>',
          'A modern branch of facilitation involving:',
          '• Virtual classrooms',
          '• LMS management',
          '• Online content development',
          '• Digital learning analytics',
        ],
      },
      {
        title: '4. Advanced Career Progression (NQF Level 6–7 and Beyond)',
        description: [
          'With additional qualifications in Education, Training, and Development (ETD), doors open to advanced professional and managerial roles:',
          '',
          '• ETD Practitioner',
          '• Learning & Development Officer',
          '• Learning & Development Specialist',
          '• Training Centre Coordinator / Manager',
          '• Corporate Learning Manager',
          '• Human Resource Development (HRD) Manager',
          '• Education Programme Manager',
          '• QCTO Qualification Developer',
          '• ETD Consultant / Independent Trainer',
        ],
      },
    ],
    registration: [
      'ETDP SETA',
      'Relevant Industry SETAs',
      'QCTO-approved training centres',
      'Professional bodies relevant to their subject field',
    ],
  },
  // --- Library Assistant Data ---
  {
    id: 'library',
    title: 'Library Assistant (Qualification 94598)',
    n_q_f_level: 5,
    credits: 127,
    description:
      'A Library Assistant at NQF Level 5 stands at the threshold of a profession that blends information stewardship, community service, and digital fluency. Below is a developmental pathway that shows how one may progress, level by level, through the library and information services (LIS) ecosystem.',
    steps: [
      {
        title: '1. Entry Point: Library Assistant',
        n_q_f_level: 5,
        description: [
          '<strong>Core Role:</strong>',
          '• Support daily library operations',
          '• Provide customer service and assist with circulation functions',
          '• Perform basic cataloguing and indexing support',
          '• Assist users with information needs and library navigation',
          '',
          '<strong>Competence Gained:</strong>',
          '• Library systems and cataloguing fundamentals',
          '• Customer service in an information environment',
          '• Collection maintenance and materials handling',
          '• Digital literacy and information retrieval',
          '• Ethical handling and management of information',
        ],
      },
      {
        title: '2. Growth Step: Senior Library Assistant / Library Technician',
        n_q_f_level: '5–6',
        description: [
          'As experience accumulates, responsibilities expand and you take on more technical, supervisory, and specialised tasks.',
          '',
          '<strong>Possible Progression:</strong>',
          '• Lead circulation desk operations',
          '• Support cataloguing and classification processes',
          '• Assist with community outreach and library programmes',
          '• Manage stock rotation, shelving teams, and basic acquisitions tasks',
          '',
          '<strong>Typical Additional Learning:</strong>',
          '• National Certificate: Library and Information Services (NQF 5/6)',
          '• Short courses in cataloguing (RDA), KOHA/SLIMS, and digital literacy',
        ],
      },
      {
        title:
          '3. Mid-Level Professional: Library Officer / Assistant Librarian',
        n_q_f_level: 6,
        description: [
          'The role shifts from routine operations into more specialised information work and learner support.',
          '',
          '<strong>Responsibilities:</strong>',
          '• Support collection development activities',
          '• Provide reader advisory services and information literacy training',
          '• Perform advanced cataloguing, metadata creation, and classification tasks',
          '• Supervise junior staff and daily library operations',
          '• Contribute to library programmes, outreach, and user engagement initiatives',
          '',
          '<strong>Recommended Qualifications:</strong>',
          '• Higher Certificate or Diploma in Library and Information Studies (NQF 6)',
        ],
      },
      {
        title: '4. Professional Librarian',
        n_q_f_level: 7,
        description: [
          'At this stage, the practitioner becomes a navigator of knowledge, shaping library services to meet the needs of entire communities.',
          '',
          '<strong>Role Focus:</strong>',
          '• Manage library collections strategically',
          '• Lead library programming, literacy initiatives, and community partnerships',
          '• Provide research and reference support to users',
          '• Develop policies and ensure institutional compliance',
          '• Manage staff, budgets, resources, and library projects',
          '',
          '<strong>Qualification:</strong>',
          '• Bachelor of Library and Information Science (NQF 7)',
        ],
      },
      {
        title: '5. Senior Librarian / Branch Librarian',
        n_q_f_level: 8,
        description: [
          'At this level, the practitioner begins steering the ship—overseeing an entire library branch or major service area.',
          '',
          '<strong>Key Areas:</strong>',
          '• Branch or library management',
          '• Strategic planning and service development',
          '• Advanced research and advisory services',
          '• Leading innovation in user and digital services',
          '• Overseeing community engagement and development projects',
          '',
          '<strong>Qualification:</strong>',
          '• Postgraduate Diploma in Library and Information Science (NQF 8)',
        ],
      },
      {
        title: '6. Specialist or Managerial Pathways',
        n_q_f_level: '8–9',
        description: [
          'At this stage, practitioners may specialise or move into managerial roles, leveraging extensive LIS knowledge and experience.',
          '',
          '<strong>Specialisations may include:</strong>',
          '• Digital curation',
          '• Knowledge management',
          '• Archival science',
          '• Records management',
          '• Information architecture',
          '• Research data management',
          '',
          '<strong>Managerial Roles:</strong>',
          '• Library Manager',
          '• District/Regional Library Coordinator',
          '• Information Centre Manager',
        ],
      },
      {
        title: '7. Executive & Academic Pathways',
        n_q_f_level: '9–10',
        requirements:
          'Master’s Degree in Library and Information Science (NQF 9) or PhD in Information Science (NQF 10)',
        description: [
          'For those who wish to shape the future of the LIS profession:',
          '**Roles:**',
          '- Director of Library Services',
          '- Provincial/National LIS Leader',
          '- Academic Lecturer in Information Science',
          '- Researcher & Policy Specialist',
          '**Qualifications:**',
          '- Master’s Degree in Library and Information Science (NQF 9)',
          '- PhD in Information Science (NQF 10)',
        ],
      },
    ],
    registration: [
      'ETDP SETA',
      'Relevant Industry SETAs',
      'QCTO-approved training centres',
      'Professional bodies relevant to their subject field',
    ],
  },
]

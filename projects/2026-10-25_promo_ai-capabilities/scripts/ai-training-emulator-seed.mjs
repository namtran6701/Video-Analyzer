// Seeds the AI Training Firestore + Auth emulators with the live Q3/Q4 catalog
// (copied read-only from the sf-lesson-mcp connector) and fictional demo people.
import { createRequire } from 'node:module';
const require = createRequire('/Users/trannn23/Documents/SF_Work/AI Training app/package.json');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
const app = initializeApp({ projectId: 'sf-internal-495418' });
const db = getFirestore(app, 'sf-training');
const auth = getAuth(app);

const L = (id, title, track, quarter, type, sortOrder, link, duration) =>
  ({ id, title, track, quarter, type, sortOrder, link, duration });
const lessons = [
  L('StcGt9cIyDsGfqSTkmKS', 'Assignment: Tell Us About Yourself, In a Design System', 'creative', '2026-Q3', 'Assignment', 10, 'https://claude.ai/design', '15-30 min'),
  L('d1XuchcnrryIB8UGZFjh', 'Getting Started with Claude Design', 'creative', '2026-Q3', 'Video', 20, 'https://www.youtube.com/watch?v=CL2_prlfX9w', '15-30 min'),
  L('Rewi0DmtwXqAIAzFMm87', 'Assignment: Bring Your Favorite Thing to Life with Claude Motion', 'creative', '2026-Q4', 'Assignment', 50, 'https://www.youtube.com/watch?v=en0GuyhieQk', '30 minutes'),
  L('OHvPfvbWOSCkTDO0gjs6', 'Assignment: Give Your Favorite Thing a Soundtrack', 'creative', '2026-Q4', 'Assignment', 60, 'http://gemini.google.com/music', '20–30 minutes'),
  L('7T3HbEsHGnhhAGlxUI2x', "Google's Guide to Optimizing for Generative AI Features on Google Search", 'digital', '2026-Q3', 'Article', 70, 'https://developers.google.com/search/docs/fundamentals/ai-optimization-guide', 'Under 15 min'),
  L('4UVWF89i5JV2haJ0fQWl', 'Getting Started with Claude Cowork', 'digital', '2026-Q3', 'Video', 80, 'https://www.youtube.com/watch?v=Lbml7IuGJYw', ''),
  L('hUxppj1NrrsKB9pFHcaK', 'Assignment: Let Claude Do the Reporting Heavy Lifting', 'digital', '2026-Q3', 'Assignment', 90, '', '15-30 min'),
  L('oUcAvQ8g2AcPI6ePueyw', 'When AI Answers First, Will Customers Find Our Clients?', 'digital', '2026-Q4', 'Assignment', 100, 'https://docs.google.com/spreadsheets/d/1SFn4wv0WSYr9K8dUNZ_N7Um7Tlp93prYuvfH4vbubRk/edit?usp=drivesdk', '5 minutes'),
  L('Dtu4kihNKZcNuKLxCg77', 'Using Gemini Deep Research for Emerging Trends', 'foundations', '2026-Q3', 'Assignment', 10, 'https://gemini.google.com', 'Under 15 min'),
  L('Lv9u76Bm0gfcw0nDJ4KV', 'Build a Trend Page with Claude & Sales Factory Design', 'foundations', '2026-Q3', 'Assignment', 20, 'https://drive.google.com/file/d/1swJ3FiUwd8LdpfL6XID6-3uIq4COwN_Q/view?usp=sharing', '15-30 min'),
  L('iFSi0VaOVahrLeKfgovF', 'ClickUp Brain Overview', 'foundations', '2026-Q3', 'Assignment', 30, '', ''),
  L('4zT4LuUNEN1gseHZRqK1', 'Custom GPTs Are Retiring: How to Migrate Yours to Plugins', 'foundations', '2026-Q4', 'Article', 70, 'https://help.openai.com/en/articles/20001519-custom-gpt-retirement-and-migration-faq', 'Under 15 min'),
  L('np56ZJaUuxJzLEmqZVsF', 'How to Use Skills in Claude and ChatGPT', 'foundations', '2026-Q4', 'Assignment', 90, 'https://drive.google.com/file/d/1V43uSnliQBaYeCJpiR4WERfvAISTuYKr/view?usp=drive_link', ''),
  L('GRUKVIECOlImjA4f2gps', 'Skill Authoring Best Practices', 'insights', '2026-Q3', 'Article', 10, 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices', ''),
  L('xGOiXgXHW1trSkyqSARA', 'Getting Started with Claude Cowork', 'insights', '2026-Q3', 'Video', 20, 'https://www.youtube.com/watch?v=Lbml7IuGJYw', ''),
  L('h41OVp2uCnwdfXniX6px', 'How to Visualize Data with AI-Generated Dashboards', 'insights', '2026-Q3', 'Article', 30, 'https://motherduck.com/blog/vibecoding-dashboards-best-practices/', ''),
  L('mH7TBSa3Q9E4eH9m72Dw', 'Download Granola AI', 'marketing strategy', '2026-Q3', 'Tool', 60, 'https://www.granola.ai/', ''),
  L('Mm2CaARu9XpygdII1Jbo', 'Pricing App Tutorial Videos', 'marketing strategy', '2026-Q3', 'Video', 70, 'https://drive.google.com/drive/folders/1hylwsPAvuAx0uBnhd36MY6L6rI2598c7', ''),
  L('TtDeyDFk2jxAfZgUQ98A', 'Convert Your Landing Page to PDF or PowerPoint with Skills', 'marketing strategy', '2026-Q4', 'Assignment', 80, 'https://drive.google.com/file/d/1V43uSnliQBaYeCJpiR4WERfvAISTuYKr/view?usp=drive_link', ''),
  ...[
    ['FKrew5QBX8aUYyBJKovb', 'Paycor Regulatory Forms', '15 min'],
    ['yl9J6DSNRvEs60DAgu2Y', 'Email & Google Workspace Setup', '15-30 min'],
    ['yPbIapJP7R05E2XCcyKA', 'Microsoft & Adobe Account Setup', '15 min'],
    ['O2SM1aIdhc72Bnl1TzPk', 'ClickUp Account Setup & Intro to Software', '30+ min'],
    ['QedUlPAd5nLotNj4Y6Y6', 'Set Up Your Sales Factory Email Signature', '5 min'],
    ['iJqZ8oaWqHI600qt0SpV', 'Set Up Your Employee Bio on the Team Page', '5-10 min'],
    ['Tir5TgbvCTznC5ibscnQ', 'Send a Staff Email to Introduce Yourself', '5 min'],
    ['x0Tgvuw5t2olCehKdPLz', 'Review the Sales Factory Website', '15 min'],
    ['Mfh8pJ3916qggkn04TpF', 'Review & Follow Sales Factory Social Media', '15 min'],
    ['ONAkYv7Y2tVsJ9xTwanv', 'Review the Sales Factory Org Chart', '10 min'],
    ['jq6jQ0aEcpsLkbromXzO', 'Onboarding Resources & Helpful Links', '15-30 min'],
  ].map(([id, title, duration], i) => L(id, title, 'onboarding', '', i === 10 ? 'Resource' : 'Assignment', (i + 1) * 10, '', duration)),
];

// Fictional demo people. uid doubles as a stable id.
const people = [
  ['demo-admin', 'Demo', 'Admin', 'Master Manager', 'foundations', 'master_manager', ''],
  ['demo-ava', 'Ava', 'Carter', 'Designer', 'creative', 'manager', 'creative'],
  ['demo-ben', 'Ben', 'Ortiz', 'Motion Designer', 'creative', 'employee', ''],
  ['demo-cara', 'Cara', 'Nguyen', 'Digital Strategist', 'digital', 'employee', ''],
  ['demo-dev', 'Dev', 'Patel', 'SEO Specialist', 'digital', 'employee', ''],
  ['demo-eli', 'Eli', 'Brooks', 'Insights Analyst', 'insights', 'employee', ''],
  ['demo-fay', 'Fay', 'Kim', 'Data Analyst', 'insights', 'employee', ''],
  ['demo-gus', 'Gus', 'Reyes', 'Account Strategist', 'marketing strategy', 'employee', ''],
  ['demo-hana', 'Hana', 'Lee', 'New Hire', 'onboarding', 'employee', ''],
];
// Share of each person's required Q4 + foundations lessons marked Complete.
const completion = { 'demo-admin': 1, 'demo-ava': 1, 'demo-ben': 0.5, 'demo-cara': 1, 'demo-dev': 0.34, 'demo-eli': 0.75, 'demo-fay': 0.25, 'demo-gus': 0.67, 'demo-hana': 1 };

const now = Timestamp.now();
const batch = db.batch();
batch.set(db.doc('quarters/2026-Q3'), { label: 'Q3 2026', status: 'closed', dueDate: Timestamp.fromDate(new Date('2026-09-30T12:00:00')), closedAt: now, updatedAt: now });
batch.set(db.doc('quarters/2026-Q4'), { label: 'Q4 2026', status: 'open', dueDate: Timestamp.fromDate(new Date('2026-12-31T12:00:00')), openedAt: now, updatedAt: now });
batch.set(db.doc('settings/current'), { dueDate: Timestamp.fromDate(new Date('2026-12-31T12:00:00')), updatedAt: now });
for (const l of lessons) {
  batch.set(db.doc(`lessons/${l.id}`), {
    title: l.title, titleLower: l.title.toLowerCase(), track: l.track, quarter: l.quarter, type: l.type,
    sortOrder: l.sortOrder, link: l.link, duration: l.duration, description: '', assignedTracks: [],
    active: true, createdAt: now, updatedAt: now,
  });
}
const authUsers = [];
for (const [uid, firstName, lastName, jobTitle, track, role, managedTrack] of people) {
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@salesfactory.com`;
  const displayName = `${firstName} ${lastName}`;
  authUsers.push({ uid, email, displayName, emailVerified: true, providerData: [{ uid: `g-${uid}`, email, displayName, providerId: 'google.com' }] });
  batch.set(db.doc(`users/${uid}`), {
    uid, email, emailLower: email, firstName, lastName, displayName, jobTitle, track, role, managedTrack,
    subscribedTracks: [], active: true, createdAt: now, updatedAt: now,
  });
  const required = lessons.filter((l) => track === 'onboarding'
    ? l.track === 'onboarding'
    : (l.track === 'foundations' || l.track === track) && l.quarter === '2026-Q4');
  const done = Math.round(required.length * completion[uid]);
  required.forEach((l, i) => {
    if (i > done) return;
    const status = i < done ? 'Complete' : 'In Progress';
    batch.set(db.doc(`progress/${uid}_${l.id}`), {
      userId: uid, lessonId: l.id, track: l.track, status, updatedAt: now,
      completedAt: status === 'Complete' ? now : null, updatedBy: uid,
    });
  });
}
await batch.commit();
const result = await auth.importUsers(authUsers);
console.log(`seeded ${lessons.length} lessons, ${people.length} people; auth import errors: ${result.errors.length}`);

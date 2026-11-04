import { Helmet } from "react-helmet-async";
import type { ReactNode } from "react";

const collect: [string, string, string, string][] = [
  ["Pathfinder assessment", "Your answers (personality, interests, skills), and optionally gender, career stage, experience level and goal", "To match you to career paths and show your results", "Your request to use the tool"],
  ["Pathfinder assessment", "Your approximate country, worked out from your IP address by ipapi.co (the IP address itself is not stored)", "To show where our users are, in totals only", "Legitimate interest in understanding our reach"],
  ["Pathfinder results PDF", "Your email address", "To send you your results PDF", "Your request"],
  ["Pathfinder and Sprint updates", "Your email address", "To send news about SCP and the Sprint, only if you tick the opt-in box", "Consent, which you can withdraw at any time"],
  ["Pathfinder ratings", "Your star rating and optional comment", "To improve the tool. Comments may be shown publicly on the site, without your name", "Consent"],
  ["Sprint waitlist", "Name, email, country, career stage, project interests, biggest challenge (optional), price you would pay", "To tell you when registration opens and plan future cohorts", "Consent"],
  ["Sprint account", "Name, email, password (stored securely by our hosting provider, never visible to us)", "To run your account", "Contract"],
  ["Sprint profile", "LinkedIn, current role, years of experience, education, interests, career goal, WhatsApp number", "To match you to projects and support you during the cohort", "Contract"],
  ["Sprint work", "Project choices, proposals, uploaded files, survey answers, weekly check-ins, facilitator notes, evaluations", "To run the programme, give feedback and decide certification", "Contract"],
  ["Sprint certificate", "Name, project title, cohort, issue date", "To issue a certificate anyone can verify with its link", "Contract"],
  ["Payment", "Handled by Nestuge (Sprint fees) and Ko-fi (donations). We receive confirmation and your email, never your card details", "To confirm your place or thank you", "Contract"],
  ["Site usage", "Pages visited, device and browser type, only if you accept analytics cookies", "To understand which pages help people", "Consent"],
];

const providers: [string, string, string][] = [
  ["Lovable (with Supabase)", "Hosting, database, file storage, and Sprint emails", "Outside Nigeria, including the US and EU"],
  ["PostHog", "Anonymous website analytics, only after consent", "United States"],
  ["Brevo", "Email newsletters and updates", "European Union"],
  ["ipapi.co", "Works out your country from your IP address", "Outside Nigeria"],
  ["Nestuge", "Sprint payments", "Nigeria"],
  ["Ko-fi", "Donations", "United Kingdom / United States"],
  ["WhatsApp (Meta)", "Cohort support group, for paid participants who choose to join", "Outside Nigeria"],
];

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border my-4">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-muted">
          <tr>{head.map((h) => <th key={h} className="text-left font-semibold p-3">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border align-top">
              {r.map((c, j) => <td key={j} className={`p-3 ${j === 0 ? "font-medium" : "text-muted-foreground"}`}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="text-muted-foreground space-y-2 leading-relaxed">{children}</div>
    </section>
  );
}

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Helmet>
        <title>Privacy Policy | Sustainability Pathfinder</title>
        <meta name="description" content="How Sustainability Career Pathfinder and the Portfolio Project Sprint collect, use and protect your personal data." />
      </Helmet>
      <h1 className="text-3xl font-bold">Privacy Policy — Sustainability Career Pathfinder and Portfolio Project Sprint</h1>
      <p className="text-sm text-muted-foreground mt-2">Last updated: 4 November 2026</p>

      <Section title="Who we are">
        <p>Sustainability Career Pathfinder (sustainabilitypathfinder.com) and the Portfolio Project Sprint (scpportfolioprojects.com) are run by GreenBridge Africa Innovations Ltd (RC 8702938), No 11 Edeki Street, Abuja, Nigeria. We are the data controller for the personal data described here.</p>
      </Section>
      <Section title="Contact and Data Protection Officer">
        <p>Our Data Protection Officer is Ingrid Aringaniza (<a className="underline text-primary" href="mailto:ingrid@greenbridgeafrica.com">ingrid@greenbridgeafrica.com</a>). For any privacy question or request, email <a className="underline text-primary" href="mailto:info@greenbridgeafrica.com">info@greenbridgeafrica.com</a>.</p>
      </Section>
      <Section title="What we collect and why">
        <Table head={["Where", "What we collect", "Why", "Legal basis"]} rows={collect} />
      </Section>
      <Section title="Automated recommendations">
        <p>Pathfinder suggests career paths and portfolio projects automatically from your answers. These are suggestions only. They do not decide anything about you, and Sprint selection decisions are made by people.</p>
      </Section>
      <Section title="Who we share data with">
        <p>We do not sell personal data. We use these service providers to run the sites:</p>
        <Table head={["Provider", "What they do for us", "Where data may be stored"]} rows={providers} />
        <p>When data leaves Nigeria, we rely on safeguards allowed under the Nigeria Data Protection Act 2023, such as contracts with the provider and, where needed, your consent.</p>
      </Section>
      <Section title="How long we keep it">
        <ul className="list-disc pl-5 space-y-1">
          <li>Pathfinder assessments: 5 years, then deleted.</li>
          <li>Pathfinder email addresses: 5 years, or sooner if you unsubscribe.</li>
          <li>Waitlist entries: until 12 months after the cohort you joined for.</li>
          <li>Sprint participant data: 12 months after your cohort ends. Certificate records are kept so your certificate stays verifiable.</li>
          <li>Analytics data: 12 months.</li>
        </ul>
      </Section>
      <Section title="Your rights">
        <p>You can ask to see, correct, delete or download your data. You can object to or restrict how we use it, and withdraw consent at any time. Every marketing email has an unsubscribe link. Email <a className="underline text-primary" href="mailto:info@greenbridgeafrica.com">info@greenbridgeafrica.com</a> and we will reply within 30 days. You can complain to the Nigeria Data Protection Commission (<a className="underline text-primary" href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer">ndpc.gov.ng</a>). If you live in the EU or UK, you can also complain to your local data protection authority.</p>
      </Section>
      <Section title="Children">
        <p>The Sprint is for people aged 18 and over. Pathfinder users under 18 should have a parent or guardian's permission before giving their email address.</p>
      </Section>
      <Section title="Security">
        <p>Access to personal data is limited by role. Participants see only their own data, and only our admin and facilitators see cohort data. If a breach puts your data at risk, we will tell the Nigeria Data Protection Commission within 72 hours and tell you without undue delay.</p>
      </Section>
      <Section title="Changes">
        <p>If we change this policy in a way that matters, we will update the date above and tell Sprint participants by email.</p>
      </Section>
    </div>
  );
}

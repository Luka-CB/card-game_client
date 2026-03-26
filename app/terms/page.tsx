import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Terms of Service | Joker Clash",
};

export default function TermsPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Terms of Service</h1>
      <p className={styles.effective}>
        <strong>Effective Date:</strong> March 10, 2026
      </p>

      <section className={styles.section}>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Joker Clash, users agree to these Terms of
          Service and any applicable laws and regulations.
        </p>
      </section>

      <section className={styles.section}>
        <h2>2. Eligibility</h2>
        <p>
          Users must be at least 13 years old, or the age required by local law.
          If under the required age, parental or guardian consent is required.
        </p>
      </section>

      <section className={styles.section}>
        <h2>3. Accounts and Security</h2>
        <p>
          Users are responsible for account activity and for maintaining
          confidentiality of login credentials. Unauthorized use must be
          reported immediately.
        </p>
      </section>

      <section className={styles.section}>
        <h2>4. Acceptable Use</h2>
        <p>Users must not:</p>
        <ul>
          <li>Cheat, exploit bugs, or manipulate gameplay unfairly.</li>
          <li>Harass, abuse, threaten, or impersonate others.</li>
          <li>Attempt unauthorized access to systems or user accounts.</li>
          <li>Upload malicious code or interfere with service stability.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>5. User Content</h2>
        <p>
          Users are responsible for content they submit (e.g., chat, profile
          text, reports). Content that violates law or these Terms may be
          removed.
        </p>
      </section>

      <section className={styles.section}>
        <h2>6. Virtual Items and In-Game Currency</h2>
        <p>
          Virtual items/currency (if any) are licensed, not sold, and have no
          real-world monetary value unless explicitly stated.
        </p>
      </section>

      <section className={styles.section}>
        <h2>7. Intellectual Property</h2>
        <p>
          All trademarks, logos, graphics, code, and game content are owned by
          JOKERCLASH or licensors and are protected by applicable laws.
        </p>
      </section>

      <section className={styles.section}>
        <h2>8. Suspension and Termination</h2>
        <p>
          Access may be suspended or terminated for violations of these Terms,
          abuse, fraud, or actions that harm service integrity.
        </p>
      </section>

      <section className={styles.section}>
        <h2>9. Disclaimers</h2>
        <p>
          The Service is provided &quot;as is&quot; and &quot;as available&quot;
          without warranties of any kind, to the fullest extent allowed by law.
        </p>
      </section>

      <section className={styles.section}>
        <h2>10. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Joker Clash is not liable for
          indirect, incidental, special, consequential, or punitive damages.
        </p>
      </section>

      <section className={styles.section}>
        <h2>11. Governing Law</h2>
        <p>
          These Terms are governed by the laws of Georgia, without regard to
          conflict of law principles.
        </p>
      </section>

      <section className={styles.section}>
        <h2>12. Changes to Terms</h2>
        <p>
          Terms may be updated from time to time. Continued use of the Service
          after updates means acceptance of the revised Terms.
        </p>
      </section>

      <section className={styles.section}>
        <h2>13. Contact</h2>
        <p>
          Questions about these Terms:{" "}
          <a href="mailto:[legal@yourdomain.com]">[legal@yourdomain.com]</a>
        </p>
      </section>
    </main>
  );
}

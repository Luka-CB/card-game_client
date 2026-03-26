import type { Metadata } from "next";
import styles from "./page.module.scss";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Joker Clash",
};

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p className={styles.updated}>Last Updated: March 5, 2026</p>
      <p className={styles.intro}>
        Welcome to Joker Clash. We value your privacy as much as a hidden ace up
        your sleeve. This policy explains how information is collected, used,
        and protected when you use our service.
      </p>

      <section className={styles.section}>
        <h2>1. Information We Collect</h2>
        <p>
          To keep the leaderboard running and the cards dealing, we collect:
        </p>
        <ul>
          <li>
            <strong>Account Data:</strong> username, email address, and
            password.
          </li>
          <li>
            <strong>Gameplay Data:</strong> wins, losses, in-game currency, and
            deck preferences.
          </li>
          <li>
            <strong>Technical Data:</strong> IP address, browser type, and
            device information.
          </li>
          <li>
            <strong>Cookies:</strong> login session and preference data.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>2. How We Use Your Information</h2>
        <p>We do not sell personal data. Information is used to:</p>
        <ul>
          <li>Maintain accounts and game progress.</li>
          <li>Improve game balance and fix bugs.</li>
          <li>Send important updates (new features, maintenance notices).</li>
          <li>Prevent cheating and keep gameplay fair.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>3. Third-Party Services</h2>
        <p>We may use third-party providers to support the platform:</p>
        <ul>
          <li>
            <strong>Analytics:</strong> to understand usage and improve
            performance.
          </li>
          <li>
            <strong>Ads:</strong> partners may use cookies for relevant content
            (if ads are shown).
          </li>
          <li>
            <strong>Payments:</strong> secure processors (e.g., Stripe/PayPal).
            Full card details are not stored by us.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>4. Children&apos;s Privacy</h2>
        <p>
          Our service is intended for players aged 13+. We do not knowingly
          collect personal data from children under this age. If such data is
          discovered, it is deleted promptly.
        </p>
      </section>

      <section className={styles.section}>
        <h2>5. Your Rights &amp; Choices</h2>
        <ul>
          <li>
            <strong>Access or Update:</strong> edit profile information in
            account settings.
          </li>
          <li>
            <strong>Delete:</strong> request account/data deletion by contacting
            support.
          </li>
          <li>
            <strong>Opt-Out:</strong> disable cookies in browser settings (some
            features may not work properly).
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>6. Security</h2>
        <p>
          We use industry-standard safeguards to protect data. No method is
          fully secure, but reasonable measures are continuously applied.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Data Retention &amp; Deletion</h2>
        <p>
          We retain account and gameplay data to provide the Service, prevent
          abuse, and comply with legal requirements. You can remove third-party
          access or request deletion using the instructions below.
        </p>

        <h3>Remove Joker Clash from Facebook</h3>
        <ol>
          <li>
            Log in to Facebook and open{" "}
            <em>Settings &amp; Privacy &gt; Settings</em>.
          </li>
          <li>
            Open <em>Apps and Websites</em> to view connected apps.
          </li>
          <li>
            Find <strong>Joker Clash</strong> and click <em>Remove</em> to
            revoke access.
          </li>
        </ol>

        <h3>Remove Joker Clash from Google</h3>
        <ol>
          <li>
            Sign in to <em>Google Account</em> (myaccount.google.com).
          </li>
          <li>
            Go to <em>Security</em> &gt;{" "}
            <em>Third-party apps with account access</em>.
          </li>
          <li>
            Choose <em>Manage third-party access</em>, find{" "}
            <strong>Joker Clash</strong>, and remove access.
          </li>
        </ol>

        <h3>Delete your Joker Clash account (local)</h3>
        <ol>
          <li>Log in to your Joker Clash account on the website.</li>
          <li>
            Open <em>Account</em> settings and use the{" "}
            <strong>Delete Account</strong> option.
          </li>
          <li>
            Follow the confirmation steps to permanently remove your account and
            data.
          </li>
        </ol>

        <p>
          You may also visit our dedicated data deletion page at{" "}
          <Link href="/data-deletion">Data Deletion</Link> for step-by-step
          guidance, or contact us at{" "}
          <a href="mailto:support@jokerclash.com">support@jokerclash.com</a> to
          request manual deletion.
        </p>
      </section>

      <section className={styles.section}>
        <h2>7. Contact Us</h2>
        <p>
          Questions about this policy or your data can be sent to:{" "}
          <a href="mailto:support@jokerclash.com">support@jokerclash.com</a>
        </p>
      </section>
    </main>
  );
}

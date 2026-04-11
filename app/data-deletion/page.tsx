import Link from "next/link";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Delete your data</h1>

        <p className={styles.lead}>
          Follow these steps to remove Joker Clash from your account. This stops
          login and removes the app's access to your data.
        </p>

        <ol className={styles.steps}></ol>
        <section className={styles.provider}>
          <h2 className={styles.providerTitle}>Facebook</h2>
          <ul className={styles.steps}>
            <li>
              <strong>Log in to Facebook</strong> and open{" "}
              <em>Settings &amp; Privacy</em>
              {" > "}
              <em>Settings</em>.
            </li>
            <li>
              <strong>Open &ldquo;Apps and Websites&rdquo;</strong> to see all
              apps currently connected to your account.
            </li>
            <li>
              <strong>Find Joker Clash</strong> in the list and click the{" "}
              <em>Remove</em>
              button to disconnect and delete the app's access.
            </li>
          </ul>
        </section>

        <section className={styles.provider}>
          <h2 className={styles.providerTitle}>Google</h2>
          <ul className={styles.steps}>
            <li>
              <strong>Log in to your Google account</strong> and open{" "}
              <em>Google Account</em> (myaccount.google.com).
            </li>
            <li>
              Go to <em>Security</em> and scroll to{" "}
              <em>Third-party apps with account access</em> (or{" "}
              <em>Apps with access to your account</em>).
            </li>
            <li>
              Select <strong>Manage third-party access</strong>, find{" "}
              <strong>Joker Clash</strong>, and choose <em>Remove Access</em>.
            </li>
          </ul>
        </section>

        <section className={styles.provider}>
          <h2 className={styles.providerTitle}>
            Delete from Joker Clash (local)
          </h2>
          <ul className={styles.steps}>
            <li>
              <strong>Log in to your Joker Clash account</strong> via the site.
            </li>
            <li>
              Open <em>Account</em> settings and use the{" "}
              <strong>Delete Account</strong> option (the DeleteAccount modal).
            </li>
            <li>
              Follow the on-screen confirmation to permanently remove your
              account and data.
            </li>
          </ul>

          <p className={styles.optional}>
            Prefer us to remove your account manually?{" "}
            <Link href="/?auth-signin" className={styles.link}>
              Log in
            </Link>{" "}
            and use the Delete Account modal, or email{" "}
            <a className={styles.link} href="mailto:support@jokerclash.com">
              support@jokerclash.com
            </a>
            .
          </p>
        </section>

        <p className={styles.note}>
          Notes: Make sure your Facebook/Google app settings and redirect URIs
          are correct, and that your app is live or you are listed as an app
          admin/tester if testing in development mode.
        </p>

        <p className={styles.note}>
          Notes: Make sure your Facebook app is live or you are listed as an app
          admin/tester in the Facebook Developers dashboard if you run into
          permissions or scope errors when using Facebook Login.
        </p>
      </div>
    </main>
  );
}

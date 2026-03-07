import styles from "./page.module.scss";

const classicRounds = [
  { round: "Round 1", hands: "8 hands", cards: "1 → 8 cards" },
  { round: "Round 2", hands: "4 hands", cards: "9 cards each hand" },
  { round: "Round 3", hands: "8 hands", cards: "8 → 1 cards" },
  { round: "Round 4", hands: "4 hands", cards: "9 cards each hand" },
];

const ninesRounds = [
  { round: "Round 1", hands: "4 hands", cards: "9 cards each hand" },
  { round: "Round 2", hands: "4 hands", cards: "9 cards each hand" },
  { round: "Round 3", hands: "4 hands", cards: "9 cards each hand" },
  { round: "Round 4", hands: "4 hands", cards: "9 cards each hand" },
];

export default function RulesPage() {
  return (
    <main className={styles.rules}>
      <section className={styles.hero}>
        <h1>Joker — Official Rules</h1>
        <p>Concise guide for Classic Joker and Nines Joker.</p>
      </section>

      <section className={styles.section}>
        <h2>1&#41; Game Modes</h2>

        <h3>Classic Joker</h3>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Round</th>
                <th>Hands</th>
                <th>Cards per hand</th>
              </tr>
            </thead>
            <tbody>
              {classicRounds.map((r) => (
                <tr key={r.round}>
                  <td>{r.round}</td>
                  <td>{r.hands}</td>
                  <td>{r.cards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Nines Joker</h3>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Round</th>
                <th>Hands</th>
                <th>Cards per hand</th>
              </tr>
            </thead>
            <tbody>
              {ninesRounds.map((r) => (
                <tr key={r.round}>
                  <td>{r.round}</td>
                  <td>{r.hands}</td>
                  <td>{r.cards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2>2&#41; Hand Flow</h2>
        <ol>
          <li>Cards are dealt.</li>
          <li>Players place bids (expected tricks).</li>
          <li>Trump is set (if applicable).</li>
          <li>Players play tricks in turn.</li>
          <li>Hand points are calculated.</li>
          <li>Round score = sum of hand points.</li>
        </ol>
      </section>

      <section className={styles.section}>
        <h2>3&#41; Joker Rules</h2>
        <ul>
          <li>There are 2 Jokers in the deck.</li>
          <li>Joker is the strongest/special control card.</li>
          <li>
            If played first in trick, player can request:
            <ul>
              <li>
                <b>Need (to win)</b>: request highest of a suit.
              </li>
              <li>
                <b>Don’t need (to lose)</b>: request highest to take.
              </li>
            </ul>
          </li>
          <li>
            If played later in trick, Joker can force win or avoid over-winning.
          </li>
          <li>A later Joker can override an earlier Joker.</li>
          <li>
            If player requests to win and someone has no requested suit, trump
            can be used and may beat the request.
          </li>
          <li>
            If player requests to lose and request cannot be satisfied, player
            may still take the trick.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>4&#41; Scoring (Per Hand)</h2>

        <h3>Case A — Exact bid (bid = win)</h3>
        <p>
          0/0 = 50, 1/1 = 100, 2/2 = 150 ... 8/8 = 450
          <br />
          Formula: <code>50 + (bid × 50)</code>
        </p>

        <h3>Case B — Hand number = bid = win</h3>
        <p>
          Hand 1: 1/1 = 100, Hand 2: 2/2 = 200 ... Hand 9: 9/9 = 900
          <br />
          Formula: <code>hand × 100</code>
        </p>

        <h3>Case C — Spoiled (bid ≠ win, win &gt; 0)</h3>
        <p>
          Examples: 0/1 = 10, 2/5 = 50
          <br />
          Formula: <code>win × 10</code>
        </p>

        <h3>Case D — bid &gt; 0 and win = 0</h3>
        <p>
          Penalty is selected by room creator:
          <code> -200 </code> / <code>-500</code> / <code>-900</code>
        </p>
      </section>

      <section className={styles.section}>
        <h2>5&#41; End-of-Game Coins</h2>

        <h3>Normal room (no bet)</h3>
        <ul>
          <li>1st: +300</li>
          <li>2nd: +150</li>
          <li>3rd: -150</li>
          <li>4th: -300</li>
        </ul>
        <p>
          If bot finishes 1st or 2nd, that slot becomes <b>-100 penalty</b>{" "}
          instead of positive reward.
        </p>

        <h3>Bet room</h3>
        <ul>
          <li>To join, user must have at least the bet amount.</li>
          <li>
            1st place gets: <code>bet × 4</code>
          </li>
          <li>
            Other players get: <code>-bet</code>
          </li>
        </ul>
      </section>
    </main>
  );
}

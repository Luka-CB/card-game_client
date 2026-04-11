class SoundManager {
  private sounds: Record<string, HTMLAudioElement> = {};
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.sounds = {
        dealerReveal: new Audio("/sounds/dealer-reveal.mp3"),
        dealCard: new Audio("/sounds/deal-card.mp3"),
        playCard: new Audio("/sounds/play-card.mp3"),
        winCards: new Audio("/sounds/win-cards.mp3"),
        revealCards: new Audio("/sounds/reveal-cards.mp3"),
        playJoker: new Audio("/sounds/play-joker.mp3"),
        slideUnder: new Audio("/sounds/slide-under.mp3"),
        gameFinished: new Audio("/sounds/game-finished.mp3"),
      };

      Object.entries(this.sounds).forEach(([name, sound]) => {
        sound.volume = 0.5;

        if (name === "dealCard") {
          sound.playbackRate = 0.8;
        }
      });
    }
  }

  play(soundName: keyof typeof this.sounds) {
    if (this.isMuted || !this.sounds[soundName]) return;

    const sound = this.sounds[soundName];
    sound.currentTime = 0;
    sound.play().catch((err) => console.log("Sound play failed:", err));
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  setVolume(volume: number) {
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = Math.max(0, Math.min(1, volume));
    });
  }
}

export const soundManager = new SoundManager();

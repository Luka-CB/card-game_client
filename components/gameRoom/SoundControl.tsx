import useSoundStore from "@/store/soundStore";
import styles from "./SoundControl.module.scss";
import { soundManager } from "@/utils/sounds";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

const SoundControl = () => {
  const { toggleMute, isMuted, volume, setVolume, showSlider, toggleSlider } =
    useSoundStore();

  const handleMuteToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (showSlider) {
      const newMuted = !isMuted;
      toggleMute();
      setVolume(newMuted ? 0 : 0.5);
      soundManager.setVolume(newMuted ? 0 : 0.5);
      soundManager.setMuted(newMuted);
    } else {
      toggleSlider(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    soundManager.setVolume(newVolume);
    if (newVolume === 0) {
      toggleMute(true);
      soundManager.setMuted(true);
    } else if (isMuted) {
      toggleMute(false);
      soundManager.setMuted(false);
    }
  };

  return (
    <div
      className={styles.sound_control}
      onMouseLeave={() => toggleSlider(false)}
    >
      <button
        onClick={(e) => handleMuteToggle(e)}
        className={styles.volume_btn}
      >
        {isMuted ? (
          <HiSpeakerXMark className={styles.mute_icon} />
        ) : (
          <HiSpeakerWave className={styles.speaker_icon} />
        )}
      </button>
      {showSlider && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className={styles.volume_slider}
          style={{ "--fill": `${volume * 100}%` } as React.CSSProperties}
        />
      )}
    </div>
  );
};

export default SoundControl;

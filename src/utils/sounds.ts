// Sound effect URLs
const SOUND_EFFECTS = {
  TICK: '/sounds/tick.mp3',
  LAST_TICK: '/sounds/last-tick.mp3',
  WRONG: '/sounds/wrong.mp3',
  CORRECT: '/sounds/correct.mp3',
  START: '/sounds/start.mp3',
  GAMEOVER: '/sounds/gameover.mp3'
};

class SoundManager {
  private static instance: SoundManager;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private muted: boolean = false;
  private tickLoop: HTMLAudioElement | null = null;

  private constructor() {
    // Initialize all sounds
    Object.entries(SOUND_EFFECTS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.volume = 0.3; // Reduced volume to 30%
      this.sounds[key] = audio;
      
      // Set up tick loop
      if (key === 'TICK') {
        audio.loop = true;
        this.tickLoop = audio;
      }
      
      // Preload sounds
      audio.load();
    });
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public startTickLoop() {
    if (this.muted) return;
    
    if (this.tickLoop) {
      this.stopTickLoop();
    }
    
    this.tickLoop = this.sounds['TICK'];
    if (this.tickLoop) {
      this.tickLoop.currentTime = 0;
      this.tickLoop.play().catch(err => console.log('Error playing tick loop:', err));
    }
  }

  public stopTickLoop() {
    if (this.tickLoop) {
      this.tickLoop.pause();
      this.tickLoop.currentTime = 0;
      this.tickLoop = null;
    }
  }

  public stopAllSounds() {
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  public playSound(soundName: keyof typeof SOUND_EFFECTS) {
    if (this.muted) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      // Create a new audio instance for last tick sound
      if (soundName === 'LAST_TICK') {
        const tempAudio = new Audio(SOUND_EFFECTS[soundName]);
        tempAudio.volume = 0.3;
        tempAudio.play().catch(err => console.log('Error playing sound:', err));
      } else {
        sound.currentTime = 0;
        sound.play().catch(err => console.log('Error playing sound:', err));
      }
    }
  }

  public toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.tickLoop) {
      this.stopTickLoop();
    }
    return this.muted;
  }
  
  public isMuted() {
    return this.muted;
  }

  public setVolume(volume: number) {
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume = normalizedVolume;
    });
  }
}

export const soundManager = SoundManager.getInstance();

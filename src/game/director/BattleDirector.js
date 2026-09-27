/**
 * BattleDirector
 * Translates a deterministic EventStream from CombatEngine into timed audiovisual beats
 * with proper anticipation -> action -> impact -> recovery pacing.
 */
export class BattleDirector {
  constructor(options = {}) {
    this.events = options.events || [];
    this.speed = options.speed || 1.0;
    this.callbacks = options.callbacks || {};
    this.timers = [];
    this.isPlaying = false;
    this.startTime = 0;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  clearTimers() {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
  }

  schedule(fn, delayMs) {
    const adjustedMs = Math.max(0, delayMs / this.speed);
    const timerId = setTimeout(fn, adjustedMs);
    this.timers.push(timerId);
    return timerId;
  }

  /**
   * Play the event stream in real-time
   */
  play(onComplete) {
    this.clearTimers();
    this.isPlaying = true;

    if (!this.events || this.events.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    const firstEventTime = this.events[0].time;

    this.events.forEach((event) => {
      const delayMs = (event.time - firstEventTime) * 1000 + 400; // 400ms intro padding

      this.schedule(() => {
        if (!this.isPlaying) return;
        this.dispatch(event);

        if (event.type === 'battle_end') {
          this.schedule(() => {
            this.isPlaying = false;
            if (onComplete) onComplete(event);
          }, 1200);
        }
      }, delayMs);
    });
  }

  stop() {
    this.isPlaying = false;
    this.clearTimers();
  }

  dispatch(event) {
    const cb = this.callbacks;

    switch (event.type) {
      case 'battle_start':
        cb.onBattleStart?.(event);
        break;

      case 'edict_trigger':
        cb.onEdictTrigger?.(event);
        break;

      case 'enemy_intent_lock':
        // Anticipation phase
        cb.onEnemyIntentLock?.(event);
        break;

      case 'damage':
        // Action & Impact
        cb.onDamage?.(event);
        break;

      case 'intercept':
        // Vael Intercept special reaction
        cb.onIntercept?.(event);
        break;

      case 'heal':
        // Mirel healing pulse
        cb.onHeal?.(event);
        break;

      case 'barrier':
        cb.onBarrier?.(event);
        break;

      case 'resonance_emergency':
        cb.onResonanceEmergency?.(event);
        break;

      case 'channel_start':
        // Seris channel start
        cb.onChannelStart?.(event);
        break;

      case 'channel_interrupt':
        cb.onChannelInterrupt?.(event);
        break;

      case 'moonlight_burst':
        // Seris grand payoff
        cb.onMoonlightBurst?.(event);
        break;

      case 'hero_down':
        cb.onHeroDown?.(event);
        break;

      case 'enemy_down':
        cb.onEnemyDown?.(event);
        break;

      case 'battle_end':
        cb.onBattleEnd?.(event);
        break;

      default:
        break;
    }
  }
}

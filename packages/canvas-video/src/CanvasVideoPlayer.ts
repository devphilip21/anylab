import EventBus from '@anylab/eventbus';
import { CanvasVideoVideoOption } from './models';

export class CanvasVideoPlayer extends EventBus<{
  play: CanvasVideoPlayer;
  tick: CanvasVideoPlayer;
}> {
  private _totalTime: number;
  private _frameRate: number;
  private _startTimestamp: number | null = null;
  private _animationFrameId: number | null = null;
  private _state = {
    sequence: 0,
    time: 0,
    percent: 0,
    isPlaying: false,
  };

  constructor(opt?: CanvasVideoVideoOption) {
    super();
    this._totalTime = opt?.totalTime ?? 0;
    this._frameRate = opt?.frameRate ?? 60;
  }

  get frameRate() {
    return this._frameRate;
  }

  get state() {
    return this._state;
  }

  play() {
    this._state.isPlaying = true;
    this.emit('play');
    this._animationFrameId = requestAnimationFrame(this._next);
  }

  stop() {
    this._state = {
      sequence: 0,
      time: 0,
      percent: 0,
      isPlaying: false,
    };
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
  }

  private _next = (timestamp: number) => {
    if (!this._state.isPlaying) {
      return;
    }

    const startTimestamp = this._startTimestamp;

    let hit = false;
    if (startTimestamp === null) {
      this._startTimestamp = timestamp;
      this._state.time = 0;
      this._state.percent = 0;
      hit = true;
    } else {
      this._state.time = timestamp - startTimestamp;
      this._state.percent = this._totalTime > 0 ? this._state.time / this._totalTime : 0;
      hit = this._state.time >= this._getNextTime();
    }

    if (hit) {
      this.emit('tick', this);
      this._state.sequence++;
    }

    this._animationFrameId = requestAnimationFrame(this._next);
  };

  private _getNextTime(): number {
    const nextSequence = this._state.sequence;
    const timeUnit = 1000 / this._frameRate;

    return timeUnit * nextSequence;
  }
}

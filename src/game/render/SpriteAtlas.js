/**
 * SpriteAtlas
 * Consumes game-ready sprite sheets and manifests inspired by SpriteGen (aldegad/sprite-gen)
 * and the 2.5D animation standards of 'Hero Inc.' (용사주식회사).
 * Features:
 * - Real-time client-side chroma key unmixing (#FF00FF -> alpha) with edge defringing
 * - 4x2 grid extraction into 8 canonical keyposes (Idle, Windup, Brace, Crouch, Hit, Lunge, Special, Recovery)
 * - Strict base standing scale locking (eliminates crouch/hit scale-popping bugs)
 * - Ground plane foot-anchor alignment with dynamic contact drop-shadow
 * - Living procedural sine-wave breathing loops & stance bobbing (phase-offset per unit)
 * - Ghosting afterimage trails (잔상 효과) during dashes, lunges, and bursts
 * - High-impact white hit-flash and spring-damped knockback recoil
 * - Zero-overhead instancing for minions (shares pre-processed frames)
 */

export class SpriteAtlas {
  constructor(options = {}) {
    this.sheetSrc = options.sheetSrc || null;
    this.facing = options.facing || 'right';
    this.isEnemy = options.isEnemy || false;
    this.paletteFilter = options.paletteFilter || null;
    this.scaleMultiplier = options.scaleMultiplier || 1.0;
    this.manifest = options.manifest || this.createDefaultManifest();

    // Procedural life & breathing options (inspired by Hero Inc. standards)
    this.breathSpeed = options.breathSpeed || (this.isEnemy ? 2.6 : 2.1);
    this.breathPhase = options.breathPhase !== undefined ? options.breathPhase : Math.random() * Math.PI * 2;
    this.breathAmount = options.breathAmount !== undefined ? options.breathAmount : 1.0;

    this.currentAction = 'idle';
    this.currentFrameIdx = 0;
    this.timer = 0;
    this.totalElapsed = 0;
    this.onFinishCallback = null;

    // Juice states
    this.hitFlashTimer = 0; // ms remaining of white hit flash
    this.recoilX = 0; // horizontal knockback recoil offset in px
    this.afterimages = []; // active afterimage ghost records
    this.afterimageTimer = 0;

    // Master base scale anchors (strictly calculated from Frame 0 Standing Idle)
    this.baseCharHeight = 0;
    this.baseCharWidth = 0;

    this.loaded = false;
    this.frames = []; // Array of { canvas, width, height, footX, footY, bounds }
    this.boundCanvases = new Set();
    this.rafId = 0;
    this.lastTickTime = performance.now();

    if (this.sheetSrc) {
      this.loadAndProcess(this.sheetSrc);
    }
  }

  /**
   * Create an independent animated instance that shares pre-processed frames.
   * Zero memory overhead for minions (Hound, Hunter, Lancer).
   */
  createInstance(options = {}) {
    const instance = new SpriteAtlas({
      facing: options.facing || this.facing,
      isEnemy: options.isEnemy !== undefined ? options.isEnemy : this.isEnemy,
      paletteFilter: options.paletteFilter || this.paletteFilter,
      scaleMultiplier: options.scaleMultiplier !== undefined ? options.scaleMultiplier : this.scaleMultiplier,
      breathSpeed: options.breathSpeed || this.breathSpeed,
      breathPhase: options.breathPhase !== undefined ? options.breathPhase : Math.random() * Math.PI * 2,
      breathAmount: options.breathAmount !== undefined ? options.breathAmount : this.breathAmount,
      manifest: this.manifest,
    });
    instance.frames = this.frames;
    instance.baseCharHeight = this.baseCharHeight;
    instance.baseCharWidth = this.baseCharWidth;
    instance.loaded = this.loaded;
    return instance;
  }

  createDefaultManifest() {
    return {
      meta: {
        generator: 'sprite-gen',
        version: '2.11.0',
        facing: this.facing,
        cols: 4,
        rows: 2,
      },
      animations: {
        idle: { frames: [0], fps: 3, loop: true },
        windup: { frames: [1], fps: 8, loop: false },
        brace: { frames: [2], fps: 8, loop: false },
        crouch: { frames: [3], fps: 6, loop: false },
        hit: { frames: [4], fps: 8, loop: false },
        lunge: { frames: [5], fps: 10, loop: false },
        intercept: { frames: [6, 2], fps: 9, loop: false },
        channel: { frames: [2, 3], fps: 5, loop: true },
        burst: { frames: [6], fps: 8, loop: false },
        heal: { frames: [6], fps: 8, loop: false },
        recovery: { frames: [7, 0], fps: 7, loop: false },
        down: { frames: [7], fps: 4, loop: true },
      },
    };
  }

  /**
   * Load sprite sheet and perform chroma cutout (#FF00FF -> alpha)
   */
  async loadAndProcess(src) {
    if (typeof Image === 'undefined') return;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          this.processImage(img);
          this.loaded = true;
          this.renderAllBound();
          this.startLoop();
          resolve(this);
        } catch (err) {
          console.warn('[SpriteAtlas] Cutout error:', err);
          reject(err);
        }
      };
      img.onerror = (e) => {
        console.warn(`[SpriteAtlas] Failed to load sprite sheet: ${src}`, e);
        reject(e);
      };
      img.src = src;
    });
  }

  processImage(img) {
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;

    // 1. Offscreen canvas for chroma removal
    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = w;
    fullCanvas.height = h;
    const fullCtx = fullCanvas.getContext('2d', { willReadFrequently: true });
    fullCtx.drawImage(img, 0, 0);

    const imgData = fullCtx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Chroma key algorithm: magenta threshold & defringing
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const dr = 255 - r;
      const dg = g;
      const db = 255 - b;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);

      if (dist < 115) {
        // True chroma background
        data[i + 3] = 0;
      } else if (dist < 155) {
        // Soft edge anti-aliasing
        const factor = (dist - 115) / 40;
        data[i + 3] = Math.round(data[i + 3] * factor);
        // Suppress magenta fringing on edge pixels
        data[i] = Math.min(r, Math.max(g, b * 0.75));
        data[i + 2] = Math.min(b, Math.max(g, r * 0.75));
      }
    }

    fullCtx.putImageData(imgData, 0, 0);

    // 2. Slice 4x2 grid into 8 frame canvases
    const cols = this.manifest.meta.cols || 4;
    const rows = this.manifest.meta.rows || 2;
    const cellW = Math.floor(w / cols);
    const cellH = Math.floor(h / rows);

    this.frames = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const frameIdx = r * cols + c;
        const x = c * cellW;
        const y = r * cellH;

        const cellCanvas = document.createElement('canvas');
        cellCanvas.width = cellW;
        cellCanvas.height = cellH;
        const cellCtx = cellCanvas.getContext('2d');
        cellCtx.drawImage(fullCanvas, x, y, cellW, cellH, 0, 0, cellW, cellH);

        // Find bounding box and foot anchor
        const cellData = fullCtx.getImageData(x, y, cellW, cellH).data;
        let minX = cellW, maxX = 0, minY = cellH, maxY = 0;
        let footPixelsX = [];

        for (let py = 0; py < cellH; py++) {
          for (let px = 0; px < cellW; px++) {
            const alpha = cellData[(py * cellW + px) * 4 + 3];
            if (alpha > 30) {
              if (px < minX) minX = px;
              if (px > maxX) maxX = px;
              if (py < minY) minY = py;
              if (py > maxY) maxY = py;
            }
          }
        }

        // Bottom 10% foot contact center
        const footThresholdY = Math.max(minY, maxY - Math.max(4, Math.floor((maxY - minY) * 0.1)));
        for (let py = footThresholdY; py <= maxY; py++) {
          for (let px = minX; px <= maxX; px++) {
            const alpha = cellData[(py * cellW + px) * 4 + 3];
            if (alpha > 50) footPixelsX.push(px);
          }
        }

        const avgFootX = footPixelsX.length > 0
          ? Math.round(footPixelsX.reduce((a, b) => a + b, 0) / footPixelsX.length)
          : Math.round((minX + maxX) / 2);

        this.frames.push({
          index: frameIdx,
          canvas: cellCanvas,
          width: cellW,
          height: cellH,
          footX: avgFootX,
          footY: maxY,
          bounds: { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY },
        });
      }
    }

    // Anchor master base dimensions strictly from Frame 0 (Standing Idle)
    const baseFrame = this.frames[0];
    this.baseCharHeight = baseFrame?.bounds?.height > 40 ? baseFrame.bounds.height : cellH * 0.78;
    this.baseCharWidth = baseFrame?.bounds?.width > 20 ? baseFrame.bounds.width : cellW * 0.55;
  }

  /**
   * Bind an HTML5 canvas element to this sprite player
   */
  bindCanvas(canvas) {
    if (!canvas) return;
    this.boundCanvases.add(canvas);
    if (this.loaded) {
      this.renderCanvas(canvas);
      this.startLoop();
    }
  }

  unbindCanvas(canvas) {
    this.boundCanvases.delete(canvas);
    if (this.boundCanvases.size === 0 && this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  play(actionName, onFinish = null) {
    const anim = this.manifest.animations[actionName];
    if (anim) {
      this.currentAction = actionName;
      this.currentFrameIdx = 0;
      this.timer = 0;
      this.onFinishCallback = onFinish;

      if (actionName === 'hit') {
        // High impact hit feedback: 110ms pure white flash + directional recoil impulse
        this.hitFlashTimer = 110;
        this.recoilX = this.isEnemy ? 18 : -18;
      } else if (actionName === 'lunge' || actionName === 'burst' || actionName === 'intercept') {
        this.spawnAfterimage();
      }

      this.renderAllBound();
    }
  }

  spawnAfterimage() {
    const frameNum = this.getCurrentFrame();
    const frame = this.frames[frameNum] || this.frames[0];
    if (!frame) return;

    this.afterimages.push({
      frameNum,
      recoilX: this.recoilX,
      alpha: 0.65,
    });
    if (this.afterimages.length > 4) {
      this.afterimages.shift();
    }
  }

  startLoop() {
    if (this.rafId) return;
    this.lastTickTime = performance.now();

    const loop = (now) => {
      if (this.boundCanvases.size === 0) {
        this.rafId = 0;
        return;
      }
      const dt = Math.min(0.1, (now - this.lastTickTime) / 1000);
      this.lastTickTime = now;
      this.update(dt);
      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  update(dt) {
    this.totalElapsed += dt;

    // Decay hit flash
    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer = Math.max(0, this.hitFlashTimer - dt * 1000);
    }

    // Decay recoil with spring damping
    if (Math.abs(this.recoilX) > 0.2) {
      this.recoilX *= Math.pow(0.04, dt);
    } else {
      this.recoilX = 0;
    }

    // Update afterimages
    for (let i = this.afterimages.length - 1; i >= 0; i--) {
      const ai = this.afterimages[i];
      ai.alpha -= dt * 3.2; // ~310ms fade duration
      if (ai.alpha <= 0) {
        this.afterimages.splice(i, 1);
      }
    }

    // Spawn afterimages during dashing actions
    const isDashing = ['lunge', 'burst', 'intercept'].includes(this.currentAction);
    if (isDashing) {
      this.afterimageTimer += dt;
      if (this.afterimageTimer >= 0.05) {
        this.afterimageTimer = 0;
        this.spawnAfterimage();
      }
    }

    const anim = this.manifest.animations[this.currentAction];
    if (!anim) {
      this.renderAllBound();
      return;
    }

    this.timer += dt;
    const frameDuration = 1 / (anim.fps || 6);

    if (this.timer >= frameDuration) {
      this.timer -= frameDuration;
      if (this.currentFrameIdx < anim.frames.length - 1) {
        this.currentFrameIdx++;
      } else if (anim.loop) {
        this.currentFrameIdx = 0;
      } else {
        const cb = this.onFinishCallback;
        this.onFinishCallback = null;
        if (this.currentAction !== 'idle' && this.currentAction !== 'down') {
          this.currentAction = 'idle';
          this.currentFrameIdx = 0;
        }
        cb?.();
      }
    }

    // Continuous rendering to drive procedural breathing & afterimage decay
    this.renderAllBound();
  }

  getCurrentFrame() {
    const anim = this.manifest.animations[this.currentAction];
    if (!anim) return 0;
    return anim.frames[this.currentFrameIdx] ?? 0;
  }

  renderAllBound() {
    for (const canvas of this.boundCanvases) {
      this.renderCanvas(canvas);
    }
  }

  renderCanvas(target) {
    if (!this.loaded || !target || this.frames.length === 0) return;
    const ctx = target.getContext('2d');
    if (!ctx) return;

    const frameNum = this.getCurrentFrame();
    const frame = this.frames[frameNum] || this.frames[0];
    if (!frame) return;

    const tw = target.width;
    const th = target.height;
    ctx.clearRect(0, 0, tw, th);

    // Foot anchor alignment: align character's feet near bottom center of target canvas
    const marginBottom = Math.round(th * 0.09); // 9% bottom clearance
    const targetFootY = th - marginBottom;
    const targetFootX = Math.round(tw / 2);

    // Compute scale strictly against master base Idle height (PREVENTS CROUCH SCALE POPPING!)
    const baseH = this.baseCharHeight || Math.max(50, frame.bounds.height || frame.height);
    const baseW = this.baseCharWidth || Math.max(30, frame.bounds.width || frame.width);
    const masterScale = Math.min((th * 0.82) / baseH, (tw * 0.88) / baseW) * this.scaleMultiplier;

    // Procedural Breathing & Bobbing (Smooth ease curve)
    let bobY = 0;
    let breathScaleY = 1.0;
    let breathScaleX = 1.0;

    if (this.currentAction === 'idle' || this.currentAction === 'channel') {
      const breathSin = Math.sin(this.totalElapsed * this.breathSpeed + this.breathPhase);
      bobY = breathSin * 2.6 * this.breathAmount;
      breathScaleY = 1.0 + breathSin * 0.022 * this.breathAmount;
      breathScaleX = 1.0 - breathSin * 0.016 * this.breathAmount;
    }

    const currentX = targetFootX + this.recoilX;
    const currentY = targetFootY + bobY;

    // 1. Draw dynamic ground contact shadow (Hero Inc. depth grounding)
    const shadowW = Math.round(baseW * masterScale * 0.72 * (1.0 - (bobY < 0 ? -bobY * 0.025 : 0)));
    const shadowH = Math.max(6, Math.round(11 * (1.0 - (bobY < 0 ? -bobY * 0.025 : 0))));
    const shadowY = targetFootY + 2;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(currentX, shadowY, shadowW / 2, shadowH / 2, 0, 0, Math.PI * 2);
    const shadowAlpha = Math.max(0.12, 0.44 - (bobY < 0 ? -bobY * 0.02 : 0));
    ctx.fillStyle = `rgba(6, 8, 14, ${shadowAlpha})`;
    ctx.fill();
    ctx.restore();

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 2. Draw afterimages (잔상 효과)
    if (this.afterimages.length > 0) {
      for (const ai of this.afterimages) {
        const aiFrame = this.frames[ai.frameNum] || frame;
        const aiDrawW = Math.round(aiFrame.width * masterScale);
        const aiDrawH = Math.round(aiFrame.height * masterScale);
        const aiDrawX = (targetFootX + ai.recoilX) - Math.round(aiFrame.footX * masterScale);
        const aiDrawY = targetFootY - Math.round(aiFrame.footY * masterScale);

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(0.7, ai.alpha));
        if (this.isEnemy) {
          ctx.shadowColor = 'rgba(255, 60, 90, 0.9)';
          ctx.shadowBlur = 16;
        } else {
          ctx.shadowColor = 'rgba(140, 210, 255, 0.95)';
          ctx.shadowBlur = 16;
        }
        ctx.drawImage(aiFrame.canvas, aiDrawX, aiDrawY, aiDrawW, aiDrawH);
        ctx.restore();
      }
    }

    // 3. Draw main sprite with Foot-Anchor and Breathing Transforms
    const drawW = Math.round(frame.width * masterScale * breathScaleX);
    const drawH = Math.round(frame.height * masterScale * breathScaleY);

    const drawX = currentX - Math.round(frame.footX * masterScale * breathScaleX);
    const drawY = currentY - Math.round(frame.footY * masterScale * breathScaleY);

    ctx.save();

    // White hit flash or normal palette filter
    if (this.hitFlashTimer > 0) {
      const flashBrightness = 2.4 + (this.hitFlashTimer / 110) * 1.6;
      ctx.filter = `brightness(${flashBrightness}) contrast(1.4)`;
    } else if (this.paletteFilter) {
      ctx.filter = this.paletteFilter;
    }

    // Team silhouette outline & ambient lighting (Hero Inc. Step 6)
    if (this.isEnemy) {
      ctx.shadowColor = 'rgba(255, 75, 115, 0.8)';
      ctx.shadowBlur = 12;
    } else {
      ctx.shadowColor = 'rgba(255, 235, 160, 0.8)';
      ctx.shadowBlur = 12;
    }

    ctx.drawImage(frame.canvas, drawX, drawY, drawW, drawH);
    ctx.restore();
  }
}

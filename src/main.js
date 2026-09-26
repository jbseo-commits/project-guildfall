import { Application, Container, Graphics, Text } from 'pixi.js';
import './style.css';

const mount = document.querySelector('#app');

const app = new Application();
await app.init({
  resizeTo: window,
  background: '#0a0b10',
  antialias: false,
  autoDensity: true,
  resolution: Math.min(2, window.devicePixelRatio || 1),
});
mount.appendChild(app.canvas);

const world = new Container();
app.stage.addChild(world);

const title = new Text({
  text: 'PROJECT GUILDFALL',
  style: {
    fill: '#f4ead5',
    fontFamily: 'system-ui, sans-serif',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
world.addChild(title);

const subtitle = new Text({
  text: 'PLAN  →  COMMIT  →  WATCH  →  ADAPT',
  style: {
    fill: '#a9afbf',
    fontFamily: 'ui-monospace, monospace',
    fontSize: 14,
    letterSpacing: 1,
  },
});
world.addChild(subtitle);

const arena = new Graphics();
world.addChild(arena);

const note = new Text({
  text: 'Blank-slate prototype shell\nLock D001 + D002 before building combat.',
  style: {
    fill: '#737b8f',
    fontFamily: 'system-ui, sans-serif',
    fontSize: 13,
    align: 'center',
    lineHeight: 20,
  },
});
world.addChild(note);

function layout() {
  const w = app.screen.width;
  const h = app.screen.height;
  title.anchor.set(0.5);
  title.position.set(w / 2, Math.max(70, h * 0.24));
  subtitle.anchor.set(0.5);
  subtitle.position.set(w / 2, title.y + 46);

  const aw = Math.min(w - 40, 560);
  const ah = Math.min(260, Math.max(150, h * 0.32));
  const ax = (w - aw) / 2;
  const ay = Math.max(subtitle.y + 55, h * 0.42);
  arena.clear()
    .rect(ax, ay, aw, ah)
    .fill({ color: 0x11151f })
    .stroke({ color: 0x31394b, width: 2 });

  const laneY = ay + ah * 0.5;
  arena.moveTo(ax + 20, laneY).lineTo(ax + aw - 20, laneY).stroke({ color: 0x222a39, width: 1 });
  for (let i = 0; i < 3; i += 1) {
    const y = ay + ah * (0.25 + i * 0.25);
    arena.circle(ax + aw * 0.25, y, 13).fill({ color: 0x38455f });
    arena.circle(ax + aw * 0.75, y, 13).fill({ color: 0x5a3542 });
  }

  note.anchor.set(0.5, 0);
  note.position.set(w / 2, ay + ah + 22);
}

layout();
window.addEventListener('resize', layout);

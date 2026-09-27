import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const brainE315 = 'C:\\Users\\정현아\\.gemini\\antigravity-ide\\brain\\e315f9d0-c7f8-4c92-ae89-08a8677f50e8';
const brain740C = 'C:\\Users\\정현아\\.gemini\\antigravity-ide\\brain\\740c0a6b-bd33-415c-9b98-f7d5b7789e96';

const files = [
  // Scene & Character Busts
  { dir: brainE315, src: 'camp_caravan_master_1790481940671.jpg', dst: 'src/assets/scenes/camp_master.jpg', pub: 'public/assets/camp_master.jpg' },
  { dir: brainE315, src: 'arena_battle_master_1790481960448.jpg', dst: 'src/assets/scenes/arena_master.jpg', pub: 'public/assets/arena_master.jpg' },
  { dir: brainE315, src: 'hero_vael_bust_1790482038319.jpg', dst: 'src/assets/heroes/vael_master.jpg', pub: 'public/assets/vael_master.jpg' },
  { dir: brainE315, src: 'hero_seris_bust_1790482138629.jpg', dst: 'src/assets/heroes/seris_master.jpg', pub: 'public/assets/seris_master.jpg' },
  { dir: brainE315, src: 'hero_mirel_bust_1790482154107.jpg', dst: 'src/assets/heroes/mirel_master.jpg', pub: 'public/assets/mirel_master.jpg' },
  { dir: brainE315, src: 'boss_warden_bust_1790482169909.jpg', dst: 'src/assets/enemies/boss_warden_master.jpg', pub: 'public/assets/boss_warden_master.jpg' },

  // Production Sprite Sheets (8 Keyposes on Magenta Chroma)
  { dir: brain740C, src: 'vael_sprite_sheet_1790492898061.jpg', dst: 'src/assets/heroes/vael_sprites.jpg', pub: 'public/assets/vael_sprites.jpg' },
  { dir: brain740C, src: 'seris_sprite_sheet_1790492957242.jpg', dst: 'src/assets/heroes/seris_sprites.jpg', pub: 'public/assets/seris_sprites.jpg' },
  { dir: brain740C, src: 'mirel_sprite_sheet_1790492975483.jpg', dst: 'src/assets/heroes/mirel_sprites.jpg', pub: 'public/assets/mirel_sprites.jpg' },
  { dir: brain740C, src: 'boss_warden_sprites_1790493045235.jpg', dst: 'src/assets/enemies/boss_warden_sprites.jpg', pub: 'public/assets/boss_warden_sprites.jpg' },
];

for (const f of files) {
  const srcPath = path.join(f.dir, f.src);
  if (fs.existsSync(srcPath)) {
    const dstPath = path.join(root, f.dst);
    const pubPath = path.join(root, f.pub);
    fs.mkdirSync(path.dirname(dstPath), { recursive: true });
    fs.mkdirSync(path.dirname(pubPath), { recursive: true });
    fs.copyFileSync(srcPath, dstPath);
    fs.copyFileSync(srcPath, pubPath);
    console.log(`Synced: ${f.src} -> ${f.dst} & ${f.pub}`);
  } else {
    console.warn(`Missing source: ${srcPath}`);
  }
}
console.log('All master art & sprite sheets synchronized successfully!');

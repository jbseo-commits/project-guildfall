import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brainDir = 'C:\\Users\\정현아\\.gemini\\antigravity-ide\\brain\\e315f9d0-c7f8-4c92-ae89-08a8677f50e8';

const assetMappings = [
  { src: 'camp_caravan_master_1790481940671.jpg', dest: 'src/assets/scenes/camp_master.jpg' },
  { src: 'arena_battle_master_1790481960448.jpg', dest: 'src/assets/scenes/arena_master.jpg' },
  { src: 'hero_vael_bust_1790482038319.jpg', dest: 'src/assets/heroes/vael_master.jpg' },
  { src: 'hero_seris_bust_1790482138629.jpg', dest: 'src/assets/heroes/seris_master.jpg' },
  { src: 'hero_mirel_bust_1790482154107.jpg', dest: 'src/assets/heroes/mirel_master.jpg' },
  { src: 'boss_warden_bust_1790482169909.jpg', dest: 'src/assets/enemies/boss_warden_master.jpg' },

  { src: 'camp_caravan_master_1790481940671.jpg', dest: 'public/assets/camp_master.jpg' },
  { src: 'arena_battle_master_1790481960448.jpg', dest: 'public/assets/arena_master.jpg' },
  { src: 'hero_vael_bust_1790482038319.jpg', dest: 'public/assets/vael_master.jpg' },
  { src: 'hero_seris_bust_1790482138629.jpg', dest: 'public/assets/seris_master.jpg' },
  { src: 'hero_mirel_bust_1790482154107.jpg', dest: 'public/assets/mirel_master.jpg' },
  { src: 'boss_warden_bust_1790482169909.jpg', dest: 'public/assets/boss_warden_master.jpg' },

  // Production Sprite Sheets
  { brainDir: 'C:\\Users\\정현아\\.gemini\\antigravity-ide\\brain\\740c0a6b-bd33-415c-9b98-f7d5b7789e96', src: 'vael_sprite_sheet_1790492898061.jpg', dest: 'src/assets/heroes/vael_sprites.jpg' },
  { brainDir: 'C:\\Users\\정현아\\.gemini\\antigravity-ide\\brain\\740c0a6b-bd33-415c-9b98-f7d5b7789e96', src: 'seris_sprite_sheet_1790492957242.jpg', dest: 'src/assets/heroes/seris_sprites.jpg' },
  { brainDir: 'C:\\Users\\정현아\\.gemini\\antigravity-ide\\brain\\740c0a6b-bd33-415c-9b98-f7d5b7789e96', src: 'mirel_sprite_sheet_1790492975483.jpg', dest: 'src/assets/heroes/mirel_sprites.jpg' },
  { brainDir: 'C:\\Users\\정현아\\.gemini\\antigravity-ide\\brain\\740c0a6b-bd33-415c-9b98-f7d5b7789e96', src: 'boss_warden_sprites_1790493045235.jpg', dest: 'src/assets/enemies/boss_warden_sprites.jpg' },

  { brainDir: 'C:\\Users\\정현아\\.gemini\\antigravity-ide\\brain\\740c0a6b-bd33-415c-9b98-f7d5b7789e96', src: 'vael_sprite_sheet_1790492898061.jpg', dest: 'public/assets/vael_sprites.jpg' },
  { brainDir: 'C:\\Users\\정현아\\.gemini\\antigravity-ide\\brain\\740c0a6b-bd33-415c-9b98-f7d5b7789e96', src: 'seris_sprite_sheet_1790492957242.jpg', dest: 'public/assets/seris_sprites.jpg' },
  { brainDir: 'C:\\Users\\정현아\\.gemini\\antigravity-ide\\brain\\740c0a6b-bd33-415c-9b98-f7d5b7789e96', src: 'mirel_sprite_sheet_1790492975483.jpg', dest: 'public/assets/mirel_sprites.jpg' },
  { brainDir: 'C:\\Users\\정현아\\.gemini\\antigravity-ide\\brain\\740c0a6b-bd33-415c-9b98-f7d5b7789e96', src: 'boss_warden_sprites_1790493045235.jpg', dest: 'public/assets/boss_warden_sprites.jpg' },
];

function syncAssets() {
  for (const m of assetMappings) {
    const src = path.join(m.brainDir || brainDir, m.src);
    const dest = path.resolve(__dirname, m.dest);
    try {
      if (fs.existsSync(src)) {
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        if (!fs.existsSync(dest) || fs.statSync(src).size !== fs.statSync(dest).size) {
          fs.copyFileSync(src, dest);
        }
      }
    } catch (_) {}
  }

  // Also sync guidelines from 9-baseball-1 if available locally
  const guidelines = [
    { src: 'C:\\Users\\정현아\\9-baseball-1\\docs\\gemini\\GEMINI-MASTERPIECE-AUTODEV-LOOP.md', dest: 'docs/gemini/GEMINI-MASTERPIECE-AUTODEV-LOOP.md' },
    { src: 'C:\\Users\\정현아\\9-baseball-1\\docs\\art\\QUALITY-BAR.md', dest: 'docs/art/QUALITY-BAR.md' },
    { src: 'C:\\Users\\정현아\\9-baseball-1\\docs\\art\\QUALITY-LOG.md', dest: 'docs/art/QUALITY-LOG.md' },
  ];

  for (const g of guidelines) {
    try {
      if (fs.existsSync(g.src)) {
        const destPath = path.resolve(__dirname, g.dest);
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(g.src, destPath);
      }
    } catch (_) {}
  }
}

syncAssets();

export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'sync-master-assets-plugin',
      buildStart() {
        syncAssets();
      }
    }
  ]
});

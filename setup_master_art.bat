@echo off
chcp 65001 > nul
echo ========================================================
echo [PROJECT GUILDFALL] Syncing Master Art Assets (AI Generated)
echo ========================================================

set BRAIN_DIR=C:\Users\정현아\.gemini\antigravity-ide\brain\e315f9d0-c7f8-4c92-ae89-08a8677f50e8
set TARGET_DIR=%~dp0

echo Source: %BRAIN_DIR%
echo Target: %TARGET_DIR%

if not exist "%TARGET_DIR%src\assets\scenes" mkdir "%TARGET_DIR%src\assets\scenes"
if not exist "%TARGET_DIR%src\assets\heroes" mkdir "%TARGET_DIR%src\assets\heroes"
if not exist "%TARGET_DIR%src\assets\enemies" mkdir "%TARGET_DIR%src\assets\enemies"
if not exist "%TARGET_DIR%public\assets" mkdir "%TARGET_DIR%public\assets"

copy /Y "%BRAIN_DIR%\camp_caravan_master_1790481940671.jpg" "%TARGET_DIR%src\assets\scenes\camp_master.jpg"
copy /Y "%BRAIN_DIR%\arena_battle_master_1790481960448.jpg" "%TARGET_DIR%src\assets\scenes\arena_master.jpg"
copy /Y "%BRAIN_DIR%\hero_vael_bust_1790482038319.jpg" "%TARGET_DIR%src\assets\heroes\vael_master.jpg"
copy /Y "%BRAIN_DIR%\hero_seris_bust_1790482138629.jpg" "%TARGET_DIR%src\assets\heroes\seris_master.jpg"
copy /Y "%BRAIN_DIR%\hero_mirel_bust_1790482154107.jpg" "%TARGET_DIR%src\assets\heroes\mirel_master.jpg"
copy /Y "%BRAIN_DIR%\boss_warden_bust_1790482169909.jpg" "%TARGET_DIR%src\assets\enemies\boss_warden_master.jpg"

copy /Y "%BRAIN_DIR%\camp_caravan_master_1790481940671.jpg" "%TARGET_DIR%public\assets\camp_master.jpg"
copy /Y "%BRAIN_DIR%\arena_battle_master_1790481960448.jpg" "%TARGET_DIR%public\assets\arena_master.jpg"
copy /Y "%BRAIN_DIR%\hero_vael_bust_1790482038319.jpg" "%TARGET_DIR%public\assets\vael_master.jpg"
copy /Y "%BRAIN_DIR%\hero_seris_bust_1790482138629.jpg" "%TARGET_DIR%public\assets\seris_master.jpg"
copy /Y "%BRAIN_DIR%\hero_mirel_bust_1790482154107.jpg" "%TARGET_DIR%public\assets\mirel_master.jpg"
copy /Y "%BRAIN_DIR%\boss_warden_bust_1790482169909.jpg" "%TARGET_DIR%public\assets\boss_warden_master.jpg"

echo.
echo [SUCCESS] All 6 Master Art Assets Synced Successfully!
echo.
pause

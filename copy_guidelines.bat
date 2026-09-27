@echo off
chcp 65001 > nul
echo ========================================================
echo [PROJECT GUILDFALL] Copying Guidelines from 9-baseball-1
echo ========================================================

set SRC_BASE=c:\Users\정현아\9-baseball-1
set TARGET_BASE=%~dp0

if not exist "%TARGET_BASE%docs\gemini" mkdir "%TARGET_BASE%docs\gemini"
if not exist "%TARGET_BASE%docs\art" mkdir "%TARGET_BASE%docs\art"
if not exist "%TARGET_BASE%docs\design" mkdir "%TARGET_BASE%docs\design"

if exist "%SRC_BASE%\docs\gemini\GEMINI-MASTERPIECE-AUTODEV-LOOP.md" (
    copy /Y "%SRC_BASE%\docs\gemini\GEMINI-MASTERPIECE-AUTODEV-LOOP.md" "%TARGET_BASE%docs\gemini\GEMINI-MASTERPIECE-AUTODEV-LOOP.md"
    echo [OK] Copied GEMINI-MASTERPIECE-AUTODEV-LOOP.md
)

if exist "%SRC_BASE%\docs\art\QUALITY-BAR.md" (
    copy /Y "%SRC_BASE%\docs\art\QUALITY-BAR.md" "%TARGET_BASE%docs\art\QUALITY-BAR.md"
    echo [OK] Copied QUALITY-BAR.md
)

if exist "%SRC_BASE%\docs\art\QUALITY-LOG.md" (
    copy /Y "%SRC_BASE%\docs\art\QUALITY-LOG.md" "%TARGET_BASE%docs\art\QUALITY-LOG.md"
    echo [OK] Copied QUALITY-LOG.md
)

echo.
echo [DONE] Guidelines successfully copied into project-guildfall\docs!
echo.
pause

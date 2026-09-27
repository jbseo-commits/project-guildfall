@echo off
chcp 65001 > nul
echo ========================================================
echo [PROJECT GUILDFALL] Git Commit and Push to GitHub
echo ========================================================

cd /d "%~dp0"

echo [1/3] Staging changes...
git add .

echo [2/3] Committing changes...
git commit -m "feat: master art, loop engineering, and sprite-gen integration"

echo [3/3] Pushing to GitHub...
git push origin main

echo.
echo ========================================================
echo [SUCCESS] Push completed! GitHub Actions / Vercel will now deploy.
echo ========================================================
pause

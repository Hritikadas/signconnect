@echo off
echo Creating repository on GitHub and pushing...
echo.

echo Creating repository...
gh repo create signconnect --public --description "🤟 AI-Powered Sign Language Interpreter Platform with Real-time Video Conferencing" --source=. --remote=origin --push

echo.
echo ✅ Repository created and code pushed!
echo 🌐 Repository URL: https://github.com/Hritikadas/signconnect
echo.
pause
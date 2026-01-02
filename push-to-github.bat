@echo off
echo Pushing SignConnect to GitHub...
echo.

echo Adding remote origin...
git remote add origin https://github.com/Hritikadas/signconnect.git

echo Pushing to GitHub...
git push -u origin master

echo.
echo ✅ Successfully pushed to GitHub!
echo 🌐 Repository URL: https://github.com/Hritikadas/signconnect
echo.
pause
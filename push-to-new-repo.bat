@echo off
echo ========================================
echo  SignConnect - GitHub Repository Setup
echo ========================================
echo.

set /p REPO_URL="Enter your GitHub repository URL: "

echo.
echo Adding remote origin...
git remote add origin %REPO_URL%

echo.
echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo  Repository setup complete!
echo  Your SignConnect project is now on GitHub
echo ========================================
echo.
echo Repository URL: %REPO_URL%
echo Local project: %CD%
echo.
pause
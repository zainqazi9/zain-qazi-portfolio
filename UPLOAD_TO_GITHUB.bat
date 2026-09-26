@echo off
title Zain Qazi - Upload Projects to GitHub
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0upload_all_to_github.ps1"
pause

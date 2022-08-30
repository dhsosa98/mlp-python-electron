@echo off
pyinstaller main.spec -y --distpath ../backend
rmdir /S /Q build
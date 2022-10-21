@echo off
pyinstaller main.spec -y --distpath ../mlp-perceptron
rmdir /S /Q build
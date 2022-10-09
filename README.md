# MLP PYTHON & ELECTRON

## Setup

Ensure you have Node and Python installed, then clone this repository. After it's cloned, navigate to the project's root directory on your computer and run the following scrips in a terminal application (e.g., Git Bash):

Install Python dependencies:
```
cd server && pip3 install -r requirements.txt
```

Install Node dependencies:
```
cd front && npm install
```

## Config

Electron: Electron's main.ts and renderer.ts files can be found in the project's root directory.

React: React files can be found in the ./src/ folder.

Python: Python scripts can be found in the ./server/ folder and used on events via REST calls.

## Running

For start the electron app, just run the following command:
```
cd front && npm run start
```

## Packaging

For packaging on Windows x32 and x64, just run:
```
cd front && npm run build
```

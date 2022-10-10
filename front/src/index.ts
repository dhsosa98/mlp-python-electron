import { app, BrowserWindow, ipcMain, Menu } from "electron";
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const isDev = require("electron-is-dev");

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow: BrowserWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.setBackgroundColor("#343B38");
  mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY + "#/");

  // Open the DevTools.
  
  mainWindow.webContents.openDevTools();

  ipcMain.handle("OPEN_MODAL", (_event) => {
    let win = new BrowserWindow({
      title: "Modal",
      width: 400,
      height: 400,
      modal: true,
    });

    win.setHasShadow(true);
    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY + "#/test");
    win.on("closed", () => {
      win = null;
    });
    win.show();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
import { PythonShell } from "python-shell";
import path from "path";

let python = null;

if (isDev) {
  const startPython = () => {
    const options = {
      scriptPath: path.join(__dirname, "../../../server"),
    };
    console.log(options);
    python = new PythonShell("main.py", options);
    return python;
  };
  startPython();
} else {
  const startPython = () => {
    const options = {
      pythonPath: path.join(
        __dirname,
        "../../../../../../../backend/py/server.exe"
      ),
    };
    console.log(options);
    python = new PythonShell(".", options);
    return python;
  };
  startPython();
}

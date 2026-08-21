const { app, BrowserWindow, ipcMain, screen } = require('electron');

let mainWindow;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: 320,
    height: 480,
    x: screenWidth - 340,
    y: 80,
    frame: false, // 无边框
    transparent: true, // 透明背景
    alwaysOnTop: true, // 常驻置顶
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');

  ipcMain.on('resize-window', (event, { height }) => {
    if (mainWindow) mainWindow.setSize(320, height, true);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

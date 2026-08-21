const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: 350,
    height: 520,
    x: width - 380,
    y: 100,
    frame: false,            // 无边框
    transparent: true,        // 背景透明
    alwaysOnTop: true,        // 置顶显示
    resizable: false,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  // 使用绝对路径加载 index.html，防止打成 exe 后找不到文件
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  ipcMain.on('resize-window', (event, { height }) => {
    if (mainWindow) {
      mainWindow.setSize(350, height, true);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 确保 Electron 准备就绪后创建窗口
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
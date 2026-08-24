const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

// 关键修复：关闭 GPU 硬件加速，防止透明窗口在 Windows 下渲染成完全隐形
app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: 350,
    height: 520,
    x: width - 380,
    y: 100,
    frame: false,             // 无边框
    transparent: true,         // 背景透明
    alwaysOnTop: true,         // 置顶显示
    resizable: false,
    skipTaskbar: false,
    backgroundColor: '#00000000', // 显式声明全透明十六进制背景，防止渲染异常
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  // 加载 index.html
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // 调试辅助：如果仍然看不到，取消下一行的注释可以强行打开控制台查看报错
  // mainWindow.webContents.openDevTools({ mode: 'detach' });

  ipcMain.on('resize-window', (event, { height }) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
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

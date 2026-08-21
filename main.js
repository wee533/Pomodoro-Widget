const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // 获取屏幕尺寸，用于设置默认位置
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    // --- 真正的桌面悬浮核心配置 ---
    width: 350,               // 初始宽度，稍微宽一点留白
    height: 500,              // 初始高度
    x: width - 380,          // 默认靠右
    y: 100,                  // 默认靠上
    
    frame: false,             // 1. 无边框 (必选)
    transparent: true,         // 2. 真正透明 (必选)
    alwaysOnTop: true,         // 3. 始终置顶 (必选)
    
    resizable: false,         // 不允许用户拉伸调整大小
    skipTaskbar: true,        // 可选：不在任务栏显示图标（更像个挂件）
    hasShadow: false,         // 移除默认阴影，我们用 CSS 自己写阴影

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');

  // --- 关键：允许网页内容通过 CSS 拖拽整个窗口 ---
  // 这允许我们在网页内部通过 -webkit-app-region: drag 来拖动整个 .exe 窗口
  // 注意：在 Mac 上默认开启，但在 Windows 上有些版本需要显式处理，这里我们依靠 CSS。

  // 监听网页发来的“缩小/放大”请求以调整窗口大小
  ipcMain.on('resize-window', (event, { height }) => {
    if (mainWindow) {
      mainWindow.setSize(350, height, true);
    }
  });

  // 如果需要完全点击穿透（即除了卡片部分，其他透明区域点击会点到后面的桌面），可以开启以下代码：
  // mainWindow.setIgnoreMouseEvents(true, { forward: true });
  // 但这样会导致你无法点击卡片内部的按钮。通常不需要开启。

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

const {app, BrowserWindow, Menu, dialog} = require('electron');
const url = require('url');

let win = null;
let word = "";
let isReady = false;

function createWindow () {
  isReady = true;

  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 450
  });

  win.loadURL(`file://${__dirname}/haloword/main.html#${word}`);

  word = "";

  win.on('closed', () => {
    win = null
  });

  // menu
  var menuTemplate = [
    {
      label: "Halo Word",
      submenu: [
        {
          label: "About Halo Word",
          selector: "orderFrontStandardAboutPanel:"
        },
        {
          type: "separator"
        },
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          selector: "undo:"
        },
        {
          label: "Redo",
          accelerator: "Shift+CmdOrCtrl+Z",
          selector: "redo:"
        },
        {
          type: "separator"
        },
        {
          label: "Cut",
          accelerator: "CmdOrCtrl+X",
          selector: "cut:"
        },
        {
          label: "Copy",
          accelerator: "CmdOrCtrl+C",
          selector: "copy:"
        },
        {
          label: "Paste",
          accelerator: "CmdOrCtrl+V",
          selector: "paste:"
        },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:"
        }
      ]
    }
  ];

  if (process.platform !== 'darwin') {
    // need investigate other platform
    // TODO: window, help, services menu on macOS
    menuTemplate.shift()
  } else {
    menuTemplate.push({
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

function lookupWord(w) {
  if (win === null) {
    word = w;

    if (isReady) {
      createWindow();
    }

  } else {
    win.webContents.executeJavaScript(`window.location.hash = "#${w}"`);
  }
}

app.setAsDefaultProtocolClient('haloword')

app.on('open-url', (event, u) => {
  const parsed = url.parse(u, true);

  if (parsed.query["word"] !== undefined) {
    lookupWord(parsed.query["word"])
  }

  event.preventDefault();
});

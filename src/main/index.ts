/**
 * Electron Main Process
 */

import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import { IPC_CHANNELS } from '../shared/constants/ipc';
import type { DirEntry, ReadDirResponse, GetCwdResponse } from '../shared/types';

let mainWindow: BrowserWindow | null = null;
let currentDirectory: string = process.cwd();

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // In development, load from Vite dev server
  // In production, load from built files
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.handle(IPC_CHANNELS.GET_CWD, async (): Promise<GetCwdResponse> => {
  try {
    return {
      success: true,
      path: currentDirectory,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

ipcMain.handle(
  IPC_CHANNELS.READ_DIR,
  async (_event, dirPath?: string): Promise<ReadDirResponse> => {
    try {
      const targetPath = dirPath || currentDirectory;
      const entries = await fs.readdir(targetPath, { withFileTypes: true });

      const dirEntries: DirEntry[] = await Promise.all(
        entries.map(async (entry) => {
          const fullPath = path.join(targetPath, entry.name);
          const stats = await fs.stat(fullPath);
          return {
            name: entry.name,
            isDirectory: entry.isDirectory(),
            size: stats.size,
            modifiedAt: stats.mtime.toISOString(),
          };
        })
      );

      return {
        success: true,
        entries: dirEntries,
        path: targetPath,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        path: dirPath || currentDirectory,
      };
    }
  }
);

ipcMain.handle(IPC_CHANNELS.CHANGE_DIR, async (_event, dirPath: string): Promise<GetCwdResponse> => {
  try {
    const resolvedPath = path.resolve(currentDirectory, dirPath);
    const stats = await fs.stat(resolvedPath);

    if (!stats.isDirectory()) {
      return {
        success: false,
        error: 'Path is not a directory',
      };
    }

    currentDirectory = resolvedPath;
    return {
      success: true,
      path: currentDirectory,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

// App lifecycle
app.whenReady().then(createWindow);

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

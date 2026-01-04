/**
 * Electron Preload Script
 * WHY: Exposes safe IPC API to renderer process via contextBridge
 */

import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants/ipc';
import type { ReadDirResponse, GetCwdResponse } from '../shared/types';

// Expose protected API to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getCwd: (): Promise<GetCwdResponse> => ipcRenderer.invoke(IPC_CHANNELS.GET_CWD),

  readDir: (dirPath?: string): Promise<ReadDirResponse> =>
    ipcRenderer.invoke(IPC_CHANNELS.READ_DIR, dirPath),

  changeDir: (dirPath: string): Promise<GetCwdResponse> =>
    ipcRenderer.invoke(IPC_CHANNELS.CHANGE_DIR, dirPath),
});

// Type definitions for renderer
export interface ElectronAPI {
  getCwd: () => Promise<GetCwdResponse>;
  readDir: (dirPath?: string) => Promise<ReadDirResponse>;
  changeDir: (dirPath: string) => Promise<GetCwdResponse>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

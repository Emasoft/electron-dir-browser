/**
 * Shared TypeScript types for Electron IPC
 */

export interface DirEntry {
  name: string;
  isDirectory: boolean;
  size: number;
  modifiedAt: string;
}

export interface ReadDirResponse {
  success: boolean;
  entries?: DirEntry[];
  error?: string;
  path: string;
}

export interface GetCwdResponse {
  success: boolean;
  path?: string;
  error?: string;
}

/**
 * IPC channel name constants
 * WHY: Centralized constants prevent typos and ensure type safety
 */

export const IPC_CHANNELS = {
  READ_DIR: 'fs:readDir',
  GET_CWD: 'fs:getCwd',
  CHANGE_DIR: 'fs:changeDir',
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];

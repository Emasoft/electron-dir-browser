/**
 * Tests for IPC channel constants
 */

import { describe, it, expect } from 'vitest';
import { IPC_CHANNELS } from '../src/shared/constants/ipc';

describe('IPC Channels', () => {
  it('should have READ_DIR channel defined', () => {
    expect(IPC_CHANNELS.READ_DIR).toBe('fs:readDir');
  });

  it('should have GET_CWD channel defined', () => {
    expect(IPC_CHANNELS.GET_CWD).toBe('fs:getCwd');
  });

  it('should have CHANGE_DIR channel defined', () => {
    expect(IPC_CHANNELS.CHANGE_DIR).toBe('fs:changeDir');
  });

  it('should have all channel names prefixed with fs:', () => {
    const channels = Object.values(IPC_CHANNELS);
    channels.forEach((channel) => {
      expect(channel).toMatch(/^fs:/);
    });
  });

  it('should have unique channel names', () => {
    const channels = Object.values(IPC_CHANNELS);
    const uniqueChannels = new Set(channels);
    expect(uniqueChannels.size).toBe(channels.length);
  });
});

/**
 * Renderer Process Main Script
 */

import type { DirEntry } from '../shared/types';

const elements = {
  currentPath: document.getElementById('current-path') as HTMLDivElement,
  fileList: document.getElementById('file-list') as HTMLUListElement,
  loading: document.getElementById('loading') as HTMLDivElement,
  error: document.getElementById('error') as HTMLDivElement,
  btnParent: document.getElementById('btn-parent') as HTMLButtonElement,
  btnRefresh: document.getElementById('btn-refresh') as HTMLButtonElement,
  btnHome: document.getElementById('btn-home') as HTMLButtonElement,
};

let currentPath: string = '';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function showError(message: string): void {
  elements.error.textContent = message;
  elements.error.style.display = 'block';
  setTimeout(() => {
    elements.error.style.display = 'none';
  }, 5000);
}

function renderFileList(entries: DirEntry[]): void {
  elements.fileList.innerHTML = '';
  elements.loading.style.display = 'none';

  // Sort: directories first, then alphabetically
  const sorted = [...entries].sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name);
  });

  sorted.forEach((entry) => {
    const li = document.createElement('li');
    li.className = `file-entry ${entry.isDirectory ? 'directory' : 'file'}`;

    const nameSpan = document.createElement('span');
    nameSpan.textContent = entry.name;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'file-info';

    if (!entry.isDirectory) {
      const sizeSpan = document.createElement('span');
      sizeSpan.textContent = formatBytes(entry.size);
      infoDiv.appendChild(sizeSpan);
    }

    const dateSpan = document.createElement('span');
    dateSpan.textContent = formatDate(entry.modifiedAt);
    infoDiv.appendChild(dateSpan);

    li.appendChild(nameSpan);
    li.appendChild(infoDiv);

    if (entry.isDirectory) {
      li.addEventListener('click', () => {
        navigateToDirectory(entry.name);
      });
    }

    elements.fileList.appendChild(li);
  });
}

async function loadCurrentDirectory(): Promise<void> {
  elements.loading.style.display = 'block';
  elements.fileList.innerHTML = '';

  try {
    const response = await window.electronAPI.readDir();

    if (response.success && response.entries) {
      currentPath = response.path;
      elements.currentPath.textContent = currentPath;
      renderFileList(response.entries);
    } else {
      showError(response.error || 'Failed to read directory');
      elements.loading.style.display = 'none';
    }
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Unknown error');
    elements.loading.style.display = 'none';
  }
}

async function navigateToDirectory(dirName: string): Promise<void> {
  try {
    const response = await window.electronAPI.changeDir(dirName);

    if (response.success) {
      await loadCurrentDirectory();
    } else {
      showError(response.error || 'Failed to navigate');
    }
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Unknown error');
  }
}

async function goToParentDirectory(): Promise<void> {
  await navigateToDirectory('..');
}

async function goToHomeDirectory(): Promise<void> {
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE || '/';
    const response = await window.electronAPI.changeDir(homeDir);

    if (response.success) {
      await loadCurrentDirectory();
    } else {
      showError(response.error || 'Failed to navigate to home');
    }
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Unknown error');
  }
}

// Event listeners
elements.btnParent.addEventListener('click', goToParentDirectory);
elements.btnRefresh.addEventListener('click', loadCurrentDirectory);
elements.btnHome.addEventListener('click', goToHomeDirectory);

// Initial load
loadCurrentDirectory();

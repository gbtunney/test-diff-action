import * as core from '@actions/core';
import {
  getChangedFiles,
  getIgnoreFilter,
  isRepoClean,
  FileInfo,
} from './utils.js';

async function run(): Promise<void> {
  try {
    const logRepo = core.getInput('LOGGING_REPO') === 'true';
    const logAll = core.getInput('LOGGING_ALL') === 'true';
    const logIgnored = core.getInput('LOGGING_REPO_IGNORED') === 'true';

    const allChanged = getChangedFiles();
    const ignores = getIgnoreFilter();

    const repoFiles: FileInfo[] = [];
    const ignoredFiles: FileInfo[] = [];

    for (const file of allChanged) {
      if (ignores(file.file)) ignoredFiles.push(file);
      else repoFiles.push(file);
    }

    core.setOutput('REPO_CLEAN', isRepoClean());
    core.setOutput('ALL_CHANGED_FILES', JSON.stringify(allChanged));
    core.setOutput('REPO_FILES', JSON.stringify(repoFiles));
    core.setOutput('IGNORED_FILES', JSON.stringify(ignoredFiles));

    if (logRepo) console.log('📁 Repo Files:', repoFiles);
    if (logAll) console.log('📝 All Changed:', allChanged);
    if (logIgnored) console.log('🚫 Ignored:', ignoredFiles);
  } catch (err) {
    core.setFailed(err instanceof Error ? err.message : String(err));
  }
}

run();

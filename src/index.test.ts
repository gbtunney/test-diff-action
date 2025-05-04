import { describe, it, expect, vi } from 'vitest';
import * as core from '@actions/core';
import * as utils from '../src/utils.js';
import '../src/index.js';

vi.mock('@actions/core');
vi.mock('../src/utils.js');

describe('index.ts full run', () => {
  it('outputs correct values', async () => {
    vi.mocked(utils.getChangedFiles).mockReturnValue([
      { file: 'src/test.ts', flagged: 'MODIFIED', elapsed_seconds: 12 },
      { file: 'dist/test.js', flagged: 'MODIFIED', elapsed_seconds: 5 },
    ]);
    vi.mocked(utils.getIgnoreFilter).mockReturnValue((filepath: string) => filepath.startsWith('dist'));
    vi.mocked(utils.isRepoClean).mockReturnValue(true);

    await import('../src/index.js');

    expect(core.setOutput).toHaveBeenCalledWith('REPO_CLEAN', true);
    expect(core.setOutput).toHaveBeenCalledWith(
      'REPO_FILES',
      JSON.stringify([{ file: 'src/test.ts', flagged: 'MODIFIED', elapsed_seconds: 12 }])
    );
    expect(core.setOutput).toHaveBeenCalledWith(
      'IGNORED_FILES',
      JSON.stringify([{ file: 'dist/test.js', flagged: 'MODIFIED', elapsed_seconds: 5 }])
    );
  });
});

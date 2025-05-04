import * as core from '@actions/core'
import { describe, expect, it, vi } from 'vitest'
import * as utils from './../src/utils.js'
import './../src/index.js'

vi.mock('@actions/core')
vi.mock('../src/utils.js')

describe('index.ts full run', () => {
    it('outputs correct values', async () => {
        vi.mocked(utils.getChangedFiles).mockReturnValue([
            { elapsed_seconds: 12, file: 'src/test.ts', flagged: 'MODIFIED' },
            { elapsed_seconds: 5, file: 'dist/test.js', flagged: 'MODIFIED' },
        ])
        vi.mocked(utils.getIgnoreFilter).mockReturnValue((filepath: string) =>
            filepath.startsWith('dist'),
        )
        vi.mocked(utils.isRepoClean).mockReturnValue(true)

        await import('../src/index.js')
        expect(core.setOutput).toHaveBeenCalledWith('REPO_CLEAN', true)
        expect(core.setOutput).toHaveBeenCalledWith(
            'REPO_FILES',
            JSON.stringify([
                {
                    elapsed_seconds: 12,
                    file: 'src/test.ts',
                    flagged: 'MODIFIED',
                },
            ]),
        )
        expect(core.setOutput).toHaveBeenCalledWith(
            'IGNORED_FILES',
            JSON.stringify([
                {
                    elapsed_seconds: 5,
                    file: 'dist/test.js',
                    flagged: 'MODIFIED',
                },
            ]),
        )
    })
})

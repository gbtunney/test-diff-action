import { describe, expect, it, vi } from 'vitest'
import { execSync } from 'child_process'
import * as utils from '../src/utils.js'

vi.mock('child_process')
vi.mock('fs', async () => {
    const actual = await vi.importActual<typeof import('fs')>('fs')
    return {
        ...actual,
        existsSync: vi.fn((path) => path !== 'ignored-file'),
        readFileSync: vi.fn(() => 'dist\nignored/'),
        statSync: vi.fn(() => ({ mtimeMs: Date.now() - 5000 })),
    }
})

describe('utils', () => {
    it('parses changed files and flags them', () => {
        vi.mocked(execSync).mockImplementation((cmd) => {
            if (String(cmd).includes('diff')) {
                return Buffer.from('A\tnew-file.ts\nM\tchanged-file.ts')
            }
            if (String(cmd).includes('status')) {
                return Buffer.from('')
            }
            return Buffer.from('')
        })

        const files = utils.getChangedFiles()
        expect(files).toHaveLength(2)
        expect(files[0]?.flagged).toBe('NEW')
        expect(files[1]?.flagged).toBe('MODIFIED')
    })

    it('detects clean repo', () => {
        vi.mocked(execSync).mockReturnValue(Buffer.from(''))
        expect(utils.isRepoClean()).toBe(true)
    })

    it('filters ignored files', () => {
        const ignores = utils.getIgnoreFilter()
        expect(ignores('dist/main.js')).toBe(true)
        expect(ignores('src/app.ts')).toBe(false)
    })
})

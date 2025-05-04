import * as core from '@actions/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

vi.mock('@actions/core', () => ({
    endGroup: vi.fn(),
    getInput: vi.fn((key: string) => {
        const inputMap: Record<string, string> = {
            CHANGED_INCLUDES: 'dist,docs',
            LOGGING_ALL: 'true',
            LOGGING_REPO: 'true',
            LOGGING_REPO_IGNORED: 'true',
        }
        return inputMap[key] ?? ''
    }),
    info: vi.fn(),
    setFailed: vi.fn(),
    setOutput: vi.fn(),
    startGroup: vi.fn(),
}))

vi.mock('@actions/github', () => ({
    context: {
        eventName: 'push',
        payload: {},
    },
}))

describe('index.ts full run', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('outputs correct values', async () => {
        await import('./index.js')

        expect(core.setOutput).toHaveBeenCalledWith(
            'REPO_CLEAN',
            expect.any(Boolean),
        )

        const outputCalls = (core.setOutput as Mock).mock.calls
        const repoFilesCall = outputCalls.find(
            (args) => args[0] === 'REPO_FILES',
        )
        const repoFiles = repoFilesCall?.[1]

        expect(Array.isArray(repoFiles)).toBe(true)
        expect(repoFiles.length).toBeGreaterThan(0)

        for (const file of repoFiles) {
            expect(file).toHaveProperty('file')
            expect(file).toHaveProperty('flagged')
        }
    })
})

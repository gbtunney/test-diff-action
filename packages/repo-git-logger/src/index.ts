import * as core from '@actions/core'

type ChangedFile = {
    file: string
    flagged: 'MODIFIED' | 'NEW'
    elapsed_seconds: number
}

function run(): void {
    try {
        const LOGGING_REPO = core.getInput('LOGGING_REPO') === 'true'
        const LOGGING_ALL = core.getInput('LOGGING_ALL') === 'true'
        const LOGGING_REPO_IGNORED =
            core.getInput('LOGGING_REPO_IGNORED') === 'true'
        const includesRaw = core.getInput('CHANGED_INCLUDES') || ''
        const includes = includesRaw
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)

        const allChangedFiles: Array<ChangedFile> = [
            {
                elapsed_seconds: 12,
                file: 'packages/repo-git-logger/dist/index.js',
                flagged: 'MODIFIED',
            },
            {
                elapsed_seconds: 40,
                file: '.github/workflows/workflow-build.yml',
                flagged: 'MODIFIED',
            },
        ]

        const matchesIncludes = (filepath: string): boolean =>
            includes.length === 0 ||
            includes.some(
                (dir) =>
                    filepath === dir ||
                    filepath.startsWith(`${dir}/`) ||
                    filepath.includes(`/${dir}/`),
            )

        const repoFiles = allChangedFiles.filter((f) => matchesIncludes(f.file))
        const ignoredFiles = allChangedFiles.filter(
            (f) => !repoFiles.includes(f),
        )

        if (LOGGING_ALL) {
            core.info(
                `📝 All Changed: ${JSON.stringify(allChangedFiles, null, 2)}`,
            )
        }

        if (LOGGING_REPO) {
            core.info(`📁 Repo Files: ${JSON.stringify(repoFiles, null, 2)}`)
        }

        if (LOGGING_REPO_IGNORED) {
            core.info(`🚫 Ignored: ${JSON.stringify(ignoredFiles, null, 2)}`)
        }

        core.setOutput('REPO_FILES', repoFiles)
        core.setOutput('ALL_CHANGED_FILES', allChangedFiles)
        core.setOutput('IGNORED_FILES', ignoredFiles)
        core.setOutput('REPO_CLEAN', repoFiles.length === 0)
    } catch (error: unknown) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        } else {
            core.setFailed(String(error))
        }
    }
}

run()

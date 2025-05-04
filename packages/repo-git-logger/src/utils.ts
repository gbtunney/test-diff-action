import ignore from 'ignore'
import { execSync } from 'child_process'
import { existsSync, readFileSync, statSync } from 'fs'

export type FileInfo = {
    file: string
    flagged: 'NEW' | 'MODIFIED'
    elapsed_seconds: number | null
}

export function getChangedFiles(): Array<FileInfo> {
    const output = execSync('git diff --name-status HEAD^ HEAD').toString()
    return output
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((line) => {
            const [status, filebk] = line.split('\t')
            const file: string = filebk ? filebk : ''
            const flagged = status === 'A' ? 'NEW' : 'MODIFIED'
            const stats = existsSync(file) ? statSync(file) : null
            const elapsed_seconds = stats
                ? Math.floor((Date.now() - stats.mtimeMs) / 1000)
                : null
            return { elapsed_seconds, file, flagged }
        })
}

export function getIgnoreFilter(): (filepath: string) => boolean {
    const ig = ignore()
    if (existsSync('.gitignore')) {
        ig.add(readFileSync('.gitignore').toString())
    }
    return (filepath: string) => ig.ignores(filepath)
}

export function isRepoClean(): boolean {
    const status = execSync('git status --porcelain').toString()
    return status.trim() === ''
}

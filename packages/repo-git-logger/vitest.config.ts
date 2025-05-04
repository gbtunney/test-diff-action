import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            all: true,
            include: ['./src/**/*.{ts,js}'],
            reporter: ['text', 'html'],
        },
        environment: 'node',
        globals: true,
        include: ['**/*.test.ts'],
    },
})

import { defineConfig } from 'vite';
import { ModuleFormat } from 'rollup';

const ext = (format: ModuleFormat) => format === 'es' ? 'mjs' : 'js';

export default defineConfig({
    build: {
        lib: {
            entry: '/src/index.ts',
            name: 'shapeit',
            fileName: format => `shapeit.${format}.${ext(format)}`
        }
    }
});

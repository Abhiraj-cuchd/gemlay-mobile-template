import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    // Ignore patterns
    {
        ignores: [
            'node_modules/**',
            '.expo/**',
            '.expo-shared/**',
            'dist/**',
            'build/**',
            'coverage/**',
            '*.lock',
            'babel.config.js',
            'metro.config.js',
            'tailwind.config.js',
            'commitlint.config.js',
        ],
    },

    // Base ESLint recommended config
    js.configs.recommended,

    // TypeScript configs
    ...tseslint.configs.recommended,

    // Main configuration
    {
        files: ['**/*.{js,jsx,ts,tsx}'],

        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                // Node.js globals
                __dirname: 'readonly',
                __filename: 'readonly',
                console: 'readonly',
                module: 'readonly',
                require: 'readonly',
                process: 'readonly',
                exports: 'readonly',
                global: 'readonly',

                // Browser/React Native globals
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                fetch: 'readonly',
                FormData: 'readonly',
                Headers: 'readonly',
                Request: 'readonly',
                Response: 'readonly',
                URL: 'readonly',
                URLSearchParams: 'readonly',
                AbortController: 'readonly',

                // React
                React: 'readonly',
                JSX: 'readonly',
            },
        },

        plugins: {
            react,
            'react-hooks': reactHooks,
            prettier,
        },

        rules: {
            // Prettier
            'prettier/prettier': 'error',

            // React rules
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/display-name': 'off',

            // React Hooks rules
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // TypeScript rules
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-require-imports': 'off',

            // General rules
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-unused-vars': 'off', // Use TypeScript's no-unused-vars instead
        },

        settings: {
            react: {
                version: 'detect',
            },
        },
    },

    // Prettier config (must be last to override other configs)
    prettierConfig,
];
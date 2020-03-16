module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: './projects/lib/tsconfig.spec.json',
            stringifyContentPathRegex: '\\.html$',
            astTransformers: [
                'jest-preset-angular/build/InlineFilesTransformer',
                'jest-preset-angular/build/StripStylesTransformer'
            ],
            diagnostics: {
                ignoreCodes: [151001]
            }
        },
    },
    transform: {
        '^.+\\.(ts|js|html)$': 'ts-jest'
    },
    setupFilesAfterEnv: [
        '<rootDir>/node_modules/@angular-builders/jest/dist/jest-config/setup.js'
    ],
    testMatch: [
        '**/+(*.)+(spec|test).+(ts|js)?(x)'
    ],
    moduleFileExtensions: ['ts', 'html', 'js', 'json'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^app/(.*)$': '<rootDir>/src/app/$1',
        '^assets/(.*)$': '<rootDir>/src/assets/$1',
        '^environments/(.*)$': '<rootDir>/src/environments/$1',
    },
    transformIgnorePatterns: ['node_modules/(?!@ngrx)'],
    snapshotSerializers: [
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js',
    ],
};

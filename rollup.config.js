import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";
import replace from '@rollup/plugin-replace';
import size from 'rollup-plugin-size';
import alias from "@rollup/plugin-alias";
import globals from 'rollup-plugin-node-globals';
import { visualizer } from 'rollup-plugin-visualizer';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const commitHash = (function () {
    try {
        return fs.readFileSync('.commithash', 'utf-8');
    } catch (err) {
        return 'unknown';
    }
})();

export function emitModulePackageFile() {
	return {
		name: 'emit-module-package-file',
		generateBundle() {
			this.emitFile({ type: 'asset', fileName: 'package.json', source: `{"type":"module"}` });
		}
	};
}

const prodBuild = process.env.prodbuild || false;
console.log("Prod build: ", prodBuild);

const now = new Date(
    process.env.SOURCE_DATE_EPOCH ? process.env.SOURCE_DATE_EPOCH * 1000 : new Date().getTime()
).toUTCString();

const banner = `/*
  @license
    PasarSDK.js v${pkg.version}
    ${now} - commit ${commitHash}

    Released under the MIT License.
*/`;

const onwarn = warning => {
    // eslint-disable-next-line no-console
    if (warning.code && warning.code === "CIRCULAR_DEPENDENCY" && warning.importer.indexOf('node_modules') < 0 && warning.importer.indexOf("internals.ts") >= 0)
        return; // TMP: don't get flooded by our "internals" circular dependencies for now

    if (warning.code && warning.code === "THIS_IS_UNDEFINED")
        return; // TMP: don't get flooded by this for now

    if (warning.code && warning.code === "EVAL")
        return; // TMP: don't get flooded by this for now

    console.warn("Rollup build warning:", warning);
};

const treeshake = {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false
};

const nodePlugins = [
    nodeResolve({
        preferBuiltins: true
    }),
    json({}),
    replace({
        delimiters: ['', ''],
        preventAssignment: true,
        exclude: [
            '/node_modules/rollup-plugin-node-polyfills/**/*.js',
            '/node_modules/rollup-plugin-polyfill-node/**/*.js',
        ],
        values: {}
    }),
    commonjs({}),
    typescript({
        sourceMap: !prodBuild,
        exclude: "*.browser.ts"
    }),
    ...prodBuild ? [
        terser()
    ] : [],
    size()
];

/**
 * main building routine here
 */

const rollupSourceFile = 'src/index.ts';

export default command => {
    const browserBuilds = {
        input: rollupSourceFile,
        onwarn,
        external: [
            'ipfs-http-client',
            '@elastosfoundation/essentials-connector-client-browser',
            '@elastosfoundation/elastos-connectivity-sdk-js',
            '@walletconnect/web3-provider',
            'bs58',
            'web3',
        ],
        plugins: [
            // IMPORTANT: DON'T CHANGE THE ORDER OF THINGS BELOW TOO MUCH! OTHERWISE YOU'LL GET
            // GOOD HEADACHES WITH RESOLVE ERROR, UNEXPORTED CLASSES AND SO ON...
            json(),
            // Replace fs with browser implementation.
            replace({
                delimiters: ['', ''],
                preventAssignment: true,
                include: [
                    'src/utils/storage/file.ts'
                ],
                values: {
                    'fs from "./fs"' : 'fs from "./fs.browser.ts"'
                }
            }),
            // Dirty circular dependency removal atttempt
            replace({
                delimiters: ['', ''],
                preventAssignment: true,
                include: [
                    'node_modules/assert/build/internal/errors.js'
                ],
                values: {
                    'require(\'../assert\')': 'null',
                }
            }),
            // Dirty hack to remove circular deps between brorand and crypto-browserify as in browser,
            // brorand doesn't use 'crypto' even if its source code includes it.
            replace({
                delimiters: ['', ''],
                preventAssignment: true,
                include: [
                    'node_modules/brorand/**/*.js'
                ],
                values: {
                    'require(\'crypto\')': 'null',
                }
            }),
            // Circular dependencies tips: https://github.com/rollup/rollup/issues/3816
            replace({
                delimiters: ['', ''],
                preventAssignment: true,
                values: {}
            }),
            alias({
                "entries": []
            }),
            nodeResolve({
                mainFields: ['browser', 'module', 'jsnext:main', 'main'],
                browser: true,
                preferBuiltins: true,
            }),
            // Polyfills needed to replace readable-stream with stream (circular dep)
            commonjs({
                esmExternals: true,
                transformMixedEsModules: true, // TMP trying to solve commonjs "circular dependency" errors at runtime
                dynamicRequireTargets: [],
            }),
            globals(),
            typescript({
                exclude: "*.node.ts"
            }),
            size(),
            ...prodBuild ? [
                terser()
            ] : [],
            visualizer({
                filename: "./browser-bundle-stats.html"
            }) // To visualize bundle dependencies sizes on a UI.
            // LATER terser({ module: true, output: { comments: 'some' } })
        ],
        treeshake,
        strictDeprecations: true,
        output: [
            {
                file: 'dist/pasar-sdk.browser.js',
                format: 'es',
                banner,
                sourcemap: !prodBuild,
            },
        ]
    };

    return [ browserBuilds];
};
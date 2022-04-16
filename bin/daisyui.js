#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import tailwindConfig from './tailwind.config.js';
import rtlcss from 'rtlcss';
import sveld from 'sveld';

const supportedFileExtensions = ['.svelte', '.scss', '.sass', '.js'];
const inputPath = './src/components';
const outputPath = './dist';

const argv = process.argv.splice(2);

if (argv[0] === '--watch') watch();
else if (argv[0] === '--build') build(inputPath);
else if (argv[0] === '--types') generateTypes();

/**
 * @param {string} input
 */
function watch(input) {
    const watcher = chokidar.watch();
    watcher.on('add', (path) => {});
    watcher.on('change', (path) => {});
    watcher.on('unlink', (path) => {
        // fs.unlinkSync(path);
    });
}

/**
 * @param {string} input
 */
async function build(input) {
    const filePaths = readSupportedFiles(input);
    for (const filePath of filePaths) await buildFile(filePath);
}

/**
 * @param {string} dir
 */
function readSupportedFiles(dir) {
    const files = fs.readdirSync(dir);
    const result = [];

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            result.push(...readSupportedFiles(filePath));
            continue;
        }

        const fileExt = path.extname(filePath);
        if (!supportedFileExtensions.includes(fileExt)) continue;

        result.push(filePath);
    }

    return result;
}

/**
 * @param {string} filePath
 */
async function buildFile(filePath) {
    const fileExt = path.extname(filePath);

    let compiledSource = '';

    if (fileExt === '.scss' || fileExt === '.sass') {
        compiledSource = await compileSASS(filePath);
        compiledSource = await transformCSS(compiledSource);
    }

    const source = readFile(filePath);

    if (fileExt === '.svelte') compiledSource = await compileSvelte(source);
    if (fileExt === '.js') compiledSource = await compileJS(source);

    writeFile(filePath, compiledSource);
}

/**
 * @param {string} filePath
 */
function readFile(filePath) {
    return fs.readFileSync(filePath).toString();
}

/**
 * @param {string} filePath
 * @param {string} content
 */
function writeFile(filePath, content) {
    if (!filePath.includes('button')) return;

    const relativePath = filePath.replace(path.join(inputPath), '');
    const ltrPath = path.join(outputPath, 'ltr', relativePath);
    const rtlPath = path.join(outputPath, 'rtl', relativePath);

    // console.log({ ltrPath, rtlPath });

    fs.writeFileSync(ltrPath, content);
    fs.writeFileSync(rtlPath, await convertToRTL(content));
}

/**
 * @param {string} source
 */
async function compileSvelte(source) {
    const sassImportsRegex = /\@import([\s]+)['"]([^'"]*).(scss|scss)['"];/gi;
    const sassImports = [...source.matchAll(sassImportsRegex)];

    for (const sassImport of sassImports) {
        const value = sassImport[0];
        const cssImport = value.replace('scss', 'css').replace('sass', 'css');
        source = source.replace(/(\s+)lang=['"](scss|sass)['"](\s*)/gi, '');
        source = source.replace(value, cssImport);
    }

    return source;
}

/**
 * @param {string} path
 */
async function compileSASS(path) {
    const { css } = sass.compile(path);
    return css;
}

/**
 * @param {string} source
 */
async function transformCSS(source) {
    const { css } = await postcss([
        tailwindcss(tailwindConfig),
        autoprefixer(),
    ]).process(source, {
        from: undefined,
    });
    return css;
}

/**
 * @param {string} source
 */
async function convertToRTL(source) {
    return rtlcss.process(source);
}

/**
 * @param {string} source
 */
async function compileJS(source) {
    return source;
}

/**
 *
 */
async function generateTypes() {
    sveld({
        input: path.join(inputPath, 'index.js'),
        typesOptions: { outDir: './types' },
    });
}

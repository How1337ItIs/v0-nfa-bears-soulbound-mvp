#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const docsRoot = path.resolve(__dirname, '..', 'docs');
const tocPath = path.join(docsRoot, 'TOC.md');

function listMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

function relativeFromDocs(fullPath) {
  return path.relative(docsRoot, fullPath).replace(/\\/g, '/');
}

function main() {
  if (!fs.existsSync(docsRoot)) {
    console.error('Docs folder not found:', docsRoot);
    process.exit(1);
  }
  const allMd = listMarkdownFiles(docsRoot);
  const lines = ['# Documentation TOC', ''];
  const rels = allMd.map(relativeFromDocs).sort();
  for (const rel of rels) {
    lines.push(`- [${rel}](${rel})`);
  }
  fs.writeFileSync(tocPath, lines.join('\n'), 'utf8');
  console.log('Generated TOC at', tocPath);
}

main();

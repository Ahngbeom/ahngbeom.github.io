import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const sourceRoot = path.join(rootDir, '_pages');
const targetRoot = path.join(rootDir, 'src', 'content', 'posts');

function toPosix(input) {
  return input.split(path.sep).join('/');
}

function extractFrontmatter(raw) {
  if (!raw.startsWith('---\n')) {
    return { frontmatter: '', body: raw };
  }

  const endIndex = raw.indexOf('\n---\n', 4);
  if (endIndex === -1) {
    return { frontmatter: '', body: raw };
  }

  const frontmatter = raw.slice(4, endIndex);
  const body = raw.slice(endIndex + 5);
  return { frontmatter, body };
}

function hasKey(frontmatter, key) {
  const keyRegex = new RegExp(`^${key}\\s*:`, 'm');
  return keyRegex.test(frontmatter);
}

function buildFrontmatter(frontmatter, relativePath) {
  const lines = frontmatter.trim() ? frontmatter.trim().split('\n') : [];
  const filename = path.basename(relativePath, path.extname(relativePath));
  const titleFromPath = filename.replace(/[-_]/g, ' ').trim();

  if (!hasKey(frontmatter, 'title')) {
    lines.push(`title: ${titleFromPath || 'Untitled'}`);
  }

  if (!hasKey(frontmatter, 'date')) {
    lines.push('date: 1900-01-01');
  }

  const legacyPath = `/${toPosix(relativePath.replace(/\.md$/i, '.html'))}`;
  if (!hasKey(frontmatter, 'legacy_url')) {
    lines.push(`legacy_url: ${legacyPath}`);
  }

  return lines.join('\n');
}

async function walk(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, files);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

await mkdir(targetRoot, { recursive: true });
await rm(targetRoot, { recursive: true, force: true });
await mkdir(targetRoot, { recursive: true });

const markdownFiles = await walk(sourceRoot);
let migratedCount = 0;
let skippedCount = 0;

for (const filePath of markdownFiles) {
  const relativePath = path.relative(sourceRoot, filePath);
  if (path.basename(filePath).toLowerCase() === 'index.md') {
    skippedCount += 1;
    continue;
  }

  const destinationPath = path.join(targetRoot, relativePath);
  await mkdir(path.dirname(destinationPath), { recursive: true });

  const raw = await readFile(filePath, 'utf8');
  const { frontmatter, body } = extractFrontmatter(raw);
  const nextFrontmatter = buildFrontmatter(frontmatter, relativePath);
  const normalizedBody = body.startsWith('\n') ? body : `\n${body}`;
  const output = `---\n${nextFrontmatter}\n---${normalizedBody}`;

  await writeFile(destinationPath, output, 'utf8');
  migratedCount += 1;
}

const generatedAt = new Date().toISOString();
const reportPath = path.join(rootDir, 'docs', 'astro-migration-report.md');
const sourceStat = await stat(sourceRoot);

const report = [
  '# Astro Migration Report',
  '',
  `- Generated at: ${generatedAt}`,
  `- Source root: ${sourceRoot}`,
  `- Source last modified: ${sourceStat.mtime.toISOString()}`,
  `- Migrated markdown files: ${migratedCount}`,
  `- Skipped index files: ${skippedCount}`,
  `- Target root: ${targetRoot}`
].join('\n');

await writeFile(reportPath, `${report}\n`, 'utf8');

console.log(`Migrated ${migratedCount} markdown files.`);
console.log(`Skipped ${skippedCount} category index files.`);
console.log(`Report: ${reportPath}`);

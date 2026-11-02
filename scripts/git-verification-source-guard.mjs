import { execFileSync } from 'node:child_process';

// Generated evidence files may change during verification. Only the code and
// workflow inputs that determine the checks must match the checked-out commit.
export const VERIFICATION_SOURCE_PATHS = Object.freeze([
  'scripts', 'src', 'test', 'contracts', '.github',
  'package.json', 'package-lock.json', 'server.ts', 'vite.config.ts',
  'tsconfig.json', '.gitignore', 'netlify.toml',
  'index.html', 'netlify/functions', 'public', 'README.md'
]);

/** Reject modified, staged, untracked or ignored verification inputs; do not print paths. */
export function assertCleanVerificationSources(rootDir) {
  let status;
  let trackedFlags;
  try {
    status = execFileSync('git', [
      'status', '--porcelain=v1', '-z', '--untracked-files=normal',
      '--ignored=matching', '--', ...VERIFICATION_SOURCE_PATHS
    ], {
      cwd: rootDir, encoding: 'utf8', timeout: 10000, maxBuffer: 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    // Git status trusts index flags that can conceal modified tracked sources.
    // Reject assume-unchanged and skip-worktree entries in protected paths.
    trackedFlags = execFileSync('git', [
      'ls-files', '--cached', '-v', '-z', '--', ...VERIFICATION_SOURCE_PATHS
    ], {
      cwd: rootDir, encoding: 'utf8', timeout: 10000, maxBuffer: 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe']
    });
  } catch {
    throw new Error('BLOCKED: unable to verify source worktree integrity');
  }
  if (status.length !== 0 ||
      trackedFlags.split('\0').some(entry => entry && entry[0] !== 'H')) {
    throw new Error('BLOCKED: verification source inputs differ from the checked-out Git commit');
  }
  return true;
}

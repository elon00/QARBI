#!/usr/bin/env python3
"""Limited source-inventory smoke check; not a cryptographic or deployment audit."""
import hashlib
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
EXCLUDED = {'.git', 'node_modules', 'target', 'tests', 'test', 'dist', 'build'}
EXTENSIONS = {'.rs', '.py', '.sol', '.ts', '.go', '.js', '.c', '.cpp'}


def test_reality():
    assert (ROOT / 'README.md').is_file(), 'Missing README.md specification'
    sources = sorted(p for p in ROOT.rglob('*') if p.is_file()
                     and p.suffix in EXTENSIONS
                     and not any(part in EXCLUDED for part in p.relative_to(ROOT).parts[:-1]))
    assert sources, 'No source modules found'
    digest = hashlib.sha256()
    for source in sources:
        digest.update(str(source.relative_to(ROOT)).encode('utf-8'))
        digest.update(b'\0')
        digest.update(hashlib.sha256(source.read_bytes()).digest())
    print(f'[INVENTORY PASS] {len(sources)} source files; inventory SHA-256: {digest.hexdigest()}')
    print('LIMITATION: Source inventory only. FIPS 203/204, on-chain verification, security audit, and production readiness NOT TESTED.')
    return True


if __name__ == '__main__':
    sys.exit(0 if test_reality() else 1)

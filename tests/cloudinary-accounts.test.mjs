import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Load only these explicit visible files. No Next, Prisma or dotenv startup.
function moduleFrom(path, imports = {}, globals = {}) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    module, exports: module.exports,
    require(name) {
      if (name in imports) return imports[name];
      throw new Error(`Unexpected import: ${name}`);
    },
    URL, URLSearchParams, AbortController, setTimeout, clearTimeout,
    process: { env: {} }, ...globals,
  });
  return module.exports;
}

const helpers = moduleFrom('../src/lib/image-source.ts');
const imported = 'publisher/skyone/17167/12d5deb4a8924168';

test('existing SkyOne IDs resolve to their upload account', () => {
  assert.equal(helpers.resolveImageSource(imported), `https://res.cloudinary.com/dxpewhtgu/image/upload/${imported}`);
  assert.equal(new URL(helpers.propertyImageUrl(imported, 1080)).pathname.split('/')[1], 'dxpewhtgu');
});

test('old IDs keep din9bhvas and complete URLs keep either account', () => {
  assert.match(helpers.propertyImageUrl('old-cover', 400), /\/din9bhvas\/image\/upload\//);
  for (const cloud of ['din9bhvas', 'dxpewhtgu']) {
    const url = `https://res.cloudinary.com/${cloud}/image/upload/v123/folder/photo.jpg`;
    assert.equal(helpers.resolveImageSource(url), url);
    const delivered = helpers.propertyImageUrl(url, 400);
    assert.equal(new URL(delivered).pathname.split('/')[1], cloud);
    assert.match(delivered, /v123\/folder\/photo.jpg$/);
  }
  assert.equal(helpers.propertyImageUrl('/images/local.jpg', 400), '/images/local.jpg');
  assert.equal(helpers.propertyImageUrl('https://example.com/photo.jpg', 400), 'https://example.com/photo.jpg');
  assert.equal(helpers.resolveImageSource('publisher/other/1/image'), 'publisher/other/1/image');
});

function uploader(response) {
  let calls = 0;
  const images = moduleFrom('../src/lib/publisher/images.ts', {
    'server-only': {},
    '@/lib/publisher/core': {
      cloudinarySignature: () => 'test-signature',
      imagePublicId: () => imported,
      isHttpUrl: value => value.startsWith('https://'),
      ownCloudinaryPublicId: (url, cloud) => url.startsWith(`https://res.cloudinary.com/${cloud}/`) ? imported : null,
    },
  }, {
    process: { env: { CLOUDINARY_CLOUD_NAME: 'dxpewhtgu', CLOUDINARY_API_KEY: 'fixture', CLOUDINARY_API_SECRET: 'fixture' } },
    fetch: async () => { calls++; return { ok: true, json: async () => response }; },
  });
  return { ...images, calls: () => calls };
}

test('upload stores complete secure_url including account, version and format', async () => {
  const url = `https://res.cloudinary.com/dxpewhtgu/image/upload/v123/${imported}.jpg`;
  const api = uploader({ public_id: imported, secure_url: url });
  const result = await api.syncPublisherImages('skyone', '17167', ['https://example.com/a.jpg']);
  assert.equal(result.imageUrls[0], url);
  assert.equal(result.warnings.length, 0);
});

test('already uploaded URLs retain their cloud without a new upload', async () => {
  const api = uploader({});
  const url = `https://res.cloudinary.com/dxpewhtgu/image/upload/v123/${imported}.jpg`;
  const result = await api.syncPublisherImages('skyone', '17167', [url]);
  assert.equal(result.imageUrls[0], url);
  assert.equal(api.calls(), 0);
});

test('missing, insecure or wrong-account delivery URL is reported as failed photo', async () => {
  for (const secure_url of [undefined, 'http://res.cloudinary.com/dxpewhtgu/image/upload/a', 'https://res.cloudinary.com/wrong/image/upload/a']) {
    const api = uploader({ public_id: imported, secure_url });
    const result = await api.syncPublisherImages('skyone', '17167', ['https://example.com/a.jpg']);
    assert.equal(result.imageUrls.length, 0);
    assert.equal(result.warnings.length, 1);
  }
});

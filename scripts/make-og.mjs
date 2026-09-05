// Generates public/og.png: flat #fafaf9 1200x630 with a small emerald block.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const W = 1200, H = 630;
const px = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H; i++) {
  px[i * 3] = 0xfa; px[i * 3 + 1] = 0xfa; px[i * 3 + 2] = 0xf9;
}
// Emerald block, 96x96 at (80, 80).
for (let y = 80; y < 176; y++) {
  for (let x = 80; x < 176; x++) {
    const i = (y * W + x) * 3;
    px[i] = 0x05; px[i + 1] = 0x96; px[i + 2] = 0x69;
  }
}

// PNG rows carry a filter byte (0 = none).
const raw = Buffer.alloc((W * 3 + 1) * H);
for (let y = 0; y < H; y++) {
  raw[y * (W * 3 + 1)] = 0;
  px.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, (y + 1) * W * 3);
}
const idat = deflateSync(raw);

let table;
function crc32(buf) {
  if (!table) {
    table = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 2;  // color type 2 = truecolor
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', idat),
  chunk('IEND', Buffer.alloc(0)),
]);

writeFileSync(new URL('../public/og.png', import.meta.url), png);
console.log('og.png written:', png.length, 'bytes');

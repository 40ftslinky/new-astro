import { open } from 'node:fs/promises';
import { resolve } from 'node:path';

// Read MP4 track headers without loading the video payload into memory.
export async function videoHasAudio(url?: string): Promise<boolean | undefined> {
  if (!url || /^(?:https?:)?\/\//.test(url) || !/\.(mp4|m4v|mov)$/i.test(url)) return undefined;
  const normalized = url.replace(/^(?:\.\.\/)+assets\//, 'src/assets/').replace(/^\//, '');
  const path = resolve(process.cwd(), normalized.startsWith('src/assets/') ? normalized : `public/${normalized}`);
  let file;
  try {
    file = await open(path, 'r');
    const { size } = await file.stat();
    const read = async (offset: number, length: number) => {
      const buffer = Buffer.alloc(length);
      const { bytesRead } = await file!.read(buffer, 0, length, offset);
      if (bytesRead !== length) throw new Error('Incomplete MP4 header');
      return buffer;
    };
    const scan = async (start: number, end: number, depth = 0): Promise<boolean> => {
      for (let offset = start; offset + 8 <= end;) {
        const header = await read(offset, 8);
        const type = header.toString('ascii', 4, 8);
        let length = header.readUInt32BE(0);
        let headerSize = 8;
        if (length === 1) {
          length = Number((await read(offset + 8, 8)).readBigUInt64BE());
          headerSize = 16;
        } else if (length === 0) length = end - offset;
        if (!Number.isSafeInteger(length) || length < headerSize || offset + length > end) throw new Error('Invalid MP4 box');
        const payload = offset + headerSize;
        if (type === 'hdlr' && depth === 3 && length >= headerSize + 12) {
          if ((await read(payload + 8, 4)).toString('ascii') === 'soun') return true;
        }
        if (type === ['moov', 'trak', 'mdia'][depth] && await scan(payload, offset + length, depth + 1)) return true;
        offset += length;
      }
      return false;
    };
    return await scan(0, size);
  } catch {
    // Remote, missing or unsupported media can use browser detection or hasAudio.
    return undefined;
  } finally {
    await file?.close();
  }
}

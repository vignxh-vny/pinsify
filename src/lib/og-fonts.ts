import fs from "fs/promises";
import path from "path";

type FontConfig = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
};

let cachedFonts: FontConfig[] | null = null;

export async function getOGFonts(): Promise<FontConfig[]> {
  if (cachedFonts) {
    return cachedFonts;
  }

  try {
    const fontsDir = path.join(process.cwd(), "public", "fonts");

    const [antonBuf, interBoldBuf, interRegBuf, mrDafoeBuf] = await Promise.all([
      fs.readFile(path.join(fontsDir, "Anton-Regular.ttf")),
      fs.readFile(path.join(fontsDir, "Inter-Bold.ttf")),
      fs.readFile(path.join(fontsDir, "Inter-Regular.ttf")),
      fs.readFile(path.join(fontsDir, "MrDafoe-Regular.ttf")),
    ]);

    const toArrayBuffer = (buf: Buffer): ArrayBuffer => {
      const arrayBuffer = new ArrayBuffer(buf.byteLength);
      new Uint8Array(arrayBuffer).set(new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength));
      return arrayBuffer;
    };

    cachedFonts = [
      {
        name: "Anton",
        data: toArrayBuffer(antonBuf),
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter",
        data: toArrayBuffer(interBoldBuf),
        weight: 700,
        style: "normal",
      },
      {
        name: "Inter",
        data: toArrayBuffer(interRegBuf),
        weight: 400,
        style: "normal",
      },
      {
        name: "Mr Dafoe",
        data: toArrayBuffer(mrDafoeBuf),
        weight: 400,
        style: "normal",
      },
    ];

    return cachedFonts;
  } catch (err) {
    console.error("[OG Fonts] Failed to load local TTF fonts, falling back to empty fonts array:", err);
    return [];
  }
}

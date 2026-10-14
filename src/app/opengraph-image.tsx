import { renderOGImage } from "@/lib/og-renderer";

export const alt = "PinCheck — Discover Your Aesthetic Identity";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return renderOGImage({ data: null, format: "og" });
}

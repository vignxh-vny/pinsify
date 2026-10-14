import { ImageResponse } from "next/og";
import { StoryData } from "@/types/story";
import { getOGFonts } from "./og-fonts";

interface RenderOGOptions {
  data: StoryData | null;
  format?: "og" | "story";
}

function generateBarcodeBars(seed: string) {
  let h = 0;
  const cleanSeed = (seed || "PINCHECK").toUpperCase();
  for (let i = 0; i < cleanSeed.length; i++) {
    h = (h * 31 + cleanSeed.charCodeAt(i)) >>> 0;
  }
  const rnd = () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 4294967296;
  };
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  while (x < 100) {
    const w = 1 + Math.floor(rnd() * 3);
    const gap = 1 + Math.floor(rnd() * 2);
    bars.push({ x, w });
    x += w + gap;
  }
  return bars;
}

export async function renderOGImage({ data, format = "og" }: RenderOGOptions): Promise<ImageResponse> {
  const fonts = await getOGFonts();

  const isStory = format === "story";
  const width = isStory ? 1080 : 1200;
  const height = isStory ? 1920 : 630;

  // Extract or fallback data
  const isFound = !!data;
  const username = data?.user?.username?.replace("@", "") || "curator";
  const primaryName = (data?.identity?.primary || (isFound ? "AESTHETIC IDENTITY" : "DISCOVER YOUR LORE")).toUpperCase();
  const rawTagline = data?.identity?.tagline || (isFound ? "Knocking on your boards." : "Analyze your Pinterest boards and discover your brutalist aesthetic identity.");
  const cleanTagline = rawTagline.replace(/^["“”]/, "").replace(/["“”]$/, "").trim();
  const quoteSnippet = cleanTagline.length > 90 ? cleanTagline.slice(0, 87) + "..." : cleanTagline;

  const totalPins = data?.user?.totalPins || 0;
  const totalBoards = data?.user?.totalBoards || 0;
  const categoryTag = (data?.categoryTag || data?.headCategories || "CURATOR // AESTHETIC IDENTITY").toUpperCase();

  const barcodeBars = generateBarcodeBars(username);

  if (isStory) {
    // 1080 x 1920 Story Canvas for Save ID export
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "80px 60px",
            backgroundColor: "#07070a",
            position: "relative",
            fontFamily: "Inter",
          }}
        >
          {/* Subtle ambient glow */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "15%",
              width: "70%",
              height: "50%",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 20, 147, 0.08)",
              display: "flex",
            }}
          />

          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "#d42a2a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontFamily: "Anton",
                  fontSize: "22px",
                }}
              >
                P
              </div>
              <span
                style={{
                  fontFamily: "Anton",
                  fontSize: "36px",
                  color: "#ffffff",
                  letterSpacing: "3px",
                }}
              >
                PINCHECK.IN
              </span>
            </div>
            <div
              style={{
                display: "flex",
                backgroundColor: "#d42a2a",
                color: "#ffffff",
                padding: "8px 18px",
                borderRadius: "6px",
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: "18px",
                letterSpacing: "2px",
              }}
            >
              OFFICIAL ID // 20.26
            </div>
          </div>

          {/* Center: The Story Card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "680px",
              height: "1200px",
              backgroundColor: "#f3efe9",
              borderRadius: "44px",
              border: "5px solid #1a1a1f",
              padding: "36px 36px 40px",
              boxShadow: "0 40px 80px rgba(0, 0, 0, 0.8)",
              position: "relative",
            }}
          >
            {/* Metal Clip */}
            <div
              style={{
                position: "absolute",
                top: "-16px",
                left: "290px",
                width: "100px",
                height: "32px",
                borderRadius: "0 0 16px 16px",
                backgroundColor: "#a0a5b0",
                border: "3px solid #111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: "#07070a",
                  display: "flex",
                }}
              />
            </div>

            {/* Top row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "16px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  backgroundColor: "#d42a2a",
                  color: "#ffffff",
                  padding: "8px 18px",
                  borderRadius: "4px",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: "20px",
                  letterSpacing: "3px",
                }}
              >
                PINCHECK // ID
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Anton",
                  fontSize: "44px",
                  color: "#111115",
                }}
              >
                20.26
              </div>
            </div>

            {/* Signature Pink Photo Box */}
            <div
              style={{
                width: "100%",
                height: "440px",
                borderRadius: "12px",
                border: "4px solid #000000",
                backgroundImage: "linear-gradient(135deg, #FF66B2 0%, #FF1493 50%, #C71585 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Foil Accent Bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  width: "100%",
                  height: "12px",
                  backgroundImage: "linear-gradient(90deg, #ff0055, #ffaa00, #00ffcc, #0099ff, #ff00c8)",
                  display: "flex",
                }}
              />
              <span
                style={{
                  fontFamily: "Mr Dafoe",
                  fontSize: "96px",
                  color: "#ffffff",
                  transform: "rotate(-7deg)",
                  textShadow: "4px 4px 0px rgba(60, 0, 80, 0.4)",
                }}
              >
                @{username}
              </span>

              {/* Verified Stamp */}
              <div
                style={{
                  position: "absolute",
                  bottom: "28px",
                  right: "28px",
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  border: "4px solid #d42a2a",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "rotate(-14deg)",
                }}
              >
                <span
                  style={{
                    fontFamily: "Anton",
                    fontSize: "22px",
                    color: "#d42a2a",
                    lineHeight: "1",
                  }}
                >
                  VERIFIED
                </span>
                <span
                  style={{
                    fontFamily: "Inter",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#d42a2a",
                  }}
                >
                  ID
                </span>
              </div>
            </div>

            {/* Aesthetic Name */}
            <div
              style={{
                display: "flex",
                fontFamily: "Anton",
                fontSize: "64px",
                color: "#0a0a0a",
                textTransform: "uppercase",
                letterSpacing: "1px",
                lineHeight: "1.1",
                marginTop: "24px",
                marginBottom: "18px",
              }}
            >
              {primaryName}
            </div>

            {/* Dark Bottom Panel */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flex: 1,
                backgroundColor: "#121214",
                borderRadius: "20px",
                padding: "24px 28px",
                color: "#ffffff",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Inter",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#8b8e99",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    paddingBottom: "12px",
                    borderBottom: "1px solid #232328",
                  }}
                >
                  {categoryTag}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Inter",
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: "1.35",
                    marginTop: "16px",
                  }}
                >
                  &quot;{quoteSnippet}&quot;
                </div>
              </div>

              {/* Stats and Barcode */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "Inter",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#d42a2a",
                  }}
                >
                  <span>{totalPins} PINS</span>
                  <span style={{ color: "#555" }}>//</span>
                  <span>{totalBoards} BOARDS</span>
                </div>

                {/* Barcode box */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                    padding: "6px 8px 4px",
                  }}
                >
                  <svg width="110" height="32" viewBox="0 0 100 35">
                    {barcodeBars.map((b, i) => (
                      <rect key={i} x={b.x} y="0" width={b.w} height="35" fill="#000000" />
                    ))}
                  </svg>
                  <span
                    style={{
                      fontFamily: "Inter",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#000000",
                      marginTop: "2px",
                      letterSpacing: "1px",
                    }}
                  >
                    *PINCHECK*
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Callout */}
          <div
            style={{
              display: "flex",
              fontFamily: "Anton",
              fontSize: "32px",
              color: "#ffffff",
              letterSpacing: "2px",
            }}
          >
            DISCOVER YOUR PINTEREST LORE AT PINCHECK.IN
          </div>
        </div>
      ),
      {
        width,
        height,
        fonts,
      }
    );
  }

  // Default: 1200 x 630 Open Graph & Twitter Cards
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#07070a",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 50px 0 35px",
          position: "relative",
          fontFamily: "Inter",
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 20, 147, 0.08)",
            display: "flex",
          }}
        />

        {/* LEFT: Flat Card with slight tilt */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "430px",
            height: "630px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "325px",
              height: "530px",
              backgroundColor: "#f3efe9",
              borderRadius: "26px",
              border: "3px solid #1a1a1f",
              padding: "16px 18px 20px",
              transform: "rotate(-3deg)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.7)",
              position: "relative",
            }}
          >
            {/* Top Clip Cutout */}
            <div
              style={{
                position: "absolute",
                top: "-10px",
                left: "135px",
                width: "55px",
                height: "18px",
                borderRadius: "0 0 10px 10px",
                backgroundColor: "#a0a5b0",
                border: "2px solid #111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#07070a",
                  display: "flex",
                }}
              />
            </div>

            {/* Top row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "6px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  backgroundColor: "#d42a2a",
                  color: "#ffffff",
                  padding: "3px 8px",
                  borderRadius: "3px",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "1.5px",
                }}
              >
                OFFICIAL ID
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Anton",
                  fontSize: "24px",
                  color: "#111115",
                }}
              >
                20.26
              </div>
            </div>

            {/* Signature Pink Photo Box */}
            <div
              style={{
                width: "100%",
                height: "170px",
                borderRadius: "6px",
                border: "2px solid #000000",
                backgroundImage: "linear-gradient(135deg, #FF66B2 0%, #FF1493 50%, #C71585 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Foil Accent Bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  width: "100%",
                  height: "6px",
                  backgroundImage: "linear-gradient(90deg, #ff0055, #ffaa00, #00ffcc, #0099ff, #ff00c8)",
                  display: "flex",
                }}
              />
              <span
                style={{
                  fontFamily: "Mr Dafoe",
                  fontSize: "44px",
                  color: "#ffffff",
                  transform: "rotate(-7deg)",
                  textShadow: "2px 2px 0px rgba(60, 0, 80, 0.45)",
                }}
              >
                @{username}
              </span>

              {/* Verified Stamp */}
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  border: "2px solid #d42a2a",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "rotate(-12deg)",
                }}
              >
                <span
                  style={{
                    fontFamily: "Anton",
                    fontSize: "13px",
                    color: "#d42a2a",
                    lineHeight: "1",
                  }}
                >
                  VERIFIED
                </span>
                <span
                  style={{
                    fontFamily: "Inter",
                    fontSize: "8px",
                    fontWeight: 700,
                    color: "#d42a2a",
                  }}
                >
                  ID
                </span>
              </div>
            </div>

            {/* Aesthetic Name on Card */}
            <div
              style={{
                display: "flex",
                fontFamily: "Anton",
                fontSize: "28px",
                color: "#0a0a0a",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                lineHeight: "1.05",
                marginTop: "12px",
                marginBottom: "8px",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {primaryName}
            </div>

            {/* Bottom Dark Panel */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flex: 1,
                backgroundColor: "#121214",
                borderRadius: "10px",
                padding: "10px 12px",
                color: "#ffffff",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Inter",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#8b8e99",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    paddingBottom: "5px",
                    borderBottom: "1px solid #232328",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {categoryTag}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Inter",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: "1.3",
                    marginTop: "6px",
                    maxHeight: "45px",
                    overflow: "hidden",
                  }}
                >
                  &quot;{quoteSnippet}&quot;
                </div>
              </div>

              {/* Stats and Barcode */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginTop: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontFamily: "Inter",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#d42a2a",
                  }}
                >
                  <span>{totalPins} PINS</span>
                  <span style={{ color: "#555" }}>//</span>
                  <span>{totalBoards} BOARDS</span>
                </div>

                {/* Barcode box */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderRadius: "3px",
                    padding: "3px 4px 2px",
                  }}
                >
                  <svg width="60" height="18" viewBox="0 0 100 35">
                    {barcodeBars.map((b, i) => (
                      <rect key={i} x={b.x} y="0" width={b.w} height="35" fill="#000000" />
                    ))}
                  </svg>
                  <span
                    style={{
                      fontFamily: "Inter",
                      fontSize: "6px",
                      fontWeight: 700,
                      color: "#000000",
                      letterSpacing: "0.5px",
                    }}
                  >
                    *PINCHECK*
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: High-Impact Typography & Branding */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "680px",
            height: "100%",
            paddingLeft: "40px",
          }}
        >
          {/* Eyebrow Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                backgroundColor: "#d42a2a",
                color: "#ffffff",
                padding: "5px 12px",
                borderRadius: "4px",
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: "12px",
                letterSpacing: "2px",
              }}
            >
              {isFound ? "OFFICIAL IDENTITY" : "PINTEREST LORE"}
            </div>
            <span
              style={{
                fontFamily: "Inter",
                fontSize: "13px",
                fontWeight: 600,
                color: "#757a8c",
                letterSpacing: "1px",
              }}
            >
              ISSUE // 20.26
            </span>
          </div>

          {/* Aesthetic Title */}
          <div
            style={{
              display: "flex",
              fontFamily: "Anton",
              fontSize: "64px",
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: "1px",
              lineHeight: "1.05",
              marginBottom: "16px",
            }}
          >
            {primaryName}
          </div>

          {/* Tagline / Roast line */}
          <div
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontSize: "22px",
              fontWeight: 500,
              color: "#cfd2dd",
              lineHeight: "1.45",
              maxWidth: "600px",
              marginBottom: "28px",
            }}
          >
            &quot;{cleanTagline}&quot;
          </div>

          {/* Curator pill */}
          {isFound && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "10px 18px",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                alignSelf: "flex-start",
                marginBottom: "32px",
              }}
            >
              <span
                style={{
                  fontFamily: "Mr Dafoe",
                  fontSize: "26px",
                  color: "#ff66b2",
                }}
              >
                @{username}
              </span>
              <span style={{ color: "#444" }}>•</span>
              <span
                style={{
                  fontFamily: "Inter",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#9da1af",
                }}
              >
                {totalPins} pins across {totalBoards} boards
              </span>
            </div>
          )}

          {/* Footer Branding */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#d42a2a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontFamily: "Anton",
                fontSize: "20px",
              }}
            >
              P
            </div>
            <span
              style={{
                fontFamily: "Anton",
                fontSize: "28px",
                color: "#ffffff",
                letterSpacing: "2.5px",
              }}
            >
              PINCHECK.IN
            </span>
            <span
              style={{
                fontFamily: "Inter",
                fontSize: "13px",
                fontWeight: 600,
                color: "#606575",
                letterSpacing: "1px",
              }}
            >
              // DISCOVER YOUR VISUAL IDENTITY
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
      fonts,
    }
  );
}

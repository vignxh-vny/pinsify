import { StoryData } from "@/types/story";

export const mockStoryData: StoryData = {
  user: {
    username: "pinterest_user",
    displayName: "pinterest_user",
    avatarUrl: "",
    totalPins: 1200,
    totalBoards: 18,
  },

  identity: {
    primary: "Contemporary Visuals",
    secondary: ["Eclectic Visuals", "Self-Love Affirmations", "Modern Streetwear"],
    emoji: "✨",
    tagline: "Curating aesthetic worlds you only visit in your imagination.",
    description:
      "You curate an elite wardrobe of avant-garde outfits and visual inspirations, building moods that define your personal aesthetic.",
    recentKeywords: ["Abstract Patterns", "Vintage Sweats", "Statement Jewelry"],
  },

  colorAura: {
    name: "Electric Magenta",
    colors: ["#e2278d", "#cf2aa8", "#d42a62", "#dc2d34", "#7a2cff", "#05060b"],
    description:
      "A high-contrast neon aura reflecting your bold visual taste and streetwear edge.",
    mood: "High-voltage street aesthetic",
  },

  themes: [
    { name: "Visual Arts", percentage: 38, emoji: "🎨" },
    { name: "Abstract Patterns", percentage: 24, emoji: "✨" },
    { name: "Interior Spaces", percentage: 16, emoji: "🛋️" },
    { name: "Modern Streetwear", percentage: 12, emoji: "👟" },
    { name: "Architecture", percentage: 6, emoji: "🏛️" },
    { name: "Aesthetic Moodboards", percentage: 4, emoji: "🕯️" },
  ],

  vibes: [
    { trait: "Nostalgic", value: 92, label: "Past-leaning" },
    { trait: "Warm", value: 85, label: "Cozy energy" },
    { trait: "Minimal", value: 68, label: "Curated calm" },
    { trait: "Romantic", value: 78, label: "Softly emotional" },
    { trait: "Intellectual", value: 88, label: "Deep thinker" },
  ],

  feelsLike:
    "Your Pinterest feels like walking through a contemporary gallery at twilight — curated prints, the scent of fresh paper, and golden light catching dust particles.",

  hiddenAesthetics: [
    {
      name: "Goblincore",
      confidence: 73,
      description:
        "Underneath your polished exterior, there is an appreciation for raw, imperfect beauty in nature.",
      emoji: "🍄",
    },
    {
      name: "Cottagecore Tech",
      confidence: 61,
      description:
        "You occasionally pin modern setups surrounded by greenery and soft warm lighting.",
      emoji: "🌻",
    },
  ],

  drift: [
    { period: "Early", aesthetic: "Tumblr Minimal", color: "#4A4A4A" },
    { period: "2022", aesthetic: "Clean Minimal", color: "#B8B8B8" },
    { period: "2023", aesthetic: "Warm Intellectual", color: "#6B3A2A" },
    { period: "2024", aesthetic: "Urban Visual", color: "#C47D3B" },
    { period: "Now", aesthetic: "Contemporary Visuals", color: "#E8C07A" },
  ],
};

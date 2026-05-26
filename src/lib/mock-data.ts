import { StoryData } from "@/types/story";

export const mockStoryData: StoryData = {
  user: {
    username: "aesthetic_soul",
    displayName: "Aesthetic Soul",
    avatarUrl: "",
    totalPins: 2847,
    totalBoards: 34,
  },

  identity: {
    primary: "Dark Academia Dreamer",
    secondary: ["Soft Minimalist", "Vintage Romantic", "Cozy Intellectual"],
    emoji: "📚",
    tagline: "Where old libraries meet golden hour",
    description:
      "You curate a world of leather-bound books, amber-lit rooms, and the quiet elegance of things that have stories. Your aesthetic is intellectual without being cold — it's the warmth of a reading nook, the texture of aged paper, the romance of autumn fog.",
  },

  colorAura: {
    name: "Amber Dusk",
    colors: ["#2D1B14", "#6B3A2A", "#C47D3B", "#E8C07A", "#F5E6CC", "#1A1423"],
    description:
      "Your visual soul gravitates toward warm ambers, deep mahogany, and muted creams — like sunlight filtering through old curtains in a library at dusk.",
    mood: "Warmth wrapped in quiet melancholy",
  },

  themes: [
    { name: "Architecture & Interiors", percentage: 28, emoji: "🏛️" },
    { name: "Books & Literature", percentage: 22, emoji: "📖" },
    { name: "Nature & Landscapes", percentage: 18, emoji: "🌿" },
    { name: "Fashion & Texture", percentage: 14, emoji: "🧥" },
    { name: "Food & Ritual", percentage: 10, emoji: "☕" },
    { name: "Art & Photography", percentage: 8, emoji: "🎨" },
  ],

  vibes: [
    { trait: "Nostalgic", value: 92, label: "Past-leaning" },
    { trait: "Warm", value: 85, label: "Cozy energy" },
    { trait: "Minimal", value: 68, label: "Curated calm" },
    { trait: "Romantic", value: 78, label: "Softly emotional" },
    { trait: "Intellectual", value: 88, label: "Deep thinker" },
  ],

  feelsLike:
    "Your Pinterest feels like walking through a European university town in late October — cobblestone streets still warm from the afternoon sun, the smell of coffee and old books drifting from a half-open door, golden light catching dust particles above a mahogany desk where someone left their reading glasses on a worn copy of Rilke.",

  hiddenAesthetics: [
    {
      name: "Goblincore",
      confidence: 73,
      description:
        "Underneath your polished academic exterior, there's a secret love for moss, mushrooms, and the beautifully imperfect things in nature.",
      emoji: "🍄",
    },
    {
      name: "Cottagecore Tech",
      confidence: 61,
      description:
        "You occasionally pin modern tech setups surrounded by plants and warm lighting — a hybrid identity that few share.",
      emoji: "🌻",
    },
  ],

  drift: [
    { period: "Early", aesthetic: "Tumblr Grunge", color: "#4A4A4A" },
    { period: "2022", aesthetic: "Clean Minimal", color: "#B8B8B8" },
    { period: "2023", aesthetic: "Dark Academia", color: "#6B3A2A" },
    { period: "2024", aesthetic: "Warm Intellectual", color: "#C47D3B" },
    { period: "Now", aesthetic: "Dark Academia Dreamer", color: "#E8C07A" },
  ],
};

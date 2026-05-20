import type { Post } from "@repo/db/data";
import type { StoreProduct } from "@/lib/storeProducts";

// Frontend product catalogue used before the real product database is connected.
export const gameCatalog: StoreProduct[] = [
  {
    id: 101,
    urlId: "god-of-war-ragnarok",
    title: "God of War Ragnarok",
    description:
      "Kratos and Atreus travel through the Nine Realms in a cinematic action adventure about family, fate, and Norse mythology.",
    content:
      "God of War Ragnarok combines close-range combat, exploration, puzzles, boss battles, and a strong story-driven campaign. It is presented as a premium PlayStation action title in the GameHub catalogue.",
    imageUrl: "/games/god_header.jpg",
    screenshots: ["/games/god1.jpg", "/games/god2.jpg", "/games/god3.jpg"],
    category: "Action",
    platform: "PlayStation",
    platforms: ["PlayStation"],
    price: 94.95,
    stock: 11,
    releaseDate: "9 November 2022",
    releaseYear: 2022,
  },
  {
    id: 102,
    urlId: "halo-infinite",
    title: "Halo Infinite",
    description:
      "Master Chief returns in a sci-fi FPS built around arena combat, vehicles, multiplayer battles, and the Zeta Halo campaign.",
    content:
      "Halo Infinite gives the Xbox shelf a flagship first-person shooter. It is useful for demonstrating platform filtering, FPS genre filtering, and a recognizable console product.",
    imageUrl: "/games/halo_header.jpg",
    screenshots: ["/games/halo1.jpg", "/games/halo2.jpg", "/games/halo3.jpg"],
    category: "FPS",
    platform: "Xbox",
    platforms: ["Xbox"],
    price: 59.95,
    stock: 18,
    releaseDate: "8 December 2021",
    releaseYear: 2021,
  },
  {
    id: 103,
    urlId: "mario-kart-8-deluxe",
    title: "Mario Kart 8 Deluxe",
    description:
      "Nintendo's kart racing game with local multiplayer, online races, battle mode, character items, and a large collection of colorful tracks.",
    content:
      "Mario Kart 8 Deluxe adds a family-friendly Nintendo product to the storefront. It is a strong fit for quick shopping, repeat play, and local multiplayer appeal.",
    imageUrl: "/games/mario_header.jpg",
    screenshots: ["/games/mario1.jpg", "/games/mario2.avif", "/games/mario3.jpg"],
    category: "Racing",
    platform: "Nintendo Switch",
    platforms: ["Nintendo Switch"],
    price: 79.95,
    stock: 16,
    releaseDate: "28 April 2017",
    releaseYear: 2017,
  },
  {
    id: 104,
    urlId: "ninja-gaiden-2-black",
    title: "NINJA GAIDEN 2 Black",
    description:
      "A fast action game starring Ryu Hayabusa, with intense sword combat, upgraded visuals, and high-speed battles against dangerous enemies.",
    content:
      "NINJA GAIDEN 2 Black is positioned as a fast, difficult action title. It gives the catalogue a sharper combat-focused game with boss fights and a darker visual style.",
    imageUrl: "/games/ninja_header.jpg",
    screenshots: ["/games/ninja1.jpg", "/games/ninja2.jpg", "/games/ninja3.jpg"],
    category: "Action",
    platform: "Xbox",
    platforms: ["Xbox"],
    price: 79.95,
    stock: 18,
    releaseDate: "23 January 2025",
    releaseYear: 2025,
  },
  {
    id: 105,
    urlId: "marvels-spider-man-2",
    title: "Marvel's Spider-Man 2",
    description:
      "Peter Parker and Miles Morales team up in a cinematic action adventure across Marvel's New York, featuring Venom, Kraven, and web-wing traversal.",
    content:
      "Marvel's Spider-Man 2 is a polished PlayStation action adventure with fast traversal, two playable heroes, cinematic combat, and a highly recognizable brand.",
    imageUrl: "/games/spiderman_header.jpeg",
    screenshots: [
      "/games/spiderman1.jpg",
      "/games/spiderman2.jpg",
      "/games/spiderman3.jpg",
    ],
    category: "Action",
    platform: "PlayStation",
    platforms: ["PlayStation"],
    price: 124.95,
    stock: 9,
    releaseDate: "20 October 2023",
    releaseYear: 2023,
  },
  {
    id: 106,
    urlId: "yakuza-kiwami-3-dark-ties",
    title: "Yakuza Kiwami 3 & Dark Ties",
    description:
      "A modern remake of Yakuza 3 with Kazuma Kiryu's Okinawa story, plus a new Dark Ties campaign focused on Yoshitaka Mine.",
    content:
      "Yakuza Kiwami 3 & Dark Ties adds a story-heavy crime drama RPG to the shared platform section. It gives GameHub a Japanese urban setting, emotional storytelling, and strong character identity.",
    imageUrl: "/games/yakuza_header.webp",
    screenshots: ["/games/yakuza1.jpg", "/games/yakuza2.jpg", "/games/yakuza3.jpg"],
    category: "RPG",
    platform: "Xbox, PlayStation, Nintendo Switch",
    platforms: ["Xbox", "PlayStation", "Nintendo Switch"],
    price: 89.95,
    stock: 14,
    releaseDate: "12 February 2026",
    releaseYear: 2026,
  },
  {
    id: 107,
    urlId: "the-legend-of-zelda-tears-of-the-kingdom",
    title: "The Legend of Zelda: Tears of the Kingdom",
    description:
      "Link explores Hyrule, sky islands, and the Depths while building vehicles, solving physics puzzles, and fighting to save the kingdom.",
    content:
      "Tears of the Kingdom is a flagship Nintendo Switch adventure. It gives the store a large open-air exploration game with creativity, crafting, and puzzle-solving.",
    imageUrl: "/games/zelda_header.jpg",
    screenshots: ["/games/zalda1.jpg", "/games/zelda2.avif", "/games/zelda3.avif"],
    category: "Adventure",
    platform: "Nintendo Switch",
    platforms: ["Nintendo Switch"],
    price: 89.95,
    stock: 15,
    releaseDate: "12 May 2023",
    releaseYear: 2023,
  },
  {
    id: 108,
    urlId: "forza-horizon-6",
    title: "Forza Horizon 6",
    description:
      "An open-world racing game set in Japan, focused on scenic roads, car collecting, festival events, seasonal racing, and high-speed exploration.",
    content:
      "Forza Horizon 6 gives the Xbox shelf a visually strong racing product. It is useful for demonstrating high-quality product imagery, platform filtering, and a different genre from the action titles.",
    imageUrl: "/games/forza_header.jpg",
    screenshots: ["/games/forza1.jpg", "/games/forza2.jpg", "/games/forza3.jpg"],
    category: "Racing",
    platform: "Xbox",
    platforms: ["Xbox"],
    price: 109.95,
    stock: 12,
    releaseDate: "19 May 2026",
    releaseYear: 2026,
  },
  {
    id: 109,
    urlId: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    description:
      "A sci-fi open-world RPG set in Night City, with first-person combat, hacking, vehicles, branching missions, and cinematic storytelling.",
    content:
      "Cyberpunk 2077 adds a neon sci-fi RPG to the catalogue. Its strong visual identity helps the frontend feel like a real game storefront.",
    imageUrl: "/games/cyberpunk_header.jpg",
    screenshots: [
      "/games/cyberpunk1.jpg",
      "/games/cyberpunk2.jpg",
      "/games/cyberpunk3.jpg",
    ],
    category: "RPG",
    platform: "Xbox, PlayStation, Nintendo Switch",
    platforms: ["Xbox", "PlayStation", "Nintendo Switch"],
    price: 89.95,
    stock: 13,
    releaseDate: "10 December 2020",
    releaseYear: 2020,
  },
];

// Adapts game products to the shared Post-shaped data type used by this starter code.
export const gamePosts: Post[] = gameCatalog.map((game) => ({
  id: game.id,
  urlId: game.urlId,
  title: game.title,
  content: game.content,
  description: game.description,
  imageUrl: game.imageUrl,
  date: new Date(game.releaseDate),
  category: game.category,
  views: 0, // Compatibility field from the original Post type; not shown in UI.
  likes: 0, // Compatibility field from the original Post type; like feature was removed.
  tags: game.platforms.join(","),
  active: true,
}));

// Finds the full game record for the detail page.
export function findGameByUrlId(urlId: string) {
  return gameCatalog.find((game) => game.urlId === urlId);
}

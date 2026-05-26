export type ProductSeed = {
  // Seed shape mirrors the Prisma Product fields plus category name.
  id: number;
  urlId: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  galleryImages: string[];
  category: string;
  platform: string;
  platforms: string[];
  price: number;
  stock: number;
  releaseDate: Date;
  active: boolean;
};

export const products: ProductSeed[] = [
  // Initial catalogue used by local development, tests, and database seeding.
  {
    id: 101,
    urlId: "god-of-war-ragnarok",
    title: "God of War Ragnarok",
    description:
      "Kratos and Atreus travel through the Nine Realms in a cinematic action adventure about family, fate, and Norse mythology.",
    content:
      "God of War Ragnarok combines close-range combat, exploration, puzzles, boss battles, and a strong story-driven campaign. It is presented as a premium PlayStation action title in the GameHub catalogue.",
    imageUrl: "/games/god_header.jpg",
    galleryImages: ["/games/god1.jpg", "/games/god2.jpg", "/games/god3.jpg"],
    category: "Action",
    platform: "PlayStation",
    platforms: ["PlayStation"],
    price: 94.95,
    stock: 11,
    releaseDate: new Date("2022-11-09T00:00:00"),
    active: true,
  },
  {
    id: 102,
    urlId: "halo-infinite",
    title: "Halo Infinite",
    description:
      "Master Chief returns in a sci-fi FPS built around arena combat, vehicles, multiplayer battles, and the Zeta Halo campaign.",
    content:
      "Halo Infinite gives the Xbox shelf a flagship first-person shooter with arena combat, vehicles, and a recognizable campaign.",
    imageUrl: "/games/halo_header.jpg",
    galleryImages: ["/games/halo1.jpg", "/games/halo2.jpg", "/games/halo3.jpg"],
    category: "FPS",
    platform: "Xbox",
    platforms: ["Xbox"],
    price: 59.95,
    stock: 18,
    releaseDate: new Date("2021-12-08T00:00:00"),
    active: true,
  },
  {
    id: 103,
    urlId: "mario-kart-8-deluxe",
    title: "Mario Kart 8 Deluxe",
    description:
      "Nintendo's kart racing game with local multiplayer, online races, battle mode, character items, and a large collection of colorful tracks.",
    content:
      "Mario Kart 8 Deluxe adds a family-friendly Nintendo product to the storefront with quick races, battle modes, and local multiplayer appeal.",
    imageUrl: "/games/mario_header.jpg",
    galleryImages: ["/games/mario1.jpg", "/games/mario2.avif", "/games/mario3.jpg"],
    category: "Racing",
    platform: "Nintendo Switch",
    platforms: ["Nintendo Switch"],
    price: 79.95,
    stock: 16,
    releaseDate: new Date("2017-04-28T00:00:00"),
    active: true,
  },
  {
    id: 104,
    urlId: "ninja-gaiden-2-black",
    title: "NINJA GAIDEN 2 Black",
    description:
      "A fast action game starring Ryu Hayabusa, with intense sword combat, upgraded visuals, and high-speed battles against dangerous enemies.",
    content:
      "NINJA GAIDEN 2 Black is positioned as a fast, difficult action title with boss fights and a darker visual style.",
    imageUrl: "/games/ninja_header.jpg",
    galleryImages: ["/games/ninja1.jpg", "/games/ninja2.jpg", "/games/ninja3.jpg"],
    category: "Action",
    platform: "Xbox",
    platforms: ["Xbox"],
    price: 79.95,
    stock: 18,
    releaseDate: new Date("2025-01-23T00:00:00"),
    active: true,
  },
  {
    id: 105,
    urlId: "marvels-spider-man-2",
    title: "Marvel's Spider-Man 2",
    description:
      "Peter Parker and Miles Morales team up in a cinematic action adventure across Marvel's New York, featuring Venom, Kraven, and web-wing traversal.",
    content:
      "Marvel's Spider-Man 2 is a polished PlayStation action adventure with fast traversal, two playable heroes, and cinematic combat.",
    imageUrl: "/games/spiderman_header.jpeg",
    galleryImages: [
      "/games/spiderman1.jpg",
      "/games/spiderman2.jpg",
      "/games/spiderman3.jpg",
    ],
    category: "Action",
    platform: "PlayStation",
    platforms: ["PlayStation"],
    price: 124.95,
    stock: 9,
    releaseDate: new Date("2023-10-20T00:00:00"),
    active: true,
  },
  {
    id: 106,
    urlId: "yakuza-kiwami-3-dark-ties",
    title: "Yakuza Kiwami 3 & Dark Ties",
    description:
      "A modern remake of Yakuza 3 with Kazuma Kiryu's Okinawa story, plus a new Dark Ties campaign focused on Yoshitaka Mine.",
    content:
      "Yakuza Kiwami 3 & Dark Ties adds a story-heavy crime drama RPG with Japanese urban settings and strong character identity.",
    imageUrl: "/games/yakuza_header.webp",
    galleryImages: ["/games/yakuza1.jpg", "/games/yakuza2.jpg", "/games/yakuza3.jpg"],
    category: "RPG",
    platform: "Xbox, PlayStation, Nintendo Switch",
    platforms: ["Xbox", "PlayStation", "Nintendo Switch"],
    price: 89.95,
    stock: 14,
    releaseDate: new Date("2026-02-12T00:00:00"),
    active: true,
  },
  {
    id: 107,
    urlId: "the-legend-of-zelda-tears-of-the-kingdom",
    title: "The Legend of Zelda: Tears of the Kingdom",
    description:
      "Link explores Hyrule, sky islands, and the Depths while building vehicles, solving physics puzzles, and fighting to save the kingdom.",
    content:
      "Tears of the Kingdom is a flagship Nintendo Switch adventure with open-air exploration, creativity, crafting, and puzzle-solving.",
    imageUrl: "/games/zelda_header.jpg",
    galleryImages: ["/games/zalda1.jpg", "/games/zelda2.avif", "/games/zelda3.avif"],
    category: "Adventure",
    platform: "Nintendo Switch",
    platforms: ["Nintendo Switch"],
    price: 89.95,
    stock: 15,
    releaseDate: new Date("2023-05-12T00:00:00"),
    active: true,
  },
  {
    id: 108,
    urlId: "forza-horizon-6",
    title: "Forza Horizon 6",
    description:
      "An open-world racing game set in Japan, focused on scenic roads, car collecting, festival events, seasonal racing, and high-speed exploration.",
    content:
      "Forza Horizon 6 gives the Xbox shelf a visually strong racing product with car collecting and festival events.",
    imageUrl: "/games/forza_header.jpg",
    galleryImages: ["/games/forza1.jpg", "/games/forza2.jpg", "/games/forza3.jpg"],
    category: "Racing",
    platform: "Xbox",
    platforms: ["Xbox"],
    price: 109.95,
    stock: 12,
    releaseDate: new Date("2026-05-19T00:00:00"),
    active: true,
  },
  {
    id: 109,
    urlId: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    description:
      "A sci-fi open-world RPG set in Night City, with first-person combat, hacking, vehicles, branching missions, and cinematic storytelling.",
    content:
      "Cyberpunk 2077 adds a neon sci-fi RPG to the catalogue with hacking, vehicles, branching missions, and a strong visual identity.",
    imageUrl: "/games/cyberpunk_header.jpg",
    galleryImages: [
      "/games/cyberpunk1.jpg",
      "/games/cyberpunk2.jpg",
      "/games/cyberpunk3.jpg",
    ],
    category: "RPG",
    platform: "Xbox, PlayStation, Nintendo Switch",
    platforms: ["Xbox", "PlayStation", "Nintendo Switch"],
    price: 89.95,
    stock: 13,
    releaseDate: new Date("2020-12-10T00:00:00"),
    active: true,
  },
];

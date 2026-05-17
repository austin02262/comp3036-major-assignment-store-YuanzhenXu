export type AdminProduct = {
  id: number;
  urlId: string;
  title: string;
  description: string;
  imageUrl: string;
  galleryImages?: string[];
  category: string;
  platforms: string[];
  price: number;
  stock: number;
  releaseDate: string;
  releaseYear: number;
  active: boolean;
};

// Admin-side product seed data for the frontend prototype.
export const adminProducts: AdminProduct[] = [
  {
    id: 101,
    urlId: "god-of-war-ragnarok",
    title: "God of War Ragnarok",
    description:
      "Cinematic PlayStation action adventure across the Nine Realms.",
    imageUrl: "/games/god_header.jpg",
    category: "Action",
    platforms: ["PlayStation"],
    price: 94.95,
    stock: 11,
    releaseDate: "9 November 2022",
    releaseYear: 2022,
    active: true,
  },
  {
    id: 102,
    urlId: "halo-infinite",
    title: "Halo Infinite",
    description: "Sci-fi FPS with Master Chief, vehicles, and arena combat.",
    imageUrl: "/games/halo_header.jpg",
    category: "FPS",
    platforms: ["Xbox"],
    price: 59.95,
    stock: 18,
    releaseDate: "8 December 2021",
    releaseYear: 2021,
    active: true,
  },
  {
    id: 103,
    urlId: "mario-kart-8-deluxe",
    title: "Mario Kart 8 Deluxe",
    description: "Family-friendly kart racing with local and online multiplayer.",
    imageUrl: "/games/mario_header.jpg",
    category: "Racing",
    platforms: ["Nintendo Switch"],
    price: 79.95,
    stock: 16,
    releaseDate: "28 April 2017",
    releaseYear: 2017,
    active: true,
  },
  {
    id: 104,
    urlId: "ninja-gaiden-2-black",
    title: "NINJA GAIDEN 2 Black",
    description: "Fast sword combat, boss fights, and upgraded action visuals.",
    imageUrl: "/games/ninja_header.jpg",
    category: "Action",
    platforms: ["Xbox"],
    price: 79.95,
    stock: 18,
    releaseDate: "23 January 2025",
    releaseYear: 2025,
    active: true,
  },
  {
    id: 105,
    urlId: "marvels-spider-man-2",
    title: "Marvel's Spider-Man 2",
    description: "Peter Parker and Miles Morales swing through Marvel's New York.",
    imageUrl: "/games/spiderman_header.jpeg",
    category: "Action",
    platforms: ["PlayStation"],
    price: 124.95,
    stock: 9,
    releaseDate: "20 October 2023",
    releaseYear: 2023,
    active: true,
  },
  {
    id: 106,
    urlId: "yakuza-kiwami-3-dark-ties",
    title: "Yakuza Kiwami 3 & Dark Ties",
    description: "Story-heavy crime drama RPG across multiple consoles.",
    imageUrl: "/games/yakuza_header.webp",
    category: "RPG",
    platforms: ["Xbox", "PlayStation", "Nintendo Switch"],
    price: 89.95,
    stock: 14,
    releaseDate: "12 February 2026",
    releaseYear: 2026,
    active: true,
  },
  {
    id: 107,
    urlId: "the-legend-of-zelda-tears-of-the-kingdom",
    title: "The Legend of Zelda: Tears of the Kingdom",
    description: "Open-air Nintendo adventure with sky islands and creative tools.",
    imageUrl: "/games/zelda_header.jpg",
    category: "Adventure",
    platforms: ["Nintendo Switch"],
    price: 89.95,
    stock: 15,
    releaseDate: "12 May 2023",
    releaseYear: 2023,
    active: true,
  },
  {
    id: 108,
    urlId: "forza-horizon-6",
    title: "Forza Horizon 6",
    description: "Open-world racing, car collecting, and festival events.",
    imageUrl: "/games/forza_header.jpg",
    category: "Racing",
    platforms: ["Xbox"],
    price: 109.95,
    stock: 12,
    releaseDate: "19 May 2026",
    releaseYear: 2026,
    active: true,
  },
  {
    id: 109,
    urlId: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    description: "Sci-fi RPG set in Night City with hacking and branching missions.",
    imageUrl: "/games/cyberpunk_header.jpg",
    category: "RPG",
    platforms: ["Xbox", "PlayStation", "Nintendo Switch"],
    price: 89.95,
    stock: 13,
    releaseDate: "10 December 2020",
    releaseYear: 2020,
    active: true,
  },
];

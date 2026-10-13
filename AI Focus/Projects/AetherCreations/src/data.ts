export type Product = {
  id: number;
  name: string;
  type: string;
  price: number;
  /** Unsplash photo id, e.g. "photo-1626218174358-7769486c4b79". */
  photo: string;
  label?: string;
};

export type Slide = { photo: string; alt: string; title: string };

/** Replace with the studio's real address. */
export const STUDIO_EMAIL = "studio@aethercreations.example";

export const slides: Slide[] = [
  { photo: "photo-1626218174358-7769486c4b79", alt: "Black performance PC setup", title: "Engineered to disappear." },
  { photo: "photo-1593640408182-31c70c8268f5", alt: "Minimal desktop gaming setup", title: "Clarity at full power." },
  { photo: "photo-1573053986275-840ffc7cc685", alt: "Red and black custom PC", title: "Performance, distilled." },
];

export const prebuilts: Product[] = [
  { id: 1, name: "NOIR S1", type: "Creator / Studio", price: 2890, photo: slides[0].photo, label: "Best seller" },
  { id: 2, name: "VANTA R", type: "Competitive Gaming", price: 3490, photo: slides[2].photo, label: "New release" },
  { id: 3, name: "ARC MK II", type: "Performance Hybrid", price: 2190, photo: slides[1].photo },
  { id: 4, name: "MONOLITH X", type: "Enthusiast Gaming", price: 4290, photo: "photo-1660855551740-4474188debdb" },
  { id: 5, name: "FORM 01", type: "Compact Workstation", price: 1890, photo: "photo-1651012998667-2c779fee76f8" },
  { id: 6, name: "ONYX PRO", type: "AI / Production", price: 5690, photo: "photo-1603481588273-2f908a9a7a1b" },
];

export const parts: Product[] = [
  { id: 101, name: "RTX 5090 BLACK", type: "Graphics Card", price: 1999, photo: "photo-1591488320449-011701bb6704" },
  { id: 102, name: "APEX Z890", type: "Motherboard", price: 599, photo: "photo-1632749042303-7f7a18ed6ff0" },
  { id: 103, name: "CORE ULTRA 9", type: "Processor", price: 629, photo: "photo-1555617981-dac3880eac6e" },
  { id: 104, name: "FORGE 64", type: "DDR5 Memory", price: 289, photo: "photo-1562976540-1502c2145186" },
  { id: 105, name: "ZERO 2TB", type: "NVMe Storage", price: 219, photo: "photo-1597872200969-2b65d56bd16b" },
  { id: 106, name: "VECTOR 1200", type: "Power Supply", price: 349, photo: "photo-1587202372775-e229f172b9d7" },
];

/** Every purchasable product by id, used to rebuild the cart from storage. */
export const catalog = new Map<number, Product>([...prebuilts, ...parts].map((p) => [p.id, p]));

export const authPhoto = "photo-1632749042303-7f7a18ed6ff0";

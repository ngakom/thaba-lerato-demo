// Thaba Lerato is a made-up resort: this site is a demo of a resort booking website by MBT TechSphere Solutions.

export const SITE = {
  name: "Thaba Lerato Bush Resort",
  short: "Thaba Lerato",
  tagline: "Where the bushveld slows you down",
  area: "Waterberg, Limpopo",
  address: "R33 Vaalwater Road, Waterberg, Limpopo",
  phone: { display: "014 000 0000", tel: "+27140000000" },
  whatsapp: "27000000000",
  email: "stay@thabalerato.example",
  checkIn: "14:00",
  checkOut: "10:00",
  builtBy: { name: "MBT TechSphere Solutions", url: "https://www.mbttechsphere.co.za" },
};

export type UnitId = "chalet" | "cottage" | "treehouse" | "camp";

export type Unit = {
  id: UnitId;
  name: string;
  image: string;
  sleeps: number;
  count: number; // how many of this unit the resort has
  weekday: number; // rand per night, Sunday to Thursday
  weekend: number; // rand per night, Friday and Saturday
  summary: string;
  features: string[];
};

export const UNITS: Unit[] = [
  {
    id: "chalet",
    name: "Bush Chalet",
    image: "/images/chalet.jpg",
    sleeps: 2,
    count: 6,
    weekday: 1650,
    weekend: 1950,
    summary: "Thatched chalets for two with a king bed, outdoor shower and a private stoep facing the waterhole.",
    features: ["King bed", "Outdoor shower", "Private stoep", "Air-con"],
  },
  {
    id: "cottage",
    name: "Family Cottage",
    image: "/images/cottage.jpg",
    sleeps: 4,
    count: 3,
    weekday: 2600,
    weekend: 2950,
    summary: "Two bedrooms, a full kitchen and a wooden deck with braai, made for families and friends.",
    features: ["2 bedrooms", "Full kitchen", "Deck & braai", "Wi-Fi"],
  },
  {
    id: "treehouse",
    name: "Treehouse Suite",
    image: "/images/treehouse.jpg",
    sleeps: 2,
    count: 2,
    weekday: 3200,
    weekend: 3600,
    summary: "Raised among the marula trees, with a freestanding bath and open views over the bush.",
    features: ["Freestanding bath", "Canopy views", "Mini bar", "Breakfast included"],
  },
  {
    id: "camp",
    name: "Bush Camp Stand",
    image: "/images/camp.jpg",
    sleeps: 6,
    count: 10,
    weekday: 450,
    weekend: 520,
    summary: "Shaded stands with power points, a private braai area and clean ablutions close by.",
    features: ["Power point", "Braai area", "Shared ablutions", "Up to 6 people"],
  },
];

export type Extra = { id: string; name: string; price: number; per: "person" | "person per night" | "booking" };

export const EXTRAS: Extra[] = [
  { id: "breakfast", name: "Full breakfast", price: 185, per: "person per night" },
  { id: "drive", name: "Sunset game drive", price: 450, per: "person" },
  { id: "boma", name: "Boma dinner under the stars", price: 320, per: "person" },
  { id: "spa", name: "60-minute bush spa massage", price: 650, per: "person" },
];

/** Peak season: nightly rates go up by this much over the December holidays. */
export const PEAK = { from: "12-15", to: "01-10", uplift: 0.15 };

export const DEPOSIT = 0.5;

export const EXPERIENCES = [
  { title: "Sunset game drives", image: "/images/game-drive.jpg", text: "Open vehicles, expert rangers and a sundowner stop as the sky turns gold." },
  { title: "Rock pool & swimming", image: "/images/pool.jpg", text: "A pool set in the rocks, loungers in the shade and cold drinks from the bar." },
  { title: "Boma dinners", image: "/images/lounge.jpg", text: "Fireside dinners with potjie, braai and local wines under a sky full of stars." },
  { title: "Bush walks", image: "/images/rock-pool.jpg", text: "Guided morning walks along the river to spot birds, tracks and hidden pools." },
];

export const GALLERY = [
  { src: "/images/elephant.jpg", alt: "A young elephant in the bush" },
  { src: "/images/terrace.jpg", alt: "The lodge terrace looking out over the plains" },
  { src: "/images/giraffe.jpg", alt: "A giraffe feeding on a thorn tree" },
  { src: "/images/lounge-2.jpg", alt: "The main lodge lounge" },
  { src: "/images/waterhole.jpg", alt: "Antelope drinking at the waterhole at sunset" },
  { src: "/images/hero.jpg", alt: "Sunset over the bushveld" },
];

export const FAQS = [
  { q: "What time is check-in and check-out?", a: `Check-in is from ${SITE.checkIn} and check-out is by ${SITE.checkOut}.` },
  { q: "Do I pay a deposit?", a: "A 50% deposit secures your booking. The balance is paid on arrival." },
  { q: "Are children welcome?", a: "Yes. Family Cottages and Bush Camp stands are ideal for families. Children under 3 stay free." },
  { q: "Can I cancel?", a: "Cancel up to 14 days before arrival for a full refund of your deposit. After that the deposit is kept." },
  { q: "Is the resort malaria-free?", a: "Yes, the Waterberg is a malaria-free area." },
];

export const PHOTO_CREDITS = [
  { file: "hero.jpg", author: "Abspires40", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Kruger_National_Park,_South_Africa_(8341021265).jpg" },
  { file: "pool.jpg", author: "South African Tourism", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Zebula_Golf_Estate_%26_Spa,_Limpopo,_South_Africa_(4481908844).jpg" },
  { file: "chalet.jpg", author: "flowcomm", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Room_at_Jaci%27s_Tree_Lodge_(8596348122).jpg" },
  { file: "treehouse.jpg", author: "South African Tourism", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Jaci%27s_Lodge,_Madikwe_Game_Reserve,_North_West,_South_Africa_(20533373235).jpg" },
  { file: "cottage.jpg", author: "flowcomm", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Deck_outside_room,_Jaci%27s_Safari_Lodge_(8566003167).jpg" },
  { file: "lounge.jpg", author: "South African Tourism", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Jaci%27s_Lodge,_Madikwe_Game_Reserve,_North_West,_South_Africa_(20346899479).jpg" },
  { file: "lounge-2.jpg", author: "South African Tourism", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Jaci%27s_Lodge,_Madikwe_Game_Reserve,_North_West,_South_Africa_(20533427095).jpg" },
  { file: "camp.jpg", author: "South African Tourism", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Zebula_Golf_Estate_%26_Spa,_Limpopo,_South_Africa_(4481263237).jpg" },
  { file: "terrace.jpg", author: "South African Tourism", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Zebula_Golf_Estate_%26_Spa,_Limpopo,_South_Africa_(4481266035).jpg" },
  { file: "game-drive.jpg", author: "South African Tourism", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Game_Drive_Karoo_National_Park_-_Central_Karoo,_South_Africa_(3919196630).jpg" },
  { file: "rock-pool.jpg", author: "South African Tourism", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Mashovhela_Bush_Lodge_rock_pool,_Louis_Trichardt,_Limpopo,_South_Africa_(10185496643).jpg" },
  { file: "elephant.jpg", author: "flowcomm", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Young_elephant_(10902601393).jpg" },
  { file: "giraffe.jpg", author: "flowcomm", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Giraffe,_Kruger_National_Park,_South_Africa_(14800354577).jpg" },
  { file: "waterhole.jpg", author: "Jan Fleischmann", license: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:New_9792_sunset_Kruger_JF.jpg" },
];

export const rand = (n: number) => `R${Math.round(n).toLocaleString("en-ZA").replace(/,/g, " ")}`;

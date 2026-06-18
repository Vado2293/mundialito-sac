// app/data/players.ts

export type Rarity = "Gold" | "Silver" | "Bronze" | "Legendario";

export interface Player {
  id: number;
  name: string;
  country: string;
  overall: number;
  rarity: Rarity;
  image: string;
}

// Helper para repartir Bronze / Silver / Gold en secuencia
const rarities: Rarity[] = ["Bronze", "Silver", "Gold","Legendario"];

export const PLAYERS: Player[] = [
  // =======================
  // GRUPO A - ITALIA
  // =======================
  {
    id: 1,
    name: "Mario Perez",
    country: "Francia",
    overall: 84,
    rarity: "Gold",
    image: "/cards/mario.jpeg",
  },
  {
    id: 2,
    name: "Jesús Jimenez",
    country: "Francia",
    overall: 80,
    rarity: "Gold",
    image: "/cards/jesus.jpeg",
  },
  {
    id: 3,
    name: "Fabio Vargas",
    country: "Francia",
    overall: 82,
    rarity: "Gold",
    image: "/cards/fabio.jpeg",
  },
  {
    id: 4,
    name: "Nicol Hidalgo",
    country: "Francia",
    overall: 78,
    rarity: "Bronze",
    image: "/cards/nicol.jpeg",
  },
  {
    id: 5,
    name: "Daniela Gomez",
    country: "Francia",
    overall: 81,
    rarity: "Silver",
    image: "/cards/daniela.jpeg",
  },
  {
    id: 6,
    name: "Isnerd Solís",
    country: "Francia",
    overall: 79,
    rarity: "Gold",
    image: "/cards/isnerd.jpeg",
  },
  {
    id: 7,
    name: "Josseline Delgado",
    country: "Francia",
    overall: 77,
    rarity: "Silver",
    image: "/cards/josseline.jpeg",
  },

   {
    id: 8,
    name: "Daniela Fernandez",
    country: "Francia",
    overall: 77,
    rarity: "Gold",
    image: "/cards/danifer.jpeg",
  },


  // =======================
  // GRUPO B - ALEMANIA
  // =======================
  {
    id: 9,
    name: "Arianna Ródriguez",
    country: "Alemania",
    overall: 83,
    rarity: "Gold",
    image: "/cards/arianna.jpeg",
  },
  {
    id: 10,
    name: "Paola Torrez",
    country: "Alemania",
    overall: 80,
    rarity: "Bronze",
    image: "/cards/paola.jpeg",
  },
  {
    id: 11,
    name: "Daisy Juarez",
    country: "Alemania",
    overall: 79,
    rarity: "Silver",
    image: "/cards/daisy.jpeg",
  },
  {
    id: 12,
    name: "Karol Calvo",
    country: "Alemania",
    overall: 81,
    rarity: "Bronze",
    image: "/cards/karol.jpeg",
  },
  {
    id: 13,
    name: "Jimena Montero",
    country: "Alemania",
    overall: 78,
    rarity: "Bronze",
    image: "/cards/jimenamontero.jpeg",
  },
  {
    id: 14,
    name: "Mariela Matamoros",
    country: "Alemania",
    overall: 82,
    rarity: "Silver",
    image: "/cards/mariela.jpeg",
  },
  {
    id: 15,
    name: "Sandra Jiménez",
    country: "Alemania",
    overall: 76,
    rarity: "Silver",
    image: "/cards/sandra.jpeg",
  },
  
  {
    id: 16,
    name: "Ricardo Richmond",
    country: "Alemania",
    overall: 76,
    rarity: "Silver",
    image: "/cards/richi.jpeg",
  },


  // =======================
  // GRUPO C - (PAÍS LO AJUSTAS TÚ)
  // =======================
  {
    id: 17,
    name: "Valeria Vargas",
    country: "Portugal", // TODO: asignar país
    overall: 82,
    rarity: "Silver",
    image: "/cards/valeria.jpeg",
  },
  {
    id: 18,
    name: "Libby Sánchez",
    country: "Portugal", // TODO: asignar país
    overall: 79,
    rarity: "Silver",
    image: "/cards/libby.jpeg",
  },
  {
    id: 19,
    name: "Katherine Leitón",
    country: "Portugal", // TODO: asignar país
    overall: 80,
    rarity: "Gold",
    image: "/cards/katherine.jpeg",
  },
  {
    id: 20,
    name: "Aylin Arcia",
    country: "Portugal", // TODO: asignar país
    overall: 78,
    rarity: "Bronze",
    image: "/cards/aylin.jpeg",
  },
  {
    id: 21,
    name: "Marjorie Chavarría",
    country: "Portugal", // TODO: asignar país
    overall: 81,
    rarity: "Silver",
    image: "/cards/marjorie.jpeg",
  },

  {
    id: 22,
    name: "Andrey Palacios",
    country: "Portugal", // TODO: asignar país
    overall: 79,
    rarity: "Bronze",
    image: "/cards/andrey.jpeg",
  },
  {
    id: 23,
    name: "Linneth Morales",
    country: "Portugal", // TODO: asignar país
    overall: 78,
    rarity: "Silver",
    image: "/cards/linneth.jpeg",
  },

   {
    id: 24,
    name: "Yuneilyn Zeledón",
    country: "Portugal", // TODO: asignar país
    overall: 78,
    rarity: "Silver",
    image: "/cards/yune.jpeg",
  },

  // =======================
  // GRUPO D - COLOMBIA
  // =======================
  {
    id: 25,
    name: "Rafael Mora",
    country: "Colombia",
    overall: 84,
    rarity: "Bronze",
    image: "/cards/rafael.jpeg",
  },
  {
    id: 26,
    name: "Matías Ceciliano",
    country: "Colombia",
    overall: 82,
    rarity: "Bronze",
    image: "/cards/matias.jpeg",
  },
  {
    id: 27,
    name: "Jimena Vega",
    country: "Colombia",
    overall: 80,
    rarity: "Gold",
    image: "/cards/jimena.jpeg",
  },
  {
    id: 28,
    name: "Christian Carvajal",
    country: "Colombia",
    overall: 79,
    rarity: "Gold",
    image: "/cards/christian.jpeg",
  },
  {
    id: 29,
    name: "Victor Rivera",
    country: "Colombia",
    overall: 81,
    rarity: "Gold",
    image: "/cards/victor.jpeg",
  },
  {
    id: 30,
    name: "Cynthia Morales",
    country: "Colombia",
    overall: 77,
    rarity: "Silver",
    image: "/cards/cynthia.jpeg",
  },
  {
    id: 31,
    name: "Leonel Navarro",
    country: "Colombia",
    overall: 79,
    rarity: "Silver",
    image: "/cards/leonel.jpeg",
  },
  {
    id: 32,
    name: "Valerie Fernández",
    country: "Colombia",
    overall: 78,
    rarity: "Silver",
    image: "/cards/valerie.jpeg",
  },

  // =======================
  // GRUPO E - BRASIL
  // =======================
  {
    id: 33,
    name: "Kenneth Fallas",
    country: "Brasil",
    overall: 84,
    rarity: "Silver",
    image: "/cards/kenneth.jpeg",
  },
  {
    id: 34,
    name: "Hillary Campos",
    country: "Brasil",
    overall: 82,
    rarity: "Silver",
    image: "/cards/hillary.jpeg",
  },
  {
    id: 35,
    name: "Allison Sanchéz",
    country: "Brasil",
    overall: 80,
    rarity: "Gold",
    image: "/cards/allison.jpeg",
  },
  {
    id: 36,
    name: "Jaxiry Cantillo",
    country: "Brasil",
    overall: 79,
    rarity: "Silver",
    image: "/cards/jaxiry.jpeg",
  },
  {
    id: 37,
    name: "Gabriel Rivas",
    country: "Brasil",
    overall: 81,
    rarity: "Gold",
    image: "/cards/gabo.jpeg",
  },
  {
    id: 38,
    name: "Megan Bustos",
    country: "Brasil",
    overall: 78,
    rarity: "Silver",
    image: "/cards/megan.jpeg",
  },
  {
    id: 39,
    name: "Melany Montero",
    country: "Brasil",
    overall: 80,
    rarity: "Bronze",
    image: "/cards/melany.jpeg",
  },
  {
    id: 40,
    name: "Fanny Madrigal",
    country: "Brasil",
    overall: 79,
    rarity: "Gold",
    image: "/cards/fanny.jpeg",
  },

  // =======================
  // EXTRAS
  // =======================
  {
    id: 41,
    name: "Joseph Vado",
    country: "Extra",
    overall: 84,
    rarity: "Legendario",
    image: "/cards/vado.jpeg",
  },
  {
    id: 42,
    name: "Cinthya Gómez",
    country: "Extra",
    overall: 82,
    rarity: "Legendario",
    image: "/cards/cin.jpeg",
  },
  {
    id: 43,
    name: "Jose Valverde",
    country: "Extra",
    overall: 80,
    rarity: "Legendario",
    image: "/cards/jose.jpeg",
  },
  {
    id: 44,
    name: "Keila González",
    country: "Extra",
    overall: 79,
    rarity: "Legendario",
    image: "/cards/kei.jpeg",
  },

   {
    id: 45,
    name: "Paula González",
    country: "Extra",
    overall: 79,
    rarity: "Legendario",
    image: "/cards/pau.jpeg",
  },

   {
    id: 46,
    name: "Dayanna Gómez",
    country: "Extra",
    overall: 79,
    rarity: "Legendario",
    image: "/cards/daya.jpeg",
  },

   {
    id: 47,
    name: "Mónica Espinoza",
    country: "Extra",
    overall: 88,
    rarity: "Legendario",
    image: "/cards/moni.png",
  },



];

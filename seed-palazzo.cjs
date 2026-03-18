require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const Product = require('./server/src/models/Product');

const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/estacion-optica';

const palazzoProducts = [
  // Acetato
  { name: 'ALEJANDRO', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Marrón Carey', hex: '#8b4513' }] },
  { name: 'ALEXANDER', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Carey', hex: '#8b4513' }, { name: 'Vino', hex: '#722f37' }, { name: 'Gris Transparente', hex: '#d3d3d3' }] },
  { name: 'CARLOS', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Carey', hex: '#8b4513' }] },
  { name: 'DANIEL', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Gris', hex: '#808080' }, { name: 'Negro Carey', hex: '#2b2b2b' }, { name: 'Marrón', hex: '#a52a2a' }] },
  { name: 'EUGENIO', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Azul', hex: '#0000ff' }, { name: 'Marrón', hex: '#a52a2a' }] },
  { name: 'FREDDY', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Gris Plomo', hex: '#4f4f4f' }, { name: 'Negro', hex: '#000000' }, { name: 'Azul', hex: '#0000ff' }] },
  { name: 'GERARDO', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Bronce', hex: '#cd7f32' }, { name: 'Negro', hex: '#000000' }] },
  { name: 'JAVIER', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Marrón', hex: '#a52a2a' }, { name: 'Azul', hex: '#0000ff' }, { name: 'Negro', hex: '#000000' }, { name: 'Verde', hex: '#008000' }] },
  { name: 'JOSE', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Blanco Azulado', hex: '#f0f8ff' }, { name: 'Azul', hex: '#0000ff' }, { name: 'Verde', hex: '#008000' }] },
  { name: 'LEOPOLDO', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Verde Oliva', hex: '#556b2f' }, { name: 'Carey', hex: '#8b4513' }] },
  { name: 'MICHELE', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Gris', hex: '#808080' }, { name: 'Verde', hex: '#008000' }, { name: 'Negro', hex: '#000000' }, { name: 'Carey', hex: '#8b4513' }] },
  { name: 'NERJA', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Marrón', hex: '#a52a2a' }, { name: 'Transparente', hex: '#ffffff' }, { name: 'Negro', hex: '#000000' }, { name: 'Azul', hex: '#0000ff' }] },
  { name: 'PABLO', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Carey Gris', hex: '#8b4513' }, { name: 'Onix', hex: '#353839' }] },
  { name: 'TANELA', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Verde', hex: '#008000' }, { name: 'Carey', hex: '#8b4513' }] },
  { name: 'WILLY', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Azul Transparente', hex: '#add8e6' }, { name: 'Negro Transparente', hex: '#696969' }, { name: 'Carey', hex: '#8b4513' }] },
  
  // Metal
  { name: 'FAUSTINO', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Dorado Negro', hex: '#d4af37' }, { name: 'Carey', hex: '#8b4513' }, { name: 'Negro Carey', hex: '#2b2b2b' }] },
  { name: 'JOHAN', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Verde', hex: '#008000' }] },
  { name: 'MIGUEL', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Cromo Carey', hex: '#c0c0c0' }] },
  { name: 'OBED', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Marrón', hex: '#a52a2a' }, { name: 'Azul', hex: '#0000ff' }, { name: 'Negro', hex: '#000000' }, { name: 'Verde Gris', hex: '#2f4f4f' }] },

  // TR90
  { name: 'FRANK', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Gris Transparente', hex: '#d3d3d3' }, { name: 'Marrón', hex: '#a52a2a' }, { name: 'Carey', hex: '#8b4513' }] },
  { name: 'GHAEN', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Marrón Print', hex: '#a52a2a' }, { name: 'Verde Oliva', hex: '#556b2f' }] },
  { name: 'KADINO', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Naranja', hex: '#ffa500' }] },
  { name: 'KLAUSE', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Marrón Print', hex: '#a52a2a' }] },
  { name: 'LAUREANO', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Marrón Print', hex: '#a52a2a' }] },
  { name: 'LEONARDO', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Marrón Print', hex: '#a52a2a' }] },
  { name: 'NELEO', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Madera', hex: '#deb887' }] },
  { name: 'THAIPAN', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Madera Carey', hex: '#deb887' }] },
  { name: 'LEVAN', brand: 'Palazzo', category: 'monturas', gender: 'hombre', colors: [{ name: 'Negro', hex: '#000000' }] }
];

async function seedProducts() {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB');

    const result = await Product.insertMany(palazzoProducts);
    console.log(`Successfully added ${result.length} Palazzo products!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedProducts();

import { ExpoConfig } from 'expo/config';

// Load konfigurasi dasar dari app.json
const appJson = require('./app.json');

module.exports = () => {
  // Cek apakah kita sedang build versi PREVIEW?
  const isPreview = process.env.APP_VARIANT === 'preview';

  return {
    ...appJson.expo, // Ambil semua settingan lama
    
    // GANTI NAMA: Kalau preview jadi "Avocan", kalau bukan tetap "Avocado"
    name: isPreview ? "Avocan" : appJson.expo.name,
    
    // GANTI ID: Tambahkan .preview di belakang package name
    // Supaya bisa diinstall berdampingan
    android: {
      ...appJson.expo.android,
      package: isPreview 
        ? "com.ardi_expo.avocado.preview" 
        : "com.ardi_expo.avocado",
    },
  };
};
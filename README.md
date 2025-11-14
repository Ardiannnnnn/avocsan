# 🥑 Avocado Scanner -- Machine Learning Mobile App

**Avocado Scanner** adalah aplikasi mobile berbasis **React Native**
untuk mendeteksi **tingkat kematangan alpukat** menggunakan **Machine
Learning on-device**.\
Aplikasi ini memanfaatkan kamera ponsel untuk melakukan deteksi
real-time dan menampilkan bounding box beserta hasil klasifikasi
seperti:

-   **Unripe (Mentah)**
-   **Ripe (Matang)**
-   **Overripe (Terlalu matang)**

Aplikasi ini dibangun menggunakan:

-   **React Native (Expo Bare Workflow)**
-   **TensorFlow Lite / TFJS**
-   **Expo Router**
-   **NativeWind (Tailwind CSS)**
-   **Camera API**

## ✨ Fitur Utama

-   📸 Scan alpukat real-time melalui kamera
-   🤖 Deteksi kematangan menggunakan machine learning offline
-   ⚡ Bounding box dan confidence score
-   🎨 UI modern menggunakan Tailwind (NativeWind)
-   🚀 Build Android & iOS
-   🔒 100% offline

## 🛠️ Teknologi

-   React Native (Bare Workflow)
-   TensorFlow Lite / TensorFlow JS
-   Expo Router
-   NativeWind (Tailwind CSS)
-   expo-camera / vision-camera

## 🚀 Menjalankan Proyek

### 1. Clone Repository

    git clone https://github.com/USERNAME/avocado-scanner.git
    cd avocado-scanner

### 2. Install Dependency

    npm install

### 3. Jalankan Aplikasi

    npx expo start

> Model ML tidak termasuk repository. Tambahkan manually ke:

    assets/models/

## 📁 Struktur Project

    src/
     ├── components/
     ├── screens/
     ├── ml/
     ├── utils/

    assets/
     ├── models/
     ├── images/

    android/

## 🚀 Deployment

    npx eas-cli build

## 📜 Lisensi

MIT License.

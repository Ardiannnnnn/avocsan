// 📁 LOKASI: src/constants/config.ts
// ✅ FINAL CONFIG untuk Azure

import { Platform } from 'react-native';

// Azure server
const AZURE_IP = '70.153.137.30';
const AZURE_PORT = '8000';

export const API_CONFIG = {
  BASE_URL: `http://${AZURE_IP}:${AZURE_PORT}`,
  TIMEOUT: 30000,
};

export const WS_URL = `ws://${AZURE_IP}:${AZURE_PORT}/ws/detect`;

// Debug log
if (__DEV__) {
  console.log('═══════════════════════════════════════');
  console.log('🌐 AZURE SERVER CONFIGURATION');
  console.log('═══════════════════════════════════════');
  console.log('Platform:', Platform.OS);
  console.log('API URL:', API_CONFIG.BASE_URL);
  console.log('WebSocket URL:', WS_URL);
  console.log('═══════════════════════════════════════\n');
}
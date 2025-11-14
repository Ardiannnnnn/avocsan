// 📁 LOKASI: src/hooks/useRealtimeScan.ts
// 🔧 UPDATE - Fix bbox type

import { useState, useEffect, useRef } from 'react';
import { wsService } from '../services/websocket';
import { Alert } from 'react-native';

interface Detection {
  class_name: string;
  confidence: number;
  bbox: [number, number, number, number]; // ✅ Tuple, bukan array
}

interface DetectionResult {
  type: string;
  timestamp: number;
  detections: Detection[];
  image_size: {
    width: number;
    height: number;
  };
}

export const useRealtimeScan = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ ADD: Track previous status to prevent duplicate logs
  const prevConnectedRef = useRef<boolean>(false);

  useEffect(() => {
    console.log('🚀 [Hook] Initializing WebSocket connection...');
    
    // Connect WebSocket
    wsService.connect();
    
    // Check connection status
    const checkConnection = setInterval(() => {
      const connected = wsService.isConnected();
      
      // ✅ FIX: Only log if status actually changed
      if (connected !== prevConnectedRef.current) {
        console.log('📊 [Hook] Connection status changed:', connected);
        prevConnectedRef.current = connected;
        setIsConnected(connected);
        
        if (connected) {
          setError(null);
        }
      }
    }, 1000);

    // Ping every 30 seconds
    const pingInterval = setInterval(() => {
      if (wsService.isConnected()) {
        wsService.sendPing();
      }
    }, 30000);

    // Subscribe to results
    const unsubscribe = wsService.onResult((data: DetectionResult) => {
      console.log('✅ [Hook] Received detection result');
      console.log('🎯 [Hook] Detections found:', data.detections?.length || 0);
      
      setResult(data);
      setDetections(data.detections || []);
      setError(null);
    });

    return () => {
      console.log('🧹 [Hook] Cleaning up...');
      clearInterval(checkConnection);
      clearInterval(pingInterval);
      unsubscribe();
      wsService.disconnect();
    };
  }, []);

  const scanImage = (base64Image: string) => {
    if (!isConnected) {
      const errorMsg = 'WebSocket not connected';
      console.error('❌', errorMsg);
      setError(errorMsg);
      Alert.alert('Error', 'Tidak terhubung ke server. Silakan tunggu...');
      return;
    }

    console.log('📸 [Hook] Sending image for scan...');
    wsService.sendImage(base64Image);
  };

  const getDominantDetection = (): Detection | null => {
    if (detections.length === 0) return null;
    
    return detections.reduce((prev, current) => 
      current.confidence > prev.confidence ? current : prev
    );
  };

  const mapToUIFormat = (detection: Detection | null) => {
    if (!detection) return null;

    const classMap: Record<string, any> = {
      'mentah': {
        stage: 'Mentah',
        emoji: '🟢',
        color: '#10b981',
        days: '5-7 hari lagi matang',
        recommendation: 'Simpan di suhu ruang untuk mematangkan'
      },
      'matang': {
        stage: 'Matang Sempurna',
        emoji: '🟠',
        color: '#f59e0b',
        days: 'Siap dikonsumsi',
        recommendation: 'Terbaik untuk smoothie dan guacamole'
      },
      'terlalu_matang': {
        stage: 'Terlalu Matang',
        emoji: '🟤',
        color: '#78716c',
        days: 'Segera konsumsi',
        recommendation: 'Gunakan untuk masker wajah atau kompos'
      },
      'busuk': {
        stage: 'Busuk',
        emoji: '⚫',
        color: '#1f2937',
        days: 'Tidak layak konsumsi',
        recommendation: 'Buang atau jadikan kompos'
      }
    };

    const mapped = classMap[detection.class_name] || classMap['matang'];
    
    return {
      ...mapped,
      confidence: Math.round(detection.confidence * 100),
      bbox: detection.bbox,
    };
  };

  return {
    isConnected,
    result,
    detections,
    error,
    scanImage,
    getDominantDetection,
    mapToUIFormat,
  };
};
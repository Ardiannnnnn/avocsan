// 📁 LOKASI: src/services/websocket.ts
// 🔧 UPDATE - Tambahkan detailed logging

import { WS_URL } from '../constant/config';

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Set<(data: any) => void> = new Set();

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('⚠️ WebSocket already connected');
      return;
    }
    console.log('🔌 Connecting to WebSocket...');
    console.log('🌐 URL:', WS_URL);
    
    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log('✅ WebSocket Connected to Azure!');
        console.log('📡 Connection established at:', new Date().toLocaleTimeString());
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📥 Received message:', message.type || 'unknown');
          
          if (message.type === 'detection_result') {
            console.log('🎯 Detection count:', message.detections?.length || 0);
            this.listeners.forEach(callback => callback(message));
          } else if (message.type === 'pong') {
            console.log('💓 Pong received - connection alive');
          } else if (message.type === 'error') {
            console.error('❌ Server error:', message.message);
          } else {
            console.log('📦 Other message:', message);
          }
        } catch (error) {
          console.error('❌ Parse error:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        console.error('🔍 Error details:', JSON.stringify(error, null, 2));
      };

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket closed');
        console.log('📊 Close code:', event.code);
        console.log('📝 Close reason:', event.reason || 'No reason provided');
        
        if (event.code !== 1000) {
          console.warn('⚠️ Abnormal closure - attempting reconnect in 3s...');
          setTimeout(() => this.connect(), 3000);
        }
      };
      
    } catch (error) {
      console.error('❌ Failed to create WebSocket:', error);
    }
  }

  disconnect() {
    if (this.ws) {
      console.log('🔌 Disconnecting WebSocket...');
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }

  sendImage(base64Image: string, timestamp?: number) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify({
        type: 'image',
        data: base64Image,
        timestamp: timestamp || Date.now(),
      });
      
      console.log('📤 Sending image to Azure...');
      console.log('📏 Payload size:', (payload.length / 1024).toFixed(2), 'KB');
      this.ws.send(payload);
    } else {
      console.error('❌ Cannot send - WebSocket not connected');
      console.log('🔍 Current state:', this.ws?.readyState);
    }
  }

  sendPing() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify({ type: 'ping' });
      console.log('💓 Sending ping...');
      this.ws.send(payload);
    }
  }

  onResult(callback: (data: any) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  isConnected() {
    const connected = this.ws?.readyState === WebSocket.OPEN;
    return connected;
  }
}

export const wsService = new WebSocketService();
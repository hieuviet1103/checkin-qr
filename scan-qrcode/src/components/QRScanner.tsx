'use client';

import jsQR from 'jsqr';
import { useEffect, useRef, useState } from 'react';
import styles from './QRScanner.module.css';

interface QRScannerProps {
  onScan: (code: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const lastScanData = useRef<string | null>(null);
  const lastScanTime = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    populateCameraList();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const populateCameraList = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameras(videoDevices);

      if (videoDevices.length > 0) {
        const arrNameDefault = ["camera mặt sau", "back camera", "camera sau", "camera chính", "main camera", "camera chính sau"];
        const defaultCamera = videoDevices.find(cam => 
          arrNameDefault.some(name => cam.label.toLowerCase().includes(name))
        );
        startCamera(defaultCamera?.deviceId || videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error("Lỗi khi liệt kê thiết bị:", error);
    }
  };

  const startCamera = async (deviceId: string) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    const constraints = {
      video: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        facingMode: { ideal: "environment" }
      }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        requestAnimationFrame(scanQRCode);
      }
    } catch (error) {
      console.error("Không thể truy cập camera:", error);
    }
  };

  const scanQRCode = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      requestAnimationFrame(scanQRCode);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    const currentTime = Date.now();
    if (code && code.data !== lastScanData.current) {
      console.log('code', code?.data, ':', lastScanData.current);
      
      lastScanData.current = code.data;
      lastScanTime.current = currentTime;

      onScan(code.data);
    }else {
      if (lastScanTime.current && currentTime - lastScanTime.current < 5000) {
        //requestAnimationFrame(scanQRCode);
        console.log('return')
        //return;
      }else{
        lastScanData.current = "";
      }
    }

    setTimeout(() => {
      requestAnimationFrame(scanQRCode);
  }, 200); // Delay before scanning again

    //requestAnimationFrame(scanQRCode);
  };

  return (
    <div className={styles.videoContainer}>
      <video 
        ref={videoRef} 
        className={styles.preview} 
        autoPlay 
        playsInline 
      />
      <div className={styles.qrCodeArea} />
      <select 
        value={selectedCamera} 
        onChange={(e) => {
          setSelectedCamera(e.target.value);
          startCamera(e.target.value);
        }}
        className={styles.cameraSelect}
      >
        <option value="">Choose Camera</option>
        {cameras.map(camera => (
          <option key={camera.deviceId} value={camera.deviceId}>
            {camera.label || `Camera ${camera.deviceId}`}
          </option>
        ))}
      </select>
    </div>
  );
} 
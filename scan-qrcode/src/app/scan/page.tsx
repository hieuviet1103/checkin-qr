"use client";

import QRScanner from "@/components/QRScanner";
import { getCookie } from "cookies-next";
import { useCallback, useEffect, useState } from "react";
import styles from "./scan.module.css";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  [key: string]: string | number | boolean | null;
}

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<string>("");
  const [scanHistory, setScanHistory] = useState<string[]>([]);
  const [sessionName, setSessionName] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson) as UserInfo;
      setSessionName(user.name || 'Unnamed Session');
    }
    
    // Cấu hình baseUrl cho API
    setBaseUrl("http://localhost:8080/api/scan");
  }, []);

  useEffect(() => {
    if(code){
      console.log("code", code);
    }
  },[code]);

  const getData = useCallback(
    async (data: string) => {
      try {
        console.log("getData", data);
        if (!baseUrl) return null;
        
        const authToken = getCookie('auth_token');
        if (!authToken) {
          console.error("No auth token found");
          return null;
        }
        
        const response = await fetch(baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            code: data,
          }),
        });
        
        if (!response.ok)
          throw new Error(`Response status: ${response.status}`);
          
        return await response.json();
      } catch (error) {
        console.error(error);
      }
    },
    [code, baseUrl]
  );

  const handleScan = async (code: string) => {
    try {
      console.log("handleScan", code);
      setCode(code);
      const dataCheckin = await getData(code);
      if (dataCheckin) {
        const resultText =
          dataCheckin.CustomerID > 0
            ? `${code} - ${dataCheckin.FullName}`
            : `${code} X ${dataCheckin.FullName}`;

        setScanResult(resultText);
        setScanHistory((prev) => [resultText, ...prev]);
        playNotification();
      }
    } catch (error) {
      console.error("Error processing data:", error);
    }
  };

  const playNotification = () => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.2;

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);

    setTimeout(() => {
      const oscillator2 = ctx.createOscillator();
      const gainNode2 = ctx.createGain();

      oscillator2.type = "triangle";
      oscillator2.frequency.value = 1760;
      gainNode2.gain.value = 0.2;

      oscillator2.connect(gainNode2);
      gainNode2.connect(ctx.destination);

      oscillator2.start();
      oscillator2.stop(ctx.currentTime + 0.1);
    }, 120);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Checkin {sessionName}</h2>
      </div>

      <div className={styles.scanSection}>
        <div className={styles.cameraControls}>
          <label>SCAN QR CODE</label>
          <input
            type="text"
            value={scanResult}
            readOnly
            placeholder="qr code"
            className={styles.resultInput}
          />
        </div>

        <QRScanner onScan={handleScan} />

        <div className={styles.historySection}>
          <label>Scan Result</label>
          <textarea
            value={scanHistory.join("\n")}
            readOnly
            className={styles.historyTextarea}
          />
          <button className={styles.listButton}>list in group</button>
        </div>
      </div>
    </div>
  );
}

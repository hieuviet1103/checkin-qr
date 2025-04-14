"use client";

import QRScanner from "@/components/QRScanner";
import api from "@/lib/api";
import { useCallback, useEffect, useState } from "react";
import styles from "./scan.module.css";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  roles: string[];
  sessions: UserSession[];
  //[key: string]: string | number | boolean | string[] | null | UserSession[];
}

interface UserSession {
  session_id: number;
  session_name: string;
  base_url: string;
  start_time: string;
  end_time: string;
}

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<string>("");
  const [scanHistory, setScanHistory] = useState<string[]>([]);
  const [code, setCode] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson) as UserInfo;
      setUserInfo(user);
      console.log(userJson, user)
      // Lấy thông tin session từ localStorage
     const currentSessionJson = user?.sessions[0];
     if (currentSessionJson) {
       setCurrentSession(currentSessionJson);
     }
    }
    
  }, []);

  useEffect(() => {
    // Lấy session đầu tiên khi có thông tin user
    const getFirstSession = async () => {
      if (userInfo) {
        try {
          // const response = await api.get(`/sessions/user/${userInfo.id}?limit=1`);
          // if (response.data && response.data.length > 0) {
          //   setSessionName(response.data[0].name || 'Unnamed Session');
          // }
        } catch (error) {
          console.error('Error fetching first session:', error);
        }
      }
    };

    getFirstSession();
  }, [userInfo]);

  useEffect(() => {
    if(code){
      console.log("code", code);
    }
  },[code]);

  const getData = useCallback(
    async (data: string) => {
      try {
        console.log("getData", data);
        
        const response = await api.post(currentSession?.base_url ?? '/scan', {
          code: data,
        });
        
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
    [code]
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
        <h2>Checkin {currentSession?.session_name}</h2>
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

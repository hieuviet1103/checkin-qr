"use client";

import QRScanner from "@/components/QRScanner";
import { useCallback, useEffect, useState } from "react";
import styles from "./scan.module.css";

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<string>("");
  const [scanHistory, setScanHistory] = useState<string[]>([]);
  const [sessionName, setSessionName] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session = params.get("session");

    if (session) {
      getSession(session);
    }
  }, []);

  useEffect(() => {
    if(code){
      console.log("code", code);
    }
  },[code]);

  const getSession = async (session: string) => {
    try {
      const response = await fetch(
        `https://api2.travel.com.vn/auto/webhook/checkin-session?session=${session}`,
        {
          method: "GET",
          headers: {
            token: "checkin",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const json = await response.json();
      setBaseUrl(json.BaseUrl);
      setSessionName(json.SessionName);
    } catch (error) {
      console.error(error);
    }
  };

  const getData = useCallback(
    async (data: string) => {
      try {
        console.log("getData", data);
        if (!baseUrl) return null;
        const response = await fetch(baseUrl, {
          method: "POST",
          headers: {
            token: "checkin",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session: new URLSearchParams(window.location.search).get("session"),
            user: new URLSearchParams(window.location.search).get("user"),
            data: data,
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

// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [hourlyStats, setHourlyStats] = useState([]);

  // Saatlik istatistikleri al
  const fetchHourlyStats = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/appointments/hourly-stats");
      const stats = await response.json();
      
      // Veriyi grafik formatına dönüştür
      const chartData = [
        ["Saat", "Randevu Sayısı"],
        ...Object.entries(stats).map(([hour, count]) => [
          `${hour}:00`,
          count
        ])
      ];
      
      setHourlyStats(chartData);
    } catch (error) {
      console.error("İstatistikler alınırken hata oluştu:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      // Kullanıcı verilerini al
      fetch("http://localhost:8080/api/protected-data", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.error("Veri alırken hata oluştu:", error));

      // Saatlik istatistikleri al
      fetchHourlyStats();

      // WebSocket bağlantısı
      const socket = new SockJS('http://localhost:8080/ws');
      const stompClient = Stomp.over(socket);

      stompClient.connect({}, (frame) => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/appointments', (message) => {
          const data = JSON.parse(message.body);
          if (data.type === "APPOINTMENT_CREATED") {
            fetchHourlyStats();
          }
        });
      });

      return () => {
        if (stompClient.connected) {
          stompClient.disconnect();
        }
      };
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {data ? (
        <div>
          <h3>Hoş geldiniz, {data.username}!</h3>
          
          {/* Saatlik Randevu Grafiği */}
          <div className="chart-container">
            <h4>Saatlik Randevu İstatistikleri</h4>
            {hourlyStats.length > 0 ? (
              <Chart
                chartType="BarChart"
                width="100%"
                height="400px"
                data={hourlyStats}
                options={{
                  title: "Günlük Randevu Dağılımı",
                  hAxis: {
                    title: "Saat",
                  },
                  vAxis: {
                    title: "Randevu Sayısı",
                    minValue: 0,
                  },
                }}
              />
            ) : (
              <p>Henüz randevu verisi bulunmuyor.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Yükleniyor...</p>
      )}
    </div>
  );
};

export default Dashboard;

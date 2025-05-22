import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const OccupancyChart = () => {
  const [occupancyData, setOccupancyData] = useState([]);

  // Çalışma saatlerini oluştur (08:00-22:00)
  const initializeHours = () => {
    const hours = [];
    for (let i = 8; i <= 22; i++) {
      hours.push({
        saat: `${i.toString().padStart(2, '0')}:00`,
        doluluk: 0
      });
    }
    return hours;
  };

  useEffect(() => {
    const fetchOccupancy = async () => {
      try {
        // Bugünün tarihini al
        const today = new Date().toISOString().split('T')[0];
        
        // Veritabanından bugünün randevularını çek
        const response = await axios.get(`/api/appointments/${today}`);
        const appointments = response.data;

        // Başlangıçta tüm saatleri 0 dolulukla başlat
        const hourlyOccupancy = initializeHours();

        // Her randevu için doluluk oranını güncelle
        appointments.forEach(appointment => {
          const hour = new Date(appointment.datetime).getHours();
          const hourIndex = hour - 8; // 8'den başladığımız için
          if (hourIndex >= 0 && hourIndex < hourlyOccupancy.length) {
            hourlyOccupancy[hourIndex].doluluk += 20; // Her randevu %20 doluluk ekler
          }
        });

        setOccupancyData(hourlyOccupancy);
      } catch (error) {
        console.error('Doluluk oranları alınırken hata:', error);
      }
    };

    fetchOccupancy();
    // Her 5 dakikada bir güncelle
    const interval = setInterval(fetchOccupancy, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getBarColor = (doluluk) => {
    if (doluluk < 50) return "#4CAF50";  // yeşil
    if (doluluk < 80) return "#FFC107";  // sarı
    return "#F44336";  // kırmızı
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>Günlük Doluluk Oranı</h3>
      <ResponsiveContainer>
        <BarChart data={occupancyData}>
          <XAxis dataKey="saat" />
          <YAxis domain={[0, 100]} /> {/* 0-100 arası yüzde göster */}
          <Tooltip />
          <Bar
            dataKey="doluluk"
            label={{ position: 'top' }}
            fillOpacity={0.8}
            fill={({ doluluk }) => getBarColor(doluluk)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OccupancyChart; 
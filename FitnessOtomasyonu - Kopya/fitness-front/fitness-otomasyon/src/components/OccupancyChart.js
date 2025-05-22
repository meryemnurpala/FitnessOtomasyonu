import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const OccupancyChart = () => {
  const [occupancyData, setOccupancyData] = useState([]);
  const MAX_CAPACITY = 100; // Salon kapasitesi 100 kişi

  // Çalışma saatlerini oluştur (08:00-22:00)
  const initializeHours = () => {
    const hours = [];
    for (let i = 8; i <= 22; i++) {
      hours.push({
        saat: `${i.toString().padStart(2, '0')}:00`,
        doluluk: 0,
        randevuSayisi: 0
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
        const response = await axios.get(`http://localhost:8080/api/appointments/stats?date=${today}`);
        
        // Başlangıçta tüm saatleri 0 dolulukla başlat
        const hourlyOccupancy = initializeHours();

        // API'den gelen veriyi işle
        if (response.data) {
          Object.entries(response.data).forEach(([hour, count]) => {
            const hourIndex = parseInt(hour) - 8; // 8'den başladığımız için
            if (hourIndex >= 0 && hourIndex < hourlyOccupancy.length) {
              // Her saat için doluluk oranını hesapla
              hourlyOccupancy[hourIndex].randevuSayisi = count;
              hourlyOccupancy[hourIndex].doluluk = Math.min(100, (count / MAX_CAPACITY) * 100);
            }
          });
        }

        setOccupancyData(hourlyOccupancy);
      } catch (error) {
        console.error('Doluluk oranları alınırken hata:', error);
        // Hata durumunda boş veri göster
        setOccupancyData(initializeHours());
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="mb-1"><strong>{label}</strong></p>
          <p className="mb-0">Doluluk: %{payload[0].value.toFixed(1)}</p>
          <p className="mb-0">Randevu Sayısı: {payload[0].payload.randevuSayisi} / {MAX_CAPACITY}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 300, marginBottom: '2rem' }}>
      <h3 className="text-center mb-4">Günlük Doluluk Oranı</h3>
      <ResponsiveContainer>
        <BarChart data={occupancyData}>
          <XAxis dataKey="saat" />
          <YAxis domain={[0, 100]} /> {/* 0-100 arası yüzde göster */}
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="doluluk"
            label={{ 
              position: 'top',
              formatter: (value) => `%${value.toFixed(1)}`
            }}
            fillOpacity={0.8}
            fill={({ doluluk }) => getBarColor(doluluk)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OccupancyChart; 
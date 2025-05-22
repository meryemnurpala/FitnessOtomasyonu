import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const appointmentTypes = [
  "PERSONAL_TRAINING",
  "GROUP_TRAINING",
  "CARDIO",
  "STRENGTH",
  "FLEXIBILITY"
];

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
];

const MAX_CAPACITY = 100; // Maksimum kapasite sabiti

function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [occupancyData, setOccupancyData] = useState([]); // Doluluk verisi için state
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Lütfen önce giriş yapın!");
      navigate("/login");
      return;
    }
    fetchAppointments(user.id);
  }, [navigate]);

  const fetchAppointments = async (userId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/appointments/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log("Gelen randevular:", response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Randevular yüklenirken bir hata oluştu!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("Lütfen önce giriş yapın!");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        return;
      }

      const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      // Tarihi Türkiye saat dilimi ile ayarla
      const turkishDate = new Date(appointmentDateTime.getTime());
      const isoString = turkishDate.toISOString().replace('Z', '+03:00');
      
      console.log("Seçilen tarih:", appointmentDateTime);
      console.log("Türkiye saati:", turkishDate);
      console.log("ISO string:", isoString);
      
      const appointmentData = {
        userId: user.id,
        appointmentDate: isoString,
        appointmentType: selectedType,
        notes: notes
      };

      await axios.post(
        "http://localhost:8080/api/appointments",
        appointmentData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess("Randevu başarıyla oluşturuldu!");
      fetchAppointments(user.id);
      resetForm();
    } catch (error) {
      console.error("Error creating appointment:", error);
      setError(error.response?.data || "Randevu oluşturulurken bir hata oluştu!");
    }
  };

  const resetForm = () => {
    setSelectedDate("");
    setSelectedTime("");
    setSelectedType("");
    setNotes("");
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        return;
      }

      await axios.delete(
        `http://localhost:8080/api/appointments/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess("Randevu başarıyla iptal edildi!");
      fetchAppointments(JSON.parse(localStorage.getItem("user")).id);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setError("Randevu iptal edilirken bir hata oluştu!");
    }
  };

  const getAppointmentTypeDisplay = (type) => {
    const typeMap = {
      "PERSONAL_TRAINING": "Kişisel Antrenman",
      "GROUP_TRAINING": "Grup Antrenmanı",
      "CARDIO": "Kardio",
      "STRENGTH": "Kuvvet Antrenmanı",
      "FLEXIBILITY": "Esneklik Antrenmanı"
    };
    return typeMap[type] || type;
  };

  const fetchOccupancy = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        return;
      }

      // Türkiye saatine göre bugünün tarihini al
      const today = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD formatında

      const response = await axios.get(
        `http://localhost:8080/api/appointments/occupancy?date=${today}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Saatleri sıfırla
      const hourlyOccupancy = Array(13).fill().map(() => ({
        saat: "",
        randevuSayisi: 0,
        doluluk: 0
      }));

      // Saatleri ayarla (8:00'dan 20:00'a kadar)
      for (let i = 0; i < hourlyOccupancy.length; i++) {
        const hour = i + 8;
        hourlyOccupancy[i].saat = `${hour.toString().padStart(2, '0')}:00`;
      }

      // Backend'den gelen verileri işle
      if (response.data) {
        Object.entries(response.data).forEach(([hour, count]) => {
          const hourIndex = parseInt(hour) - 8; // 8'den başladığımız için
          if (hourIndex >= 0 && hourIndex < hourlyOccupancy.length) {
            hourlyOccupancy[hourIndex].randevuSayisi = count;
            hourlyOccupancy[hourIndex].doluluk = Math.min(100, (count / MAX_CAPACITY) * 100);
          }
        });
      }

      setOccupancyData(hourlyOccupancy);
    } catch (error) {
      console.error("Doluluk oranı alınırken hata oluştu:", error);
      setError("Doluluk oranı alınırken bir hata oluştu!");
    }
  };

  return (
    <div 
      className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center py-4"
      style={{
        backgroundImage: "url('https://www.pixelstalk.net/wp-content/uploads/images6/GYM-Fitness-Wallpaper-HD.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="position-absolute top-0 start-0 m-3 d-flex align-items-center p-2 rounded">
        <img
          src="/images/image1.png"
          alt="Salon Logo"
          className="me-2"
          style={{ width: "100px", height: "100px", objectFit: "contain" }}
        />
      </div>
      
      <div className="row w-100 justify-content-center">
        <div className="col-md-5">
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-center mb-4">Yeni Randevu</h2>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Randevu Tarihi</label>
                <input
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Randevu Saati</label>
                <select
                  className="form-control"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                >
                  <option value="">Saat Seçin</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Randevu Tipi</label>
                <select
                  className="form-control"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  required
                >
                  <option value="">Tip Seçin</option>
                  {appointmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {getAppointmentTypeDisplay(type)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Notlar</label>
                <textarea
                  className="form-control"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="2"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Randevu Oluştur
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-5">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-center mb-4">Randevularım</h2>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Saat</th>
                    <th>Tip</th>
                    <th>Durum</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => {
                    const appointmentDate = new Date(appointment.appointmentDate);
                    return (
                      <tr key={appointment.id}>
                        <td>{appointmentDate.toLocaleDateString('tr-TR')}</td>
                        <td>{appointmentDate.toLocaleTimeString('tr-TR', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          timeZone: 'Europe/Istanbul'
                        })}</td>
                        <td>{getAppointmentTypeDisplay(appointment.appointmentType)}</td>
                        <td>{appointment.status}</td>
                        <td>
                          {appointment.status === "PENDING" && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              İptal
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointment;

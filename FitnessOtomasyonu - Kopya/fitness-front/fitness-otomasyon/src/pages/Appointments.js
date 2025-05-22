import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Appointments() {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userAppointments, setUserAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      alert("Lütfen önce giriş yapın!");
      navigate("/login");
      return;
    }
    setUser(userData);
    fetchUserAppointments(userData.id);
  }, [navigate]);

  const fetchUserAppointments = async (userId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/appointments/user/${userId}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Kullanıcının rezervasyonları:", response.data);
      setUserAppointments(response.data);
    } catch (error) {
      console.error("Randevular alınırken hata oluştu:", error);
      if (error.response?.status === 401) {
        setError("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else {
        setError("Randevular yüklenirken bir hata oluştu!");
      }
      setUserAppointments([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        return;
      }

      // Seçilen tarih ve saati birleştir
      const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      const appointmentData = {
        userId: user.id,
        appointmentDate: appointmentDateTime.toISOString(),
        appointmentType: appointmentType,
        notes: notes
      };

      console.log("Gönderilen randevu verisi:", appointmentData);

      await axios.post(
        "http://localhost:8080/api/appointments",
        appointmentData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess("Randevunuz başarıyla oluşturuldu!");
      // Formu temizle
      setSelectedDate("");
      setSelectedTime("");
      setAppointmentType("");
      setNotes("");
      // Randevu listesini güncelle
      fetchUserAppointments(user.id);
    } catch (error) {
      console.error("Randevu oluşturma hatası:", error);
      setError(error.response?.data || "Randevu oluşturulurken bir hata oluştu.");
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Bu randevuyu iptal etmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        return;
      }

      await axios.delete(
        `http://localhost:8080/api/appointments/${appointmentId}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess("Randevunuz başarıyla iptal edildi!");
      // Randevu listesini güncelle
      fetchUserAppointments(user.id);
    } catch (error) {
      console.error("Randevu iptal hatası:", error);
      if (error.response?.status === 401) {
        setError("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else {
        setError("Randevu iptal edilirken bir hata oluştu.");
      }
    }
  };

  const getAppointmentTypeDisplay = (type) => {
    const types = {
      PERSONAL_TRAINING: "Kişisel Antrenman",
      GROUP_TRAINING: "Grup Antrenmanı",
      CARDIO: "Kardio",
      STRENGTH: "Kuvvet Antrenmanı",
      FLEXIBILITY: "Esneklik Antrenmanı"
    };
    return types[type] || type;
  };

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundImage: "url('https://www.pixelstalk.net/wp-content/uploads/images6/GYM-Fitness-Wallpaper-HD.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-center mb-4">Randevu Al</h2>
              
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
                  <label htmlFor="date" className="form-label">Tarih</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="time" className="form-label">Saat</label>
                  <select
                    className="form-select"
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                  >
                    <option value="">Saat Seçin</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="type" className="form-label">Randevu Tipi</label>
                  <select
                    className="form-select"
                    id="type"
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    required
                  >
                    <option value="">Tip Seçin</option>
                    <option value="PERSONAL_TRAINING">Kişisel Antrenman</option>
                    <option value="GROUP_TRAINING">Grup Antrenmanı</option>
                    <option value="CARDIO">Kardio</option>
                    <option value="STRENGTH">Kuvvet Antrenmanı</option>
                    <option value="FLEXIBILITY">Esneklik Antrenmanı</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">Notlar</label>
                  <textarea
                    className="form-control"
                    id="notes"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Randevu Al
                  </button>
                </div>
              </form>

              {/* Randevu Listesi */}
              <div className="mt-5">
                <h3 className="text-center mb-4">Randevularım</h3>
                {userAppointments.length === 0 ? (
                  <p className="text-center">Henüz randevunuz bulunmamaktadır.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped">
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
                        {userAppointments.map((appointment) => (
                          <tr key={appointment.id}>
                            <td>{new Date(appointment.appointmentDate).toLocaleDateString('tr-TR')}</td>
                            <td>{new Date(appointment.appointmentDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</td>
                            <td>{getAppointmentTypeDisplay(appointment.appointmentType)}</td>
                            <td>
                              <span className={`badge ${appointment.status === 'PENDING' ? 'bg-warning' : 'bg-success'}`}>
                                {appointment.status === 'PENDING' ? 'Bekliyor' : 'Onaylandı'}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleCancelAppointment(appointment.id)}
                              >
                                İptal Et
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointments; 
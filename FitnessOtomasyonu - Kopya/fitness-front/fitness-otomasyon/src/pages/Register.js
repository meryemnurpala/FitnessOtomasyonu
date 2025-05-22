import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form } from "react-bootstrap";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    membershipType: "",
    adminCode: "",
    membershipDuration: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Form validasyonu
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.phone) {
        alert("Lütfen tüm alanları doldurun!");
        return;
      }

      if (formData.membershipType === "USER" && !formData.membershipDuration) {
        alert("Lütfen üyelik süresini seçin!");
        return;
      }

      if (formData.membershipType === "ADMIN" && !formData.adminCode) {
        alert("Lütfen admin kodunu girin!");
        return;
      }

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.membershipType === "ADMIN" ? "ADMIN" : "USER",
        adminCode: formData.adminCode,
        membershipType: formData.membershipType,
        membershipDuration: formData.membershipType === "USER" ? parseInt(formData.membershipDuration) : null
      };

      console.log("Gönderilen veri:", userData);

      const response = await axios.post("http://localhost:8080/api/users/register", userData);

      if (response.data) {
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      if (error.response) {
        // Sunucudan gelen hata mesajını göster
        alert(error.response.data.message || "Kayıt işlemi başarısız. Lütfen tekrar deneyin.");
      } else if (error.request) {
        // İstek yapıldı ama yanıt alınamadı
        alert("Sunucuya bağlanılamıyor. Lütfen daha sonra tekrar deneyin.");
      } else {
        // İstek oluşturulurken hata oluştu
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
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
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-center mb-4">Kayıt Ol</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Ad</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Soyad</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Telefon</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Örn: 0555 555 55 55"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">E-posta</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Şifre</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Üyelik Tipi</Form.Label>
                <Form.Select
                  value={formData.membershipType}
                  onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
                >
                  <option value="">Seçiniz</option>
                  <option value="USER">Üye</option>
                  <option value="ADMIN">Admin</option>
                </Form.Select>
              </Form.Group>
              {formData.membershipType === "USER" && (
                <Form.Group className="mb-3">
                  <Form.Label>Üyelik Süresi</Form.Label>
                  <Form.Select
                    value={formData.membershipDuration}
                    onChange={(e) => setFormData({ ...formData, membershipDuration: e.target.value })}
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="1">1 Aylık Üyelik</option>
                    <option value="3">3 Aylık Üyelik</option>
                    <option value="6">6 Aylık Üyelik</option>
                    <option value="12">1 Yıllık Üyelik</option>
                  </Form.Select>
                </Form.Group>
              )}
              {formData.membershipType === "ADMIN" && (
                <Form.Group className="mb-3">
                  <Form.Label>Admin Kodu</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.adminCode}
                    onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                    placeholder="Admin kodunu giriniz"
                  />
                </Form.Group>
              )}
              <button type="submit" className="btn btn-primary w-100">
                Kayıt Ol
              </button>
            </form>
            <div className="text-center mt-3">
              <a href="/login" className="text-decoration-none">
                Zaten hesabınız var mı? Giriş yapın
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

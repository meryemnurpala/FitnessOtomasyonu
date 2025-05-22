import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import OccupancyChart from "../components/OccupancyChart";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
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
      {/* Üst Menü */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img
              src="/images/image1.png"
              alt="Salon Logo"
              className="me-2"
              style={{ width: "50px", height: "50px", objectFit: "contain" }}
            />
            FitLife Fitness Salonu
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Ana Sayfa
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className="nav-link" 
                  href="/appointments"
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      alert("Lütfen önce giriş yapın!");
                      navigate("/login");
                    }
                  }}
                >
                  Randevu Al
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/training-programs">
                  Antrenman Programları
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/bmi">
                  BMI Hesapla
                </a>
              </li>
            </ul>
            <ul className="navbar-nav">
              {user ? (
                <div className="d-flex align-items-center">
                  <span className="text-white me-3">Hoş geldin, {user.name}</span>
                  {user.role === "ADMIN" && (
                    <a href="/admin" className="btn btn-warning me-2">
                      Üye Yönetimi
                    </a>
                  )}
                  <button className="btn btn-outline-light" onClick={handleLogout}>
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/login">
                      Giriş Yap
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/register">
                      Kayıt Ol
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Ana İçerik */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h1 className="display-4 text-white mb-4">FitLife Fitness Salonu</h1>
            <p className="lead text-white mb-5">
              Sağlıklı bir yaşam için doğru adres
            </p>
            {!user && (
              <div className="d-flex justify-content-center gap-3">
                <a href="/register" className="btn btn-primary btn-lg">
                  Kayıt Ol
                </a>
                <a href="/login" className="btn btn-primary btn-lg">
                  Giriş Yap
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-12">
            <div className="bg-white p-4 rounded shadow">
              <OccupancyChart />
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-4">
            <div className="card bg-dark text-white mb-4">
              <div className="card-body">
                <h5 className="card-title">Profesyonel Eğitmenler</h5>
                <p className="card-text">
                  Uzman kadromuzla size özel antrenman programları sunuyoruz.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-dark text-white mb-4">
              <div className="card-body">
                <h5 className="card-title">Modern Ekipmanlar</h5>
                <p className="card-text">
                  En son teknoloji fitness ekipmanlarıyla hizmetinizdeyiz.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-dark text-white mb-4">
              <div className="card-body">
                <h5 className="card-title">Esnek Çalışma Saatleri</h5>
                <p className="card-text">
                  7/24 açık salonumuzla size en uygun zamanda hizmet veriyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

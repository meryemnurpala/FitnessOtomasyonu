import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function BMI() {
  const [weight, setWeight] = useState(""); // Kilo
  const [height, setHeight] = useState(""); // Boy
  const [bmi, setBmi] = useState(null); // Hesaplanan BMI
  const [category, setCategory] = useState(""); // BMI kategorisi


  // BMI hesaplama fonksiyonu
  const calculateBMI = () => {
    if (!weight || !height || isNaN(weight) || isNaN(height)) {
      alert("Lütfen geçerli bir kilo ve boy girin.");
      return;
    }

    // Boyu metreye çevirme
    const heightInMeters = height / 100;
    // BMI hesaplama
    const calculatedBMI = weight / (heightInMeters * heightInMeters);
    setBmi(calculatedBMI.toFixed(2));

    // BMI kategorisini belirleme
    if (calculatedBMI < 18.5) {
      setCategory("Zayıf");
    } else if (calculatedBMI >= 18.5 && calculatedBMI < 24.9) {
      setCategory("Normal");
    } else if (calculatedBMI >= 25 && calculatedBMI < 29.9) {
      setCategory("Fazla Kilolu");
    } else {
      setCategory("Obez");
    }
  };

  return (
    
    <div 
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: "url('https://www.pixelstalk.net/wp-content/uploads/images6/GYM-Fitness-Wallpaper-HD.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="position-absolute top-0 start-0 m-3 d-flex align-items-center p-2 rounded">
        <img
          src="/images/image1.png" // Logonun yolunu buraya ekleyin
          alt="Salon Logo"
          className="me-2"
          style={{ width: "150px", height: "150px", objectFit: "contain" }}
        />
      </div>
      <div className="bg-white p-5 rounded shadow-lg text-center">
        <h2 className="mb-4">Vücut Kitle Endeksi (BMI) Hesaplama</h2>

        <div className="mb-3">
          <label className="form-label">Kilo (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Boy (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="form-control"
          />
        </div>

        <button onClick={calculateBMI} className="btn btn-primary w-100">
          BMI Hesapla
        </button>

        {bmi && (
          <div className="mt-4 p-3 bg-light rounded">
            <p className="fs-5 fw-bold">Hesaplanan BMI: {bmi}</p>
            <p className="fs-5">Kategori: <strong>{category}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BMI;

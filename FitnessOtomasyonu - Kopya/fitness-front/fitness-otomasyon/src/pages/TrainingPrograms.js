import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function TrainingPrograms() {
  const schedule = [
    { time: "13:00 - 15:00", monday: "Pilates \n Ayşe İldem Öztürk", friday: "Pilates\n Ayşe İldem Öztürk", wednesday: "Boks \n Esmanur Beyaz", saturday: "Boks \nEsmanur Beyaz" },
    { time: "16:00 - 17:00", tuesday: "Zumba \nZeynep Arslanyürek", thursday: "Zumba \n Zeynep Arslanyürek" },
    { time: "16:00 - 18:00", sunday: "Yoga \n Meryemnur Pala" },
    { time: "21:00 - 23:00", wednesday: "Boks \n Mertcan Kaya", saturday: "Boks \n Mertcan Kaya" },
  ];

  const trainers = [
    { name: "Muhammet Eren Başaran" },
    { name: "Emircan Bağcı" },
    { name: "Nafiye Çakı"},
    { name: "Samet Temel"},
    { name: "Mahir Erol" },
  ];

  return (
    <div 
      className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center py-4"
      style={{
        backgroundImage: "url('https://www.pixelstalk.net/wp-content/uploads/images6/GYM-Fitness-Wallpaper-HD.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Logo */}
      <div className="position-absolute top-0 start-0 m-3 d-flex align-items-center p-2 rounded">
        <img
          src="/images/image1.png"
          alt="Salon Logo"
          className="me-2"
          style={{ width: "100px", height: "100px", objectFit: "contain" }}
        />
      </div>

      {/* FitLife Antrenman Programı Başlığı */}
      <h1 className="text-white text-center fw-bold mb-4">FitLife Antrenman Programı</h1>

      {/* Antrenman Programı ve Antrenörler */}
      <div className="container mt-5">
        <div className="row">
          {/* Antrenman Programı */}
          <div className="col-md-9">
            <div className="bg-white p-4 rounded shadow">
              <table className="table table-bordered text-center" style={{ width: "100%", minWidth: "750px" }}>
                <thead className="table-dark">
                  <tr>
                    <th>Saat</th>
                    <th>Pazartesi</th>
                    <th>Salı</th>
                    <th>Çarşamba</th>
                    <th>Perşembe</th>
                    <th>Cuma</th>
                    <th>Cumartesi</th>
                    <th>Pazar</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((session, index) => (
                    <tr key={index}>
                      <td className="fw-bold">{session.time}</td>
                      <td style={{ whiteSpace: "pre-line" }}>{session.monday || "-"}</td>
                      <td style={{ whiteSpace: "pre-line" }}>{session.tuesday || "-"}</td>
                      <td style={{ whiteSpace: "pre-line" }}>{session.wednesday || "-"}</td>
                      <td style={{ whiteSpace: "pre-line" }}>{session.thursday || "-"}</td>
                      <td style={{ whiteSpace: "pre-line" }}>{session.friday || "-"}</td>
                      <td style={{ whiteSpace: "pre-line" }}>{session.saturday || "-"}</td>
                      <td style={{ whiteSpace: "pre-line" }}>{session.sunday || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fitness Antrenörleri */}
          <div className="col-md-3">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-center mb-4">Fitness Antrenörleri</h2>
              <div className="d-flex flex-column align-items-center">
                {trainers.map((trainer, index) => (
                  <div key={index} className="p-3 mb-3 text-center bg-warning text-dark rounded" 
                       style={{ width: "90%", fontWeight: "bold", fontSize: "18px" }}>
                    {trainer.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainingPrograms;
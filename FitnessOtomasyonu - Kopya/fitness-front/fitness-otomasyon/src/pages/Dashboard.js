import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const navigate = useNavigate();
  const [appointmentStats, setAppointmentStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    occupancyRate: 0,
    tomorrowAppointments: 0,
    tomorrowOccupancyRate: 0,
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Randevu Sayısı",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "ADMIN") {
      alert("Bu sayfaya erişim yetkiniz yok!");
      navigate("/");
      return;
    }

    // İlk veri yüklemesi
    fetchAppointmentStats();
    fetchChartData();

    // WebSocket bağlantısı
    const ws = new WebSocket("ws://localhost:8080/ws");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "APPOINTMENT_STATS") {
        setAppointmentStats(data.stats);
      } else if (data.type === "CHART_DATA") {
        setChartData(data.chartData);
      }
    };

    // Cleanup function
    return () => {
      ws.close();
    };
  }, [navigate]);

  const fetchAppointmentStats = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get("http://localhost:8080/api/appointments/stats", {
        headers: { Authorization: token },
      });
      setAppointmentStats(response.data);
    } catch (error) {
      console.error("Randevu istatistikleri alınırken hata oluştu:", error);
    }
  };

  const fetchChartData = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get("http://localhost:8080/api/appointments/chart-data", {
        headers: { Authorization: token },
      });
      setChartData(response.data);
    } catch (error) {
      console.error("Grafik verileri alınırken hata oluştu:", error);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Günlük Randevu İstatistikleri",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
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
        <div className="col-md-8">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-center mb-4">Dashboard</h2>
            <Row>
              <Col md={3}>
                <Card bg="success" text="white" className="mb-3">
                  <Card.Body>
                    <Card.Title>Toplam Randevu</Card.Title>
                    <Card.Text>
                      <h2>{appointmentStats.totalAppointments}</h2>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card bg="info" text="white" className="mb-3">
                  <Card.Body>
                    <Card.Title>Tamamlanan</Card.Title>
                    <Card.Text>
                      <h2>{appointmentStats.completedAppointments}</h2>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card bg="warning" text="white" className="mb-3">
                  <Card.Body>
                    <Card.Title>Bekleyen</Card.Title>
                    <Card.Text>
                      <h2>{appointmentStats.pendingAppointments}</h2>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card bg="primary" text="white" className="mb-3">
                  <Card.Body>
                    <Card.Title>Yarının Doluluk Oranı</Card.Title>
                    <Card.Text>
                      <h2>{appointmentStats.tomorrowOccupancyRate}%</h2>
                      <p>{appointmentStats.tomorrowAppointments} Randevu</p>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <div className="mt-4">
              <Line options={options} data={chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 
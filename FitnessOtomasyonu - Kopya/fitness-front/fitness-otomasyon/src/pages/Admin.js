import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";

const AdminStyles = styled.div`
  .admin-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .tab-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: #f0f0f0;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .tab-button:hover {
    background-color: #e0e0e0;
  }

  .tab-button.active {
    background-color: #007bff;
    color: white;
  }

  .admin-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .admin-content h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }

  .table-container {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
  }

  tr:hover {
    background-color: #f5f5f5;
  }

  .delete-button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .delete-button:hover {
    background-color: #c82333;
  }
`;

function Admin() {
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    membershipType: "",
    isApproved: false
  });
  const [selectedTab, setSelectedTab] = useState('users');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "ADMIN") {
      alert("Bu sayfaya erişim yetkiniz yok!");
      navigate("/");
      return;
    }
    console.log("Admin sayfası yüklendi, kullanıcı:", user);
    fetchUsers();
    fetchReservations();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        navigate("/login");
        return;
      }

      // Token'ı temizle
      const cleanToken = token.trim();

      const response = await axios.get("http://localhost:8080/api/users/all", {
        headers: { 
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Backend'den gelen ham veri:", JSON.stringify(response.data, null, 2));
      
      // Sadece USER rolündeki kullanıcıları filtrele ve approved değerini isApproved olarak dönüştür
      const filteredUsers = response.data
        .filter(user => user.role === "USER")
        .map(user => ({
          ...user,
          isApproved: user.approved // approved değerini isApproved olarak dönüştür
        }));
      
      console.log("Filtrelenmiş ve dönüştürülmüş kullanıcılar:", JSON.stringify(filteredUsers, null, 2));
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Kullanıcılar alınırken hata oluştu:", error);
      if (error.response?.status === 401) {
        alert("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else {
        alert("Kullanıcılar alınırken bir hata oluştu!");
      }
    }
  };

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        navigate("/login");
        return;
      }

      const cleanToken = token.trim();
      console.log("Rezervasyonlar için token:", cleanToken); // Token kontrolü
      
      const response = await axios.get("http://localhost:8080/api/appointments/all", {
        headers: { 
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Backend'den gelen rezervasyon verileri:", JSON.stringify(response.data, null, 2));
      setReservations(response.data);
    } catch (error) {
      console.error("Rezervasyonlar alınırken hata oluştu:", error);
      if (error.response?.status === 401) {
        alert("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else {
        alert("Rezervasyonlar alınırken bir hata oluştu!");
      }
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      membershipType: user.membershipType
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Bu üyeyi silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        navigate("/login");
        return;
      }

      // Token'ı temizle
      const cleanToken = token.trim();

      console.log("Silme isteği gönderiliyor, userId:", userId);
      const response = await axios.delete(`http://localhost:8080/api/users/${userId}`, {
        headers: { 
          'Authorization': `Bearer ${cleanToken}`
        }
      });
      
      console.log("Silme yanıtı:", response.data);
      
      // Kullanıcı listesini güncelle
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.filter(user => user.id !== userId);
        console.log("Güncellenmiş kullanıcı listesi:", JSON.stringify(updatedUsers, null, 2));
        return updatedUsers;
      });
      
      alert("Üye başarıyla silindi!");
    } catch (error) {
      console.error("Üye silinirken hata oluştu:", error);
      if (error.response?.status === 401) {
        alert("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else if (error.response?.status === 403) {
        alert("Bu işlem için yetkiniz bulunmamaktadır!");
      } else if (error.response?.status === 400) {
        alert("Geçersiz istek: " + (error.response?.data?.message || "Kullanıcı silinemiyor."));
      } else {
        alert("Üye silinirken bir hata oluştu: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        navigate("/login");
        return;
      }
      console.log("Onaylama isteği gönderiliyor, userId:", userId);
      const response = await axios.put(`http://localhost:8080/api/users/${userId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Backend'den gelen onay yanıtı:", JSON.stringify(response.data, null, 2));
      
      // Kullanıcı listesini güncelle
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.map(user => {
          if (user.id === userId) {
            console.log("Güncellenecek kullanıcı:", JSON.stringify(user, null, 2));
            const updatedUser = {
              ...response.data,
              isApproved: response.data.approved // approved değerini isApproved olarak dönüştür
            };
            console.log("Yeni kullanıcı bilgisi:", JSON.stringify(updatedUser, null, 2));
            return updatedUser;
          }
          return user;
        });
        console.log("Güncellenmiş kullanıcı listesi:", JSON.stringify(updatedUsers, null, 2));
        return updatedUsers;
      });
      
      alert("Üye başarıyla onaylandı!");
    } catch (error) {
      console.error("Üye onaylanırken hata oluştu:", error);
      if (error.response?.status === 401) {
        alert("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else {
        alert("Üye onaylanırken bir hata oluştu!");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        navigate("/login");
        return;
      }
      await axios.put(
        `http://localhost:8080/api/users/${selectedUser.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Üye güncellenirken hata oluştu:", error);
      if (error.response?.status === 401) {
        alert("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else {
        alert("Üye güncellenirken bir hata oluştu!");
      }
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (!window.confirm("Bu rezervasyonu silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        navigate("/login");
        return;
      }

      const cleanToken = token.trim();
      console.log("Rezervasyon silme isteği gönderiliyor, reservationId:", reservationId);
      
      await axios.delete(`http://localhost:8080/api/appointments/${reservationId}`, {
        headers: { 
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Rezervasyon listesini güncelle
      setReservations(prevReservations => {
        const updatedReservations = prevReservations.filter(res => res.id !== reservationId);
        console.log("Güncellenmiş rezervasyon listesi:", JSON.stringify(updatedReservations, null, 2));
        return updatedReservations;
      });
      
      alert("Rezervasyon başarıyla silindi!");
    } catch (error) {
      console.error("Rezervasyon silinirken hata oluştu:", error);
      if (error.response?.status === 401) {
        alert("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else if (error.response?.status === 403) {
        alert("Bu işlem için yetkiniz bulunmamaktadır!");
      } else {
        alert("Rezervasyon silinirken bir hata oluştu: " + (error.response?.data?.message || error.message));
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
        <div className="col-md-10">
          <div className="bg-white p-4 rounded shadow">
            <Tabs defaultActiveKey="users" id="admin-tabs">
              <Tab eventKey="users" title="Üye Yönetimi">
                <h2 className="text-center mb-4">Üye Yönetimi</h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Ad</th>
                      <th>Soyad</th>
                      <th>E-posta</th>
                      <th>Telefon</th>
                      <th>Üyelik Tipi</th>
                      <th>Üyelik Başlangıç</th>
                      <th>Üyelik Bitiş</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.membershipType}</td>
                        <td>{user.membershipStartDate ? new Date(user.membershipStartDate).toLocaleDateString('tr-TR') : '-'}</td>
                        <td>{user.membershipEndDate ? new Date(user.membershipEndDate).toLocaleDateString('tr-TR') : '-'}</td>
                        <td>
                          <Button
                            variant={user.isApproved === true ? "secondary" : "success"}
                            size="sm"
                            className="me-2"
                            onClick={() => handleApprove(user.id)}
                            disabled={user.isApproved === true}
                          >
                            {user.isApproved === true ? "Onaylandı" : "Onayla"}
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(user)}
                          >
                            Düzenle
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            Sil
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>

              <Tab eventKey="reservations" title="Rezervasyonlar">
                <h2 className="text-center mb-4">Rezervasyon Yönetimi</h2>
                {reservations.length === 0 ? (
                  <div className="text-center">
                    <p>Henüz rezervasyon bulunmamaktadır.</p>
                  </div>
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Üye</th>
                        <th>Tarih</th>
                        <th>Saat</th>
                        <th>Tip</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                          <td>{reservation.userFirstName} {reservation.userLastName}</td>
                          <td>{new Date(reservation.appointmentDate).toLocaleDateString('tr-TR')}</td>
                          <td>{new Date(reservation.appointmentDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</td>
                          <td>{reservation.appointmentType}</td>
                          <td>
                            <span className={`badge ${reservation.status === 'PENDING' ? 'bg-warning' : 'bg-success'}`}>
                              {reservation.status === 'PENDING' ? 'Bekliyor' : 'Onaylandı'}
                            </span>
                          </td>
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteReservation(reservation.id)}
                            >
                              Sil
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Üye Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Ad</Form.Label>
              <Form.Control
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Soyad</Form.Label>
              <Form.Control
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>E-posta</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Üyelik Tipi</Form.Label>
              <Form.Control
                type="text"
                value={formData.membershipType}
                onChange={(e) =>
                  setFormData({ ...formData, membershipType: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Kaydet
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Admin; 
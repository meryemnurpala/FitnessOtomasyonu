import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
            }

            const response = await axios.get('http://localhost:8080/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Kullanıcılar yüklenirken hata oluştu:', error);
            setError('Kullanıcılar yüklenirken bir hata oluştu');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleApprove = async (userId) => {
        console.log('handleApprove başladı, userId:', userId); // Debug log
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
            }

            const response = await axios.put(
                `http://localhost:8080/api/users/${userId}/approve`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Backend yanıtı:', response.data); // Debug log

            if (response.data) {
                // Kullanıcı listesini yeniden yükle
                fetchUsers();
                setMessage('Üye başarıyla onaylandı');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Üye onaylanırken hata oluştu:', error);
            if (error.response?.status === 403) {
                setError('Bu işlem için admin yetkisi gerekiyor');
            } else {
                setError(error.response?.data?.message || 'Üye onaylanırken bir hata oluştu');
            }
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
                }

                const response = await axios.delete(
                    `http://localhost:8080/api/users/${userId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.status === 200) {
                    // Kullanıcıyı listeden kaldır
                    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                    setMessage('Kullanıcı başarıyla silindi');
                    setTimeout(() => setMessage(''), 3000);
                }
            } catch (error) {
                console.error('Üye silinirken hata oluştu:', error);
                setError(error.response?.data?.message || 'Üye silinirken bir hata oluştu');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Kullanıcı Yönetimi</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Ad</th>
                            <th>Soyad</th>
                            <th>E-posta</th>
                            <th>Telefon</th>
                            <th>Üyelik Tipi</th>
                            <th>Üyelik Başlangıç</th>
                            <th>Üyelik Bitiş</th>
                            <th>Onay Durumu</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.membershipType}</td>
                                <td>{user.membershipStartDate ? new Date(user.membershipStartDate).toLocaleDateString('tr-TR') : '-'}</td>
                                <td>{user.membershipEndDate ? new Date(user.membershipEndDate).toLocaleDateString('tr-TR') : '-'}</td>
                                <td>
                                    {user.isApproved ? (
                                        <span className="badge bg-success">Onaylandı</span>
                                    ) : (
                                        <span className="badge bg-warning">Onay Bekliyor</span>
                                    )}
                                </td>
                                <td>
                                    <button 
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleEditUser(user)}
                                    >
                                        Düzenle
                                    </button>
                                    {user.isApproved ? (
                                        <button 
                                            className="btn btn-sm btn-secondary"
                                            disabled
                                        >
                                            Onaylandı
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn btn-sm btn-success"
                                            onClick={() => handleApprove(user.id)}
                                        >
                                            Onayla
                                        </button>
                                    )}
                                    <button 
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin; 
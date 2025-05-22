import React, { useState, useEffect } from 'react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Kullanıcılar yüklenemedi');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError(error.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleApproveUser = async (userId) => {
        try {
            const response = await fetch(`/api/users/${userId}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData || 'Kullanıcı onaylama işlemi başarısız oldu');
            }

            const updatedUser = await response.json();
            console.log('Backend yanıtı:', updatedUser);

            // Kullanıcı listesini güncelle
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userId ? updatedUser : user
                )
            );

            // Başarı mesajı göster
            setMessage('Kullanıcı başarıyla onaylandı');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Hata:', error);
            setError(error.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
            try {
                const response = await fetch(`/api/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) throw new Error('Kullanıcı silinemedi');

                setUsers(users.filter(user => user.id !== userId));
                setMessage('Kullanıcı başarıyla silindi');
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                setError(error.message);
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleEditUser = (user) => {
        // Düzenleme işlemi için gerekli kodlar
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
                                    {!user.isApproved && (
                                        <button 
                                            className="btn btn-sm btn-success"
                                            onClick={() => handleApproveUser(user.id)}
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

export default UserManagement; 
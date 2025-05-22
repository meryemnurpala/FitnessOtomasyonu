const fetchTimeSlotStats = async (date) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Oturum bulunamadı. Lütfen giriş yapın.');
        }

        const response = await axios.get(
            `http://localhost:8080/api/appointments/stats?date=${date}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data) {
            setTimeSlotStats(response.data);
        }
    } catch (error) {
        console.error('Error fetching time slot stats:', error);
        if (error.response?.status === 401) {
            // Token geçersiz veya süresi dolmuş
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else {
            setError('Randevu istatistikleri yüklenirken bir hata oluştu');
            setTimeout(() => setError(''), 3000);
        }
    }
}; 
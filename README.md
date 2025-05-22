# Fitness Otomasyonu

## Proje Hakkında
Fitness Otomasyonu, modern bir spor salonu yönetim sistemi sunan web tabanlı bir uygulamadır. Bu sistem, spor salonu üyelerinin ve yöneticilerinin ihtiyaçlarını karşılamak için tasarlanmıştır.

## Özellikler

### 1. Vücut Kitle İndeksi (VKİ) Hesaplama
- Kullanıcılar boy ve kilo bilgilerini girerek VKİ'lerini hesaplayabilir
- Sonuçlar kategorilere göre değerlendirilir (Zayıf, Normal, Fazla Kilolu, Obez)

### 2. Üyelik ve Randevu Sistemi
- Kullanıcılar sisteme üyelik talebi gönderebilir
- Admin (Salon Sahibi) üyelik taleplerini onaylayabilir veya reddedebilir
- Onaylanan üyeler online randevu alabilir
- Salon doluluk oranlarını görüntüleyebilir
- Randevu geçmişini takip edebilir
- Admin tüm randevuları görüntüleyebilir ve yönetebilir

### 3. Antrenman Programları
- Çeşitli spor dalları için özel programlar
- Haftalık ders programı görüntüleme
- Programlara online kayıt olma imkanı

### 4. Ders Programları
- Boks
- Pilates
- Yoga
- Fitness
- Diğer grup dersleri

## Teknik Detaylar

### Frontend
- React.js
- Modern ve kullanıcı dostu arayüz
- Responsive tasarım

### Backend
- Spring Boot
- RESTful API
- PostgreSQL veritabanı
- Güvenli kimlik doğrulama ve yetkilendirme

## Kurulum

##Kullanılan IDE
Frontend:VsCode
Backend : INTELLIJ 
Database: PostgreSQL

1. Projeyi klonlayın:
```bash
git clone https://github.com/meryemnurpala/FitnessOtomasyonu.git
```

2. Frontend bağımlılıklarını yükleyin:
```bash
cd fitness-front/fitness-otomasyon
npm install
```

3. Backend için gerekli ayarları yapın:
- PostgreSQL veritabanını kurun ve yapılandırın
- `application.properties` dosyasında veritabanı bağlantı ayarlarını yapın

4. Uygulamayı başlatın:
```bash
# Frontend için
npm start

# Backend için (Spring Boot)
./mvnw spring-boot:run
```

## Kullanım

### Üyeler İçin
1. Ana sayfadan üyelik talebi gönderin
2. Üyeliğiniz onaylandıktan sonra giriş yapın
3. VKİ hesaplama aracını kullanın
4. Ders programlarını inceleyin
5. İstediğiniz ders için randevu alın
6. Antrenman programlarınızı takip edin

### Admin (Salon Sahibi) İçin
1. Admin panelinden giriş yapın
2. Üyelik taleplerini görüntüleyin ve yönetin
3. Tüm randevuları görüntüleyin
4. Salon doluluk oranlarını takip edin
5. Ders programlarını yönetin

## Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/yeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeniOzellik`)
5. Pull Request oluşturun

## Lisans
Bu proje [MIT lisansı](LICENSE) altında lisanslanmıştır.

## İletişim
Proje sahipleri: Meryemnur Pala,Mahir Erol
E-posta: meryemnur6969@gmail.com ,mahirerol13@gmail.com

Sistem Görselleri
![Ekran görüntüsü 2025-05-22 142108](https://github.com/user-attachments/assets/7388a4e8-bd4b-4a77-9c83-459f6ad18761)

![Ekran görüntüsü 2025-05-22 142121](https://github.com/user-attachments/assets/c8e59bb1-e6ff-4c9c-ad0d-f9be360a749b)

![Ekran görüntüsü 2025-05-22 142142](https://github.com/user-attachments/assets/29546bb1-ebba-43b8-8733-2b3e9db30aa4)

![Ekran görüntüsü 2025-05-22 142204](https://github.com/user-attachments/assets/99a41a51-2fa1-4478-96bd-18da6f40968a)

![Ekran görüntüsü 2025-05-22 142216](https://github.com/user-attachments/assets/61e956c7-dc52-418b-88fc-7b850198048d)




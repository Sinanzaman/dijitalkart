# DijitalKart

DijitalKart, dijital kartvizitlerinizi kolayca oluşturabileceğiniz, paylaşabileceğiniz ve yönetebileceğiniz yenilikçi bir web uygulamasıdır.

## Teknolojiler
- **Frontend**: React
- **Backend**: Java Spring Boot
- **Veritabanı**: PostgreSQL
- **Diğer**:
  - Maven (Backend için)
  - Node.js ve npm (Frontend için)

## Önkoşullar
- Java 17+ sürüm
- Maven
- Node.js ve npm
- PostgreSQL veritabanı
- Git

## Kurulum ve Çalıştırma

### 1. Proje Dosyalarını Kopyalayın
Proje dosyalarını yerel makinenize kopyalamak için aşağıdaki komutu kullanın:
```bash
git clone https://github.com/Sinanzaman/dijitalkart.git
```

### 2. PostgreSQL Veritabanını Oluşturun
- **PgAdmin 4** (isteğe bağlı) kullanarak `mydb` adında bir veritabanı oluşturun (projede kullanılan varsayılan isim).
- Gerekirse kullanıcı ve yetki ataması yapın.

### 3. Backend Kurulumu ve Çalıştırılması
1. Backend dizinine gidin:
   ```bash
   cd ./backend/
   ```
2. `application.properties` veya `application.yml` dosyasını açın ve PostgreSQL bağlantı bilgilerini güncelleyin:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
   spring.datasource.username=postgres_kullanici
   spring.datasource.password=sifre
   spring.jpa.hibernate.ddl-auto=update
   ```
3. Maven ile projeyi derleyin ve çalıştırın:
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```
   Backend sunucusu varsayılan olarak `http://localhost:8080` adresinde çalışacaktır.

### 4. Frontend Kurulumu ve Çalıştırılması
1. Frontend dizinine gidin:
   ```bash
   cd ./frontend/
   ```
2. Gerekli modülleri yükleyin:
   ```bash
   npm install
   ```
3. `node_modules` klasörünün dizine eklendiğinden emin olun.
4. Frontend'i başlatın:
   ```bash
   npm start
   ```
   Frontend varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

## Notlar
- Backend ve frontend'in aynı anda çalıştığından emin olun.
- Veritabanı bağlantı ayarlarını doğru şekilde yapılandırdığınızdan emin olun.
- Herhangi bir sorunla karşılaşırsanız, bağımlılıkların doğru yüklendiğini ve ortam değişkenlerinin doğru ayarlandığını kontrol edin.


***
***
***

## Projenin Amacı ve Kapsamı
DijitalKart, kullanıcıların dijital kartvizitlerini oluşturmasını, düzenlemesini ve paylaşmasını sağlayan bir platform sunar. Çevre dostu bir çözüm olarak, fiziksel kartvizitlerin yerini alarak hem pratik hem de modern bir deneyim sunmayı amaçlar.

## Çalışma Prensipleri
- **Modüler ve Ayrık Yapı**: Uygulama, frontend (React) ve backend (Spring Boot) olarak katmanlı ve modüler bir şekilde geliştirilmiştir. Bu yapı, geliştirme sürecini hızlandırırken bakım ve ölçeklendirme işlemlerini kolaylaştırır.
- **Veri Güvenliği ve Tutarlılığı**: Kullanıcı verilerinin güvenliği önceliklidir. PostgreSQL veritabanı ile sağlam veri yönetimi ve tutarlılık sağlanmıştır.
- **RESTful API Tasarımı**: Backend, REST mimarisine uygun olarak tasarlanmıştır. Bu, frontend ve backend’in bağımsız geliştirilmesini ve entegrasyonunu mümkün kılar.
- **Kullanıcı Deneyimi**: React ile oluşturulan responsive ve hızlı arayüz, kullanıcıların kartvizit oluşturma, düzenleme ve paylaşma süreçlerinde akıcı bir deneyim sunar.
- **Yerel Geliştirme ve Test**: Frontend ve backend bileşenleri, yerel ortamda bağımsız olarak test edilerek uygulamanın stabilitesi garanti altına alınmıştır.

## Geliştirme Süreci
1. **İhtiyaç Analizi ve Planlama**: Projenin temel hedefleri ve kullanıcı ihtiyaçları detaylı bir şekilde analiz edilmiştir.
2. **Teknoloji Seçimi**:
   - **Backend**: Java 17 ve Spring Boot, modern, güvenilir ve ölçeklenebilir bir API altyapısı sağlamak için seçilmiştir.
   - **Veritabanı**: Performanslı ve SQL standartlarına uygun PostgreSQL tercih edilmiştir.
   - **Frontend**: Hızlı, dinamik ve geliştirilmesi kolay bir kullanıcı arayüzü için React kullanılmıştır.
3. **Versiyon Kontrol**: Proje, Git ile yönetilerek kod takibi ve takım çalışması kolaylaştırılmıştır.
4. **Sürüm ve Bağımlılık Yönetimi**: Backend’de Maven, frontend’de npm ile bağımlılıklar yönetilmiş ve derleme süreçleri otomatize edilmiştir.
5. **Entegrasyon ve Test**: Frontend ve backend arasındaki veri alışverişi, REST API’lar üzerinden sıkı testlere tabi tutulmuştur.

## Teknoloji ve Tasarım Tercihleri
- **Java 17 ve Spring Boot**: Güncel Java sürümünün stabilitesi ve Spring Boot’un hızlı geliştirme olanakları projeye güç katar.
- **PostgreSQL**: Güvenilir, ölçeklenebilir ve SQL standartlarına uygun yapısıyla veri yönetimi için ideal bir seçimdir.
- **React**: Component tabanlı yapısı, geniş topluluğu ve kolay öğrenilebilirliği ile dinamik ve responsive bir kullanıcı arayüzü sağlar.
- **Maven & npm**: Backend ve frontend bağımlılıklarını kolayca yönetmek ve derleme süreçlerini otomatikleştirmek için kullanılmıştır.
- **REST API**: Frontend ve backend arasındaki iletişimi standartlaştırmış ve gelecekte farklı istemcilerle entegrasyonu kolaylaştırmıştır.

## Gelecek Planları
- Mobil uyumluluk ve responsive tasarımın daha da geliştirilmesi,
- Kullanıcı profili ve kart paylaşım seçeneklerinin zenginleştirilmesi,
- Güvenlik iyileştirmeleri ve performans optimizasyonları,
- Bulut tabanlı senkronizasyon ve yedekleme özelliklerinin eklenmesi.

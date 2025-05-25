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

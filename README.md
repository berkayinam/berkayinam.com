# Berkay İnam Kişisel Web Sitesi

Bu proje, Berkay İnam'ın kişisel web sitesi için oluşturulmuştur. Modern ve şık bir tasarıma sahip tek sayfalık (one-page) bir web sitesidir. Tailwind CSS kullanılarak geliştirilmiştir.

## Özellikler

- Responsive tasarım (mobil, tablet ve masaüstü)
- Hakkımda, yetenekler, deneyim, projeler, galeri, blog ve iletişim bölümleri
- GitHub projeleri entegrasyonu
- Medium blog yazıları entegrasyonu
- Yarışma ve etkinlik galerisi
- İletişim formu

## Teknolojiler

- HTML5, CSS3, JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Alpine.js](https://alpinejs.dev/) - Minimal JavaScript framework
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Axios](https://axios-http.com/) - Promise based HTTP client
- [Docker](https://www.docker.com/) - Konteyner platformu
- [Nginx](https://nginx.org/) - Web sunucusu

## Kurulum ve Çalıştırma

### Geliştirme Ortamı

```bash
# Projeyi klonlayın
git clone https://github.com/berkayinam/PersonelWebsite.git
cd PersonelWebsite

# Bağımlılıkları kurun
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Geliştirme sunucusu http://localhost:9999 adresinde çalışacaktır.

### Docker ile Dağıtım

```bash
# Docker compose ile dağıtım
docker-compose up -d

# veya Docker ile dağıtım
docker build -t berkay-inam-website .
docker run -d -p 9999:9999 --name berkay-inam-website berkay-inam-website
```

Web sitesi http://45.9.30.161:9999 adresinde çalışacaktır.

## Proje Yapısı

```
├── src/                  # Kaynak kodları
│   ├── style.css         # Tailwind CSS ile stil dosyası
│   └── main.js           # Ana JavaScript dosyası
├── public/               # Statik dosyalar
├── index.html            # Ana HTML dosyası
├── vite.config.js        # Vite yapılandırması
├── tailwind.config.js    # Tailwind CSS yapılandırması
├── postcss.config.js     # PostCSS yapılandırması
├── package.json          # Proje bağımlılıkları
├── Dockerfile            # Docker yapılandırması
├── nginx.conf            # Nginx yapılandırması
└── docker-compose.yml    # Docker Compose yapılandırması
```

## Güncelleme ve Bakım

### Galeri Bölümünü Güncelleme

Galeri bölümündeki görüntüler, `index.html` dosyasındaki `gallery` bölümünden güncellenebilir. Placeholder görüntüleri gerçek etkinlik fotoğraflarınızla değiştirebilirsiniz.

### Medium Yazılarını Güncelleme

Medium yazıları otomatik olarak API üzerinden çekilmektedir. Ancak üretim ortamında CORS kısıtlamaları sebebiyle, bir backend proxy servisi gerekebilir. Şu anda, örnek verilerle dolgulu bir test mekanizması bulunmaktadır.

### GitHub Projelerini Güncelleme

GitHub projeleri, GitHub API kullanılarak otomatik olarak çekilmektedir. Projelerinize uygun etiketler eklemek için GitHub'daki projelere topic ekleyebilir veya proje adlandırma kurallarınızı değiştirebilirsiniz.

## İletişim

Berkay İnam - [berkay_inam@hotmail.com](mailto:berkay_inam@hotmail.com)

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

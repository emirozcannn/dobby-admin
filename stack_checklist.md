# ooby Cafe Self-Service Admin Sistemi - Teknoloji Stack ve Başlangıç Checklist

## Temel Stack (Özet)
- **Backend:** Node.js (Express), PostgreSQL, Redis, JWT, Socket.io, Multer, Joi, dotenv, PM2
- **Frontend:** React (Vite), Tailwind CSS, React Context/useReducer, Axios, socket.io-client, Headless UI, Recharts, React Hook Form
- **DevOps:** Docker, Docker Compose, Nginx, DigitalOcean, Certbot, PM2, PostgreSQL backup

## Eklenmesi Önerilenler
- **Test:**
  - Backend: Jest, Supertest
  - Frontend: React Testing Library
- **Lint/Format:** ESLint, Prettier, Husky (pre-commit hook)
- **CI/CD:** GitHub Actions veya GitLab CI (otomatik test ve deploy)
- **API Dokümantasyonu:** Swagger/OpenAPI
- **Loglama:** Winston/Morgan (backend)
- **Error Tracking:** Sentry (opsiyonel)
- **Monitoring:** UptimeRobot veya benzeri (opsiyonel)
- **README ve .env.example**

## Başlangıç Checklist
- [ ] Geliştirme ortamı kurulumu
- [ ] Git repository oluşturma
- [ ] .env.example ve README hazırlama
- [ ] Backend ve frontend iskelet projeleri oluşturma
- [ ] Database migration scriptleri
- [ ] Temel authentication (JWT)
- [ ] İlk CRUD endpointleri
- [ ] Frontend login ekranı
- [ ] Lint/format ayarları
- [ ] Test altyapısı
- [ ] CI/CD pipeline planlaması
- [ ] API dokümantasyonu başlangıcı

## Notlar
- POS entegrasyonu için dummy servis ile erken test ortamı kurun.
- Her modül için "done definition" ve test senaryoları yazın.
- Proje ilerledikçe gereksinimlere göre eklemeler yapılabilir.

---
Bu dosya, projenin hızlı ve sürdürülebilir başlaması için temel ve önerilen adımları özetler. Detaylar için ana gereksinim dokümanına bakınız.

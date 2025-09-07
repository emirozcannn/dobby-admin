ooby Cafe Self-Service Admin Sistemi - Gereksinim Analizi
🎯 Proje Vizyonu
Dooby Cafe'nin 5 şubesini merkezi admin panelden yönetebileceği, self-service restaurant management platformu. Müşteri sistem kurduktan sonra tüm operasyonları kendi yönetebilecek.
👥 Kullanıcı Rolleri ve Yetkileri
1. Company Admin (Dooby Cafe Sahibi)
Yetkiler:

✅ Tüm şubeleri görüntüleme ve yönetme
✅ Master menü oluşturma/düzenleme
✅ Şube ekleme/silme/düzenleme
✅ Tüm kullanıcıları yönetme (manager/cashier)
✅ Company-wide raporlar
✅ POS cihaz ayarları
✅ Sistem ayarları (tax rates, currency etc.)

2. Branch Manager (Şube Müdürü)
Yetkiler:

✅ Sadece atandığı şubeyi yönetme
✅ Şube menüsünü customize etme (fiyat, availability)
✅ Şube personeli yönetimi
✅ Stock management (kendi şubesi)
✅ Günlük/haftalık raporlar
✅ Order monitoring
❌ Diğer şubeleri göremez

3. Cashier (Kasiyer)
Yetkiler:

✅ Sadece POS operations
✅ Order alma/tamamlama
✅ Stock görüntüleme (read-only)
✅ Daily sales summary
❌ Menu değiştiremez
❌ User management

🏗️ Teknoloji Stack
Backend
Runtime: Node.js 18.x LTS
Framework: Express.js 4.18+
Language: JavaScript (TypeScript skip - hız için)
Database: PostgreSQL 15+
Caching: Redis 7+ (session + real-time cache)
Authentication: JWT (jsonwebtoken)
Real-time: Socket.io 4.x
File Upload: Multer (product images)
Validation: Joi
Environment: dotenv
Process Manager: PM2
Frontend
Framework: React 18.x
Build Tool: Vite 4.x
Language: JavaScript (TypeScript skip)
Styling: Tailwind CSS 3.x
State Management: React Context + useReducer
HTTP Client: Axios
Real-time: socket.io-client
UI Library: Headless UI + React Icons
Charts: Recharts
Form Handling: React Hook Form
Database
Primary DB: PostgreSQL
Cache Layer: Redis
File Storage: Local storage (phase 1) → AWS S3 (phase 2)
DevOps
Containerization: Docker + Docker Compose
Deployment: DigitalOcean Droplet (single server)
Reverse Proxy: Nginx
SSL: Let's Encrypt (Certbot)
Monitoring: PM2 monitoring
Backup: PostgreSQL automated backup
🗄️ Database Schema
Core Tables
sql-- Company level
companies (id, name, email, phone, address, settings, created_at)
branches (id, company_id, name, address, phone, manager_id, is_active)
users (id, company_id, branch_id, username, email, password_hash, role, is_active)

-- Product Management
categories (id, company_id, name, sort_order, is_active)
master_products (id, company_id, category_id, name, description, base_price, cost_price, image_url, is_active)
branch_products (id, branch_id, master_product_id, custom_name, price, is_available, sort_order)

-- Stock Management
stock (id, branch_id, product_id, quantity, min_threshold, max_threshold, last_updated)
stock_movements (id, branch_id, product_id, type, quantity_change, previous_qty, new_qty, reference_id, created_by, created_at)

-- Order Management  
orders (id, branch_id, user_id, order_number, table_number, subtotal, tax_amount, discount_amount, total_amount, status, payment_method, created_at)
order_items (id, order_id, product_id, product_name, quantity, unit_price, total_price, special_instructions)

-- System Tables
audit_logs (id, user_id, action, table_name, record_id, old_values, new_values, created_at)
system_settings (id, company_id, key, value, created_at)
🎨 Frontend Modülleri
1. Authentication Module

Login/Logout
Role-based routing
Session management
Password reset

2. Dashboard Module

Company overview (admin)
Branch overview (manager)
Daily sales summary
Quick stats widgets
Recent activities

3. Branch Management Module (Admin Only)

Branch CRUD operations
Branch status toggle
Manager assignment
Branch settings

4. Menu Management Module
Company Admin:

Master menu creation
Category management
Bulk operations
Product images upload

Branch Manager:

Inherit from master menu
Price customization
Availability toggle
Sort order

5. User Management Module

User CRUD operations
Role assignment
Branch assignment
Active/inactive toggle

6. Inventory Module
Real-time Stock Tracking:

Current stock levels
Low stock alerts
Stock adjustment
Stock movement history
Automatic restock suggestions

7. Order Management Module

Live order monitoring
Order status updates
Order history
Order details view
Refund management

8. Reports Module
Company Level:

All branches performance
Product performance analysis
Revenue comparison
Staff performance

Branch Level:

Daily/Weekly/Monthly sales
Popular products
Peak hours analysis
Stock turnover

9. Settings Module

Company information
Tax settings
Currency settings
POS device configuration
Notification preferences

🔌 POS Integration Requirements
Kerzz Desktop Integration
Connection: TCP/IP Socket / COM Port
Protocol: Custom Kerzz protocol
Functions:
- Send order data
- Receive payment confirmation
- Sync product data
- Real-time status updates
Ingenico POS Integration
Connection: Serial/USB/Ethernet
Protocol: TLV format messages
Functions:  
- Payment processing
- Transaction status
- Settlement reports
- Error handling
Integration Challenges

Protocol documentation
Device discovery
Connection stability
Error handling
Offline fallback

📱 API Endpoints
Authentication
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
Branch Management
GET    /api/branches
POST   /api/branches
PUT    /api/branches/:id
DELETE /api/branches/:id
GET    /api/branches/:id/stats
Menu Management
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id

GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
GET    /api/products/branch/:branchId
Order Management
GET    /api/orders
POST   /api/orders
PUT    /api/orders/:id
GET    /api/orders/:id
GET    /api/orders/branch/:branchId
Stock Management
GET    /api/stock/branch/:branchId
PUT    /api/stock/:id
POST   /api/stock/adjustment
GET    /api/stock/movements
GET    /api/stock/low-stock
Reports
GET    /api/reports/sales
GET    /api/reports/products
GET    /api/reports/branches
GET    /api/reports/inventory
🚀 Development Phases
Phase 1: Foundation (Week 1-2)
Backend:

 Project setup (Express + PostgreSQL)
 Database schema implementation
 Authentication system
 Basic CRUD APIs
 JWT middleware

Frontend:

 React + Vite setup
 Tailwind CSS configuration
 Authentication flow
 Layout components
 Routing setup

Phase 2: Core Features (Week 3-4)
Backend:

 Branch management APIs
 Menu management APIs
 User management APIs
 Role-based access control
 File upload (product images)

Frontend:

 Dashboard implementations
 Branch management UI
 Menu management UI
 User management UI
 Responsive design

Phase 3: Advanced Features (Week 5-6)
Backend:

 Stock management APIs
 Order management APIs
 Real-time updates (Socket.io)
 Reports APIs
 Audit logging

Frontend:

 Stock management UI
 Order management UI
 Real-time notifications
 Reports dashboard
 Settings panel

Phase 4: POS Integration (Week 7-8)
Backend:

 Kerzz desktop communication
 Ingenico integration
 Device management APIs
 Synchronization logic

Frontend:

 Device configuration UI
 POS status monitoring
 Transaction logging
 Error handling UI

📊 Non-Functional Requirements
Performance

Page load time < 2 seconds
API response time < 500ms
Real-time updates < 100ms latency
Support 50+ concurrent users

Security

JWT token-based authentication
Password hashing (bcrypt)
Input validation and sanitization
SQL injection prevention
XSS protection
HTTPS enforcement

Scalability

Horizontal scaling support
Database indexing
Redis caching
Load balancer ready
Microservice architecture ready

Reliability

99.5% uptime target
Automated backups
Error logging
Health check endpoints
Graceful error handling

Usability

Mobile-responsive design
Intuitive navigation
Loading states
Error messages
Help documentation

💰 Business Requirements
Revenue Model

One-time setup fee: ₺30.000
Monthly hosting: ₺1.000-2.000
Additional features: ₺5.000-15.000
Maintenance: ₺5.000/year

Success Metrics

User adoption rate > 80%
Daily active usage > 4 hours
Order processing time < 30 seconds
Stock accuracy > 95%
Customer satisfaction > 4.5/5

Support Requirements

Documentation (user manual)
Video tutorials
3-month support included
Remote assistance capability
Bug fix guarantee

🧪 Testing Strategy
Unit Testing

API endpoint testing
Database operations
Authentication logic
Business logic functions

Integration Testing

POS device communication
Real-time synchronization
File upload functionality
Payment processing

User Acceptance Testing

Role-based access testing
Workflow testing
Mobile responsiveness
Performance testing

📈 Future Enhancements (Phase 2 Projects)
Mobile App

React Native garson uygulaması
QR kod menü
Push notifications
Offline capability

Advanced Analytics

AI-powered insights
Predictive analytics
Customer behavior analysis
Automated reporting

Third-party Integrations

Accounting software (e-Fatura)
Delivery platforms (Yemeksepeti, Getir)
Loyalty programs
Marketing automation

Enterprise Features

Multi-company support
Advanced user permissions
Custom branding
API access for partners


✅ Next Steps

Technical Validation

POS cihaz protokollerini araştır
Database performans testleri
Third-party API limitleri


Project Setup

Development environment kurulumu
Git repository oluşturma
CI/CD pipeline planlaması


UI/UX Design

Wireframe oluşturma
Design system belirleme
User flow diagramları


Development Start

Backend skeleton
Database migration scripts
Frontend project structure
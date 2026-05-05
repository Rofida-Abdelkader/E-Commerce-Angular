# 🚀 E-Commerce Order Management System

نظام إدارة الطلبات التجارية الإلكترونية - بنيت مع Angular 18+ Standalone Components

## 📋 متطلبات التشغيل

- Node.js v18+
- npm v9+

## 🎯 البدء السريع

### 1. تثبيت الاعتماديات
```bash
npm install
```

### 2. تشغيل json-server (في terminal منفصل)
```bash
npm run serve:json
```
يعمل على: `http://localhost:3000`

### 3. تشغيل التطبيق
```bash
npm start
```
يعمل على: `http://localhost:4200`

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── app.ts              # Root component
│   ├── app.html            # Main template
│   ├── app.css             # Global styles
│   ├── app.config.ts       # App configuration
│   ├── app.routes.ts       # Routes definition
│   ├── core/
│   │   └── models/
│   │       └── order.model.ts  # Order interfaces & constants
│   ├── features/
│   │   ├── admin/
│   │   │   └── components/
│   │   │       └── admin-orders/    # Admin panel
│   │   ├── orders/
│   │   │   ├── components/
│   │   │   │   └── order-tracking/  # Order tracking page
│   │   │   └── services/
│   │   │       └── order.service.ts # API service
│   │   └── models/
│   │       └── mock-orders.data.ts  # Mock data
│   └── shared/
│       └── components/
│           ├── status-badge/        # Status display
│           ├── loading-spinner/     # Loading indicator
│           ├── pagination/          # Pagination control
│           ├── search-input/        # Search field
│           ├── stat-card/           # Stats display
│           └── empty-state/         # Empty state display
├── index.html              # Main HTML file
├── main.ts                 # App bootstrap
└── styles.css              # Global styles
```

## 🛣️ المسارات المتاحة

| المسار | الوصف |
|-------|--------|
| `/` | تحويل إلى صفحة تتبع الطلبات |
| `/orders` | صفحة تتبع الطلبات |
| `/admin` | لوحة تحكم إدارة الطلبات |

## 🎨 الميزات الرئيسية

### 📦 صفحة تتبع الطلبات
- البحث عن الطلبات برقم الطلب
- عرض تفاصيل الطلب الكاملة
- عرض خطوات التسليم (progress tracking)
- عرض تاريخ الأحداث مرتب

### ⚙️ لوحة التحكم الإدارية
- عرض جميع الطلبات
- إحصائيات شاملة (إجمالي، قيد الانتظار، قيد المعالجة، إلخ)
- البحث والتصفية
- ترقيم الصفحات
- تحديث حالة الطلب

## 🔧 الأوامر المتاحة

```bash
# Development
npm start              # تشغيل التطبيق
npm run build          # بناء الإنتاج
npm run watch          # بناء مع watch mode
npm test               # تشغيل الاختبارات
npm run serve:json     # تشغيل JSON server
```

## 📊 البيانات

يتم جلب البيانات من `db.json` عبر json-server على `http://localhost:3000`

### نموذج الطلب
```typescript
{
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  subtotal: number
  shippingFee: number
  tax: number
  discount: number
  total: number
  trackingNumber?: string
  trackingEvents: TrackingEvent[]
  createdAt: Date
  updatedAt: Date
  estimatedDelivery?: Date
}
```

## 🎯 حالات الطلب

- `pending` - قيد الانتظار
- `confirmed` - تم التأكيد
- `processing` - قيد المعالجة
- `shipped` - تم الشحن
- `out_for_delivery` - في الطريق
- `delivered` - تم التسليم
- `cancelled` - تم الإلغاء
- `refunded` - تم استرجاع المبلغ

## 📱 الاستجابة

التطبيق مستجيب ويعمل على جميع أحجام الشاشات (موبايل، تابلت، ديسكتوب)

## 🔐 الأمان

- Angular Strict Mode مفعّل
- Standalone Components للحد الأدنى من التبعيات
- Change Detection Strategy OnPush لأداء أفضل

## 📝 ملاحظات

- تأكد من تشغيل json-server قبل البدء بالتطبيق
- المنفذ الافتراضي للتطبيق: 4200
- المنفذ الافتراضي لـ json-server: 3000

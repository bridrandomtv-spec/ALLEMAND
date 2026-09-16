# 🇩🇪 برنامج الأصل — DEUTSCH-DZ-APP
### Professeur Kharif Ahmed · اللغة الألمانية — السنة الثانية ثانوي

> ✨ **الرجوع إلى الأصل فضيلة** ✨ — نرافق أبناءكم نحو النجاح... خطوة بخطوة

[![Deploy](https://github.com/bridrandomtv-spec/ALLEMAND/actions/workflows/deploy.yml/badge.svg)](https://github.com/bridrandomtv-spec/ALLEMAND/actions)

---

## 📋 الوصف

منصة تعليمية جزائرية 100% لتعلّم اللغة الألمانية، موجّهة لتلاميذ السنة الثانية والثالثة ثانوي،
مبنية على **البرنامج الرسمي لوزارة التربية الوطنية** مع تجميع أفضل الفروض والاختبارات من ثانويات الوطن.

🌐 **En ligne :** https://bridrandomtv-spec.github.io/ALLEMAND/

---

## 🎯 Contenu — الوحدة 1 : Sich vorstellen

| الحصة | العنوان | المدة |
|-------|---------|-------|
| 1/8 | التحية والتعارف — Begrüßung und sich vorstellen | 60 د |
| 2/8 | المعلومات الشخصية — Persönliche Informationen | 60 د |
| 3/8 | الفعل sein — Das Verb «sein» | 60 د |
| 4/8 | الفعل haben — Das Verb «haben» | 60 د |
| 5/8 | فهم نص تقديمي — Textverständnis: Lena Fischer | 60 د |
| 6/8 | إنتاج كتابي ✍️ — Textproduktion (المهمة النهائية) | 60 د |
| 7/8 | تثبيت وتقويم ذاتي — Konsolidierung + Selbstevaluation | 60 د |
| 8/8 | فرض الوحدة 📝 — Évaluation de l'unité (/20) | 45 د |

### 📝 الفرض (/20)
- 📖 Compréhension de l'écrit — **8 pts**
- 🔤 Sprachbausteine — **8 pts**
- ✍️ Production écrite — **4 pts**
- ✅ التصحيح النموذجي + سلّم التنقيط الرسمي

### ⏱️ محاكاة الفرض
- وضع حقيقي (45 دقيقة) / وضع مصغّر (10 دقائق)
- 🤖 تصحيح آلي فوري حسب السلّم الرسمي
- 🔒 **نتيجة سرّية** — تُحفظ على جهاز التلميذ فقط (منهج الحصة 7)

### 🤖 الأستاذ الافتراضي
- 🇩🇿 يتحدث العربية · 🇩🇪 يتحدث الألمانية
- 🧠 ذكاء اصطناعي هجين مُدرَّب على محتوى الوحدة 1
- 🔍 تصحيح آلي للجمل الألمانية (conjugaison sein/haben, aus/in…)
- 🔊 نطق صوتي (Web Speech API, de-DE)

### 👨‍👩‍👧 فضاء الأولياء
- 📊 تقرير أسبوعي (الحضور، المعدل، الواجبات)
- 📱 تواصل مباشر عبر واتساب

---

## 🛠️ التقنيات

| التقنية | الاستعمال |
|---------|-----------|
| HTML5 / CSS3 / JavaScript ES6 | الواجهة (بدون إطار عمل) |
| PWA (`manifest.json` + `sw.js`) | تثبيت كتطبيق + عمل بدون أنترنت |
| Web Speech API | النطق الصوتي الألماني |
| localStorage | حفظ النتائج محلياً (سرّية) |
| GitHub Actions | النشر التلقائي على GitHub Pages |

---

## 📱 التوافق

✅ Android · iPhone · iPad · Windows · Mac · Linux
✅ يعمل على 3G / 4G / ADSL
✅ **Offline** après la première visite

---

## 🚀 التشغيل محلياً

```bash
git clone https://github.com/bridrandomtv-spec/ALLEMAND.git
cd ALLEMAND
python3 -m http.server 8000     # → http://localhost:8000
```

## 🌐 النشر

Chaque `git push` sur `main` déclenche `.github/workflows/deploy.yml` :

```bash
git add . && git commit -m "🚀 mise à jour" && git push origin main
```

Puis : **Settings → Pages → Source : GitHub Actions**

---

## 📁 هيكل المشروع

```text
ALLEMAND/
├── index.html          ← الصفحة الرئيسية (PWA, RTL)
├── style.css           ← التنسيقات
├── app.js              ← المحرك + الحصص + الفرض + الأستاذ الافتراضي
├── modules.js          ← محاكاة الفرض + فضاء الأولياء
├── manifest.json       ← إعدادات التطبيق
├── sw.js               ← Service Worker (Offline)
├── README.md
├── .gitignore
├── .github/workflows/
│   └── deploy.yml      ← النشر التلقائي
├── docs/archive/
│   └── plateforme-v3.html   ← ancien create_platform.py (archivé)
└── assets/
    ├── corriges.json   ← التصحيحات النموذجية الرسمية
    ├── prof.jpg        ← صورة الأستاذ خريف أحمد
    └── logo.png        ← الشعار (512×512)
```

---

## 📲 التسجيل والحجز

**واتساب : 0555 57 79 31**

> ابعث : الاسم + «حصّة ألماني مجانية»

🎁 **عرض افتتاحي** — حصّة أولى مجانية · ⏰ ساري حتى **30 سبتمبر 2026** · ⚡ الأماكن محدودة

---

## 👨‍🏫 الأستاذ خريف أحمد

- 🎓 15 سنة خبرة في التعليم الثانوي
- 🇩🇪 شهادة Goethe-Zertifikat C2
- ✍️ مؤلف كتاب «الألمانية بسهولة»
- 📊 98% نسبة نجاح في البكالوريا

---

## 🔒 الخصوصية

- نتائج المحاكاة تُخزَّن **على جهاز التلميذ فقط** (`localStorage`)
- لا تُنشر ولا تُشارك إلا باختيار التلميذ
- لا توجد خوادم خارجية لجمع البيانات

---

## 📄 الترخيص

جميع الحقوق محفوظة © 2026 — الأستاذ خريف أحمد 🇩🇿

/* ══════════════════════════════════════════════════════════════════════
   worker/resend-welcome.js — Cloudflare Worker (gratuit)
   Proxy d'envoi Resend pour la الثانوية الافتراضية (site statique).
   ──────────────────────────────────────────────────────────────────────
   ⚠️ SÉCURITÉ : la clé Resend vit ICI, en secret d'environnement
   (Workers → Settings → Variables → RESEND_API_KEY). JAMAIS dans le code,
   JAMAIS dans le dépôt public, JAMAIS côté navigateur.
   Déploiement : Workers & Pages → Create → Hello World → coller ce fichier
   → Settings → Variables → ajouter RESEND_API_KEY (et RESEND_FROM optionnel)
   → Deploy. Puis renseigner l'URL dans assets/bdd/config.json → resend_proxy.
   ══════════════════════════════════════════════════════════════════════ */
const ORIGINE = 'https://bridrandomtv-spec.github.io';

function cors(res){
  res.headers.set('Access-Control-Allow-Origin', ORIGINE);
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  res.headers.set('Access-Control-Max-Age', '86400');
  return res;
}
const json = (o, st) => cors(new Response(JSON.stringify(o), {
  status: st || 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }));

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function buildHtml(nom, role, genre){
  const fem = /أنثى|طالبة|f/.test(genre || '');
  const salut = role === 'prof' ? ('مرحبًا بك أستاذ ' + esc(nom))
              : role === 'parent' ? ('مرحبًا بك وليّ الأمر ' + esc(nom))
              : fem ? ('مرحبًا بك يا ' + esc(nom)) : ('مرحبًا بك يا ' + esc(nom));
  const guide = role === 'prof'
    ? ['🧑‍🏫 لوحة الأستاذ : نقاط، CSV، قاعة مباشرة', '📝 الفروض الرسمية /20',
       '🤖 مساعد توليد التمارين والتصحيح']
    : role === 'parent'
    ? ['📈 تقرير أسبوعي : نقاط وحضور', '📅 الحصص والفروض القادمة',
       '💬 مراسلة الأستاذ · 🗓️ حجز حصة خصوصية']
    : ['📚 اتبع الحصص بالترتيب (تصحيح فوري)', '📝 حلّ الفرض /20 مع التصحيح النموذجي',
       '🎓 أرشيف البكالوريا 2010→2026 · 🤖 اسأل الأستاذ 24/7'];
  return '<div dir="rtl" style="font-family:Tahoma,Segoe UI,sans-serif;background:#04140c;'
    + 'color:#e8edf8;padding:26px;border-radius:18px">'
    + '<h2 style="color:#3ddc84;margin:0 0 6px">🇩🇿 الثانوية الافتراضية الجزائرية</h2>'
    + '<p style="font-size:17px;line-height:1.9">' + salut + ' 👋</p>'
    + '<p style="color:#9fb3c8;line-height:1.9">« الرجوع إلى الأصل فضيلة » — منصّة مجانية '
    + 'مطابقة لمنهاج وزارة التربية، تشرح بالعربية أولًا ثم بالألمانية.</p>'
    + '<h3 style="color:#e8b64c">🎯 هدف المنصة</h3>'
    + '<ul style="line-height:2;color:#9fb3c8"><li>منهاج رسمي 100% لكل الشعب والمستويات</li>'
    + '<li>تصحيح فوري مع الأخطاء الشائعة</li><li>تعمل دون اتصال بعد أول تحميل</li>'
    + '<li>تقدُّم متابع : نقاط · حضور · تقرير أسبوعي</li></ul>'
    + '<h3 style="color:#e8b64c">📖 دليل الاستعمال</h3>'
    + '<ul style="line-height:2;color:#9fb3c8">' + guide.map(g => '<li>' + g + '</li>').join('')
    + '</ul>'
    + '<p style="margin-top:18px"><a href="' + ORIGINE + '/ALLEMAND/" style="background:#3ddc84;'
    + 'color:#04140c;padding:11px 20px;border-radius:11px;text-decoration:none;'
    + 'font-weight:700">🚀 فتح المنصة</a></p>'
    + '<p style="color:#5c6f83;font-size:12px">رسالة آلية من منصّتك — لا تردّ عليها.</p>'
    + '</div>';
}

export default {
  async fetch(req, env){
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return cors(new Response(null, { status: 204 }));
    if (url.pathname !== '/send-welcome' || req.method !== 'POST')
      return json({ ok: false, err: 'not found' }, 404);
    if (!env.RESEND_API_KEY) return json({ ok: false, err: 'RESEND_API_KEY non configure' }, 500);

    let b; try { b = await req.json(); } catch (e) { return json({ ok:false, err:'bad json' }, 400); }
    const to = String(b.to || '');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) return json({ ok:false, err:'email invalide' }, 400);

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + env.RESEND_API_KEY,
                 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.RESEND_FROM || 'onboarding@resend.dev',
        to: [to],
        subject: 'مرحبًا بك في الثانوية الافتراضية الجزائرية — دليل الاستعمال',
        html: buildHtml(b.nom, b.role, b.genre)
      })
    });
    const out = await r.json().catch(() => ({}));
    return json({ ok: r.ok, id: out.id || null, err: out.message || null }, r.status);
  }
};

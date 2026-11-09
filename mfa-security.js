/* mfa-security.js — MFA Supabase natif ; aucune simulation ni secret persistant côté navigateur. */
(function(){
  'use strict';
  var $=function(s){return document.querySelector(s);};
  var pending=null, attempts=0, enrolling=null;
  function status(id,msg,ok){var n=$(id);if(!n)return;n.textContent=msg||'';n.hidden=!msg;n.classList.toggle('is-success',!!ok);}
  function showLogin(){var f=$('#mfaChallengeForm');if(f)f.hidden=true;['#loginForm','#signupForm'].forEach(function(s){var n=$(s);if(n)n.hidden=s!=='#loginForm';});}
  async function requireGate(){
    if(!window.SB || !SB.mfaAssurance){status('#loginErr','خدمة التحقق الأمني غير جاهزة. أعد تحميل الصفحة.');return true;}
    var state=await SB.mfaAssurance();
    if(!state.ok){status('#loginErr',state.err||'تعذر التحقق من إعدادات المصادقة الثنائية.');return true;}
    if(!state.required) return false;
    var factors=state.factors||[];
    var preferred=factors.find(function(f){return f.type==='totp';})||factors[0];
    if(!preferred){status('#loginErr','لا يوجد عامل تحقق موثّق لهذا الحساب.');return true;}
    var challenge=await SB.mfaStart(preferred.id);
    if(!challenge.ok){status('#loginErr',challenge.err||'تعذر بدء التحقق الإضافي.');return true;}
    pending={factorId:preferred.id,challengeId:challenge.challengeId,type:preferred.type};attempts=0;
    var select=$('#mfaChallengeMethod');
    if(select){
      select.innerHTML='';
      factors.forEach(function(f){var o=document.createElement('option');o.value=f.id;o.textContent=f.type==='phone'?'رسالة نصية إلى الهاتف':'تطبيق المصادقة (TOTP)';o.dataset.type=f.type;select.appendChild(o);});
      var recovery=document.createElement('option');recovery.value='recovery';recovery.textContent='رمز استرداد احتياطي';select.appendChild(recovery);select.value=preferred.id;
    }
    var hint=$('#mfaChallengeHint');if(hint)hint.textContent=preferred.type==='phone'?'أُرسل رمز تحقق إلى رقم الهاتف المسجل.':'افتح تطبيق المصادقة المرتبط بحسابك وأدخل الرمز الحالي.';
    var code=$('#mfaChallengeCode');if(code){code.value='';code.placeholder='000000';code.inputMode='numeric';}
    var form=$('#mfaChallengeForm');if(form)form.hidden=false;
    ['#loginForm','#signupForm','#passwordResetForm','#passwordUpdateForm'].forEach(function(s){var n=$(s);if(n)n.hidden=true;});
    status('#mfaChallengeStatus','');if(code)code.focus();return true;
  }
  async function finishLogin(){
    var profile=window.cloudAuthority?await window.cloudAuthority():null;
    if(!profile){status('#mfaChallengeStatus','تم التحقق، لكن تعذر تحميل ملفك الدراسي. أعد المحاولة أو تواصل مع الدعم.');return;}
    if(window.DZ && typeof window.DZ.toast==='function')window.DZ.toast('🎉 تم التحقق من هويتك — أهلاً بك '+profile.nom,'ok');
    if(window.DZ && typeof window.DZ.enterApp==='function')window.DZ.enterApp(profile);
    else status('#mfaChallengeStatus','تم التحقق، لكن واجهة المنصة لم تجهز بعد. أعد تحميل الصفحة.');
  }
  var method=$('#mfaChallengeMethod');
  if(method)method.addEventListener('change',async function(){
    var code=$('#mfaChallengeCode'),label=$('#mfaCodeLabel'),hint=$('#mfaChallengeHint');
    if(method.value==='recovery'){if(code){code.placeholder='XXXX-XXXX-XXXX-XXXX';code.inputMode='text';}if(label)label.textContent='رمز الاسترداد الاحتياطي';if(hint)hint.textContent='استخدم رمزًا احتياطيًا لمرة واحدة سبق أن حفظته.';pending=null;return;}
    var option=method.options[method.selectedIndex],type=option&&option.dataset.type||'totp',factorId=method.value;
    var started=await SB.mfaStart(factorId);if(!started.ok){status('#mfaChallengeStatus',started.err);return;}
    pending={factorId:factorId,challengeId:started.challengeId,type:type};
    if(code){code.value='';code.placeholder='000000';code.inputMode='numeric';}
    if(label)label.textContent='رمز التحقق';
    if(hint)hint.textContent=type==='phone'?'أُرسل رمز تحقق إلى رقم الهاتف المسجل.':'افتح تطبيق المصادقة المرتبط بحسابك وأدخل الرمز الحالي.';
    status('#mfaChallengeStatus','');
  });
  var challengeForm=$('#mfaChallengeForm');
  if(challengeForm)challengeForm.addEventListener('submit',async function(ev){
    ev.preventDefault();var btn=challengeForm.querySelector('button[type="submit"]'),code=$('#mfaChallengeCode'),value=String(code&&code.value||'').trim();
    if(btn){btn.disabled=true;btn.setAttribute('aria-busy','true');}
    try{
      var result=$('#mfaChallengeMethod').value==='recovery'?await SB.mfaVerifyRecovery(value):(pending?await SB.mfaVerify(pending.factorId,pending.challengeId,value):{ok:false,err:'أعد اختيار طريقة التحقق.'});
      if(result&&result.ok){pending=null;await finishLogin();return;}
      attempts++;var message=(result&&result.err)||'رمز التحقق غير صحيح.';
      if(attempts>=3){await SB.logout();pending=null;showLogin();status('#loginErr','تم إيقاف المحاولة الحالية بعد ثلاث محاولات. سجّل الدخول مجددًا.');}
      else status('#mfaChallengeStatus',message+' — المحاولة '+attempts+' من 3.');
    }catch(error){status('#mfaChallengeStatus',error&&error.message||'تعذر التحقق من الرمز.');}
    finally{if(btn){btn.disabled=false;btn.removeAttribute('aria-busy');}}
  });
  document.addEventListener('click',async function(ev){
    if(ev.target.closest('[data-mfa-cancel]')){ev.preventDefault();try{await SB.logout();}catch(e){}pending=null;showLogin();status('#loginErr','تم إلغاء تسجيل الدخول.');return;}
    if(ev.target.closest('[data-mfa-enroll]')){await enrollTotp();return;}
    if(ev.target.closest('[data-mfa-recovery-generate]')){await generateRecovery(false);return;}
    if(ev.target.closest('[data-mfa-recovery-regenerate]')){if(!window.confirm('سيؤدي التجديد إلى إبطال الرموز السابقة. هل تريد المتابعة؟'))return;await generateRecovery(true);return;}
    var remove=ev.target.closest('[data-mfa-unenroll]');
    if(remove){if(!window.confirm('هل تريد تعطيل عامل المصادقة هذا؟'))return;var r=await SB.mfaUnenroll(remove.dataset.mfaUnenroll);if(!r.ok){status('#mfaSecurityMessage',r.err);return;}await renderSecurity();}
  });
  async function renderSecurity(){
    var host=$('#mfaSecurityContent');if(!host)return;
    if(!window.SB||!SB.mfaListFactors){host.textContent='خدمة الحماية غير متاحة حاليًا.';return;}
    host.textContent='جارٍ تحميل عوامل التحقق…';var r=await SB.mfaListFactors();if(!r.ok){host.textContent=r.err;return;}
    var verified=(r.totp||[]).filter(function(f){return f.status==='verified';}),pendingFactors=(r.totp||[]).filter(function(f){return f.status!=='verified';});
    var markup='';
    if(verified.length){markup+='<div class="mfa-status-line"><span class="mfa-status-dot"></span><b>المصادقة بتطبيق التحقق مفعّلة</b></div>';verified.forEach(function(f){markup+='<div class="mfa-factor-row"><span>📱 '+String(f.friendly_name||'تطبيق المصادقة').replace(/[&<>"]/g,'')+'</span><button type="button" class="btn btn-sm btn-o" data-mfa-unenroll="'+f.id+'">إزالة العامل</button></div>';});}
    else markup+='<div class="mfa-status-line mfa-status-off"><span class="mfa-status-dot"></span><b>لم يتم تفعيل تطبيق المصادقة بعد</b></div><button type="button" class="btn btn-p" data-mfa-enroll>🔐 تفعيل تطبيق المصادقة (TOTP)</button>';
    if(pendingFactors.length)markup+='<p class="mfa-muted">يوجد إعداد غير مكتمل؛ أكمل التحقق أو أعد المحاولة.</p>';
    host.innerHTML=markup+'<div id="mfaEnrollStage"></div><div id="mfaRecoveryStage"></div><p id="mfaSecurityMessage" class="mfa-security-message" role="status" aria-live="polite"></p>';
    if(verified.length){var recovery=await SB.mfaRecoveryStatus(),stage=$('#mfaRecoveryStage');if(recovery.ok){var st=recovery.status||{};stage.innerHTML='<div class="mfa-recovery-row"><span>رموز الاسترداد: '+String(st.remaining||0)+' من '+String(st.total||0)+' متبقية</span><button type="button" class="btn btn-sm btn-o" data-mfa-recovery-regenerate>تجديد الرموز</button></div>';}else stage.innerHTML='<p class="mfa-muted">لا توجد رموز استرداد مفعّلة حاليًا أو أن الميزة التجريبية غير مفعّلة.</p><button type="button" class="btn btn-sm btn-o" data-mfa-recovery-generate>إنشاء رموز الاسترداد</button>';}
  }
  async function enrollTotp(){
    var stage=$('#mfaEnrollStage');if(!stage)return;status('#mfaSecurityMessage','جارٍ إنشاء إعداد آمن من Supabase…');
    var r=await SB.mfaEnrollTotp('DZ Lycée Virtuel');if(!r.ok){status('#mfaSecurityMessage',r.err);return;}enrolling={factorId:r.factorId};
    stage.innerHTML='<div class="mfa-enroll-box"><h3>امسح رمز QR بتطبيق المصادقة</h3><p>لا تشارك هذا الرمز أو المفتاح مع أي شخص. سيظهر المفتاح هنا أثناء الإعداد فقط.</p><div class="mfa-qr-slot"></div><p class="mfa-secret-label">مفتاح الإعداد اليدوي</p><code class="mfa-secret"></code><form id="mfaEnrollForm"><label class="fld"><span>أدخل الرمز المكوّن من 6 أرقام من التطبيق</span><input id="mfaEnrollCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required></label><p id="mfaEnrollError" class="mfa-security-message" role="status"></p><button class="btn btn-p" type="submit">تأكيد وتفعيل المصادقة</button></form></div>';
    var slot=stage.querySelector('.mfa-qr-slot'),img=document.createElement('img'),qr=String(r.qrCode||'');img.alt='رمز QR صادر من Supabase لإعداد تطبيق المصادقة';
    if(qr.indexOf('data:image/')===0)img.src=qr;else if(qr.indexOf('<svg')>=0)img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(qr);else slot.textContent='تعذر عرض رمز QR؛ استخدم المفتاح اليدوي في تطبيق المصادقة.';
    if(img.src)slot.appendChild(img);stage.querySelector('.mfa-secret').textContent=r.secret||'';
    $('#mfaEnrollForm').addEventListener('submit',async function(ev){ev.preventDefault();var v=await SB.mfaVerifyEnrollment(enrolling.factorId,$('#mfaEnrollCode').value);if(!v.ok){status('#mfaEnrollError',v.err);return;}enrolling=null;await renderSecurity();status('#mfaSecurityMessage','تم تفعيل المصادقة الثنائية بنجاح.');});
  }
  async function generateRecovery(regenerate){
    var r=regenerate?await SB.mfaRecoveryRegenerate():await SB.mfaRecoveryGenerate(),stage=$('#mfaRecoveryStage');if(!stage)return;if(!r.ok){status('#mfaSecurityMessage',r.err);return;}
    stage.innerHTML='<div class="mfa-recovery-codes"><h3>احفظ رموز الاسترداد الآن</h3><p>تُعرض هذه الرموز مرة واحدة فقط. خزّنها في مكان آمن ولا تشاركها.</p><pre></pre></div>';
    stage.querySelector('pre').textContent=(r.codes||[]).join('\n');
  }
  document.addEventListener('dz:view',function(ev){var v=ev&&ev.detail&&(ev.detail.view||ev.detail);if(v==='compte')setTimeout(renderSecurity,180);});
  if((location.hash||'').replace('#','')==='compte')document.addEventListener('DOMContentLoaded',renderSecurity);
  window.DZ_MFA={requireGate:requireGate,renderSecurity:renderSecurity};
})();

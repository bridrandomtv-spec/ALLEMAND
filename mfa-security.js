/* mfa-security.js — MFA Supabase natif ; aucune simulation ni secret persistant côté navigateur. */
(function(){
  'use strict';
  var $=function(s){return document.querySelector(s);};
  var pending=null, attempts=0, enrolling=null, enrollingPhone=null;
  function status(id,msg,ok){var n=$(id);if(!n)return;n.textContent=msg||'';n.hidden=!msg;n.classList.toggle('is-success',!!ok);}
  function showLogin(){var f=$('#mfaChallengeForm');if(f)f.hidden=true;['#loginForm','#signupForm'].forEach(function(s){var n=$(s);if(n)n.hidden=s!=='#loginForm';});}
  function setLoginResendVisibility(type){var sms=$('#mfaLoginSmsResend'),email=$('#mfaLoginEmailResend');if(sms)sms.hidden=type!=='phone';if(email)email.hidden=type!=='email';}
  function showEmailChallenge(started,emailState,purpose){
    pending={type:'email',purpose:purpose,challengeId:started.challengeId};attempts=0;
    var select=$('#mfaChallengeMethod');
    if(select){select.innerHTML='';var option=document.createElement('option');option.value='email';option.textContent='رمز التحقق عبر البريد الإلكتروني';select.appendChild(option);select.value='email';}
    var hint=$('#mfaChallengeHint');
    if(hint){
      var destination=started.destination||emailState.emailMasked||'بريدك الإلكتروني المسجل';
      hint.textContent=purpose==='enroll'
        ? 'لأول دخول آمن، أرسلنا رمز تفعيل إلى '+destination+'. أدخل الرمز لإكمال إعداد حسابك.'
        : 'أرسلنا رمز التحقق إلى '+destination+'.';
    }
    setLoginResendVisibility('email');
    var code=$('#mfaChallengeCode');
    if(code){code.value='';code.placeholder='000000';code.inputMode='numeric';code.autocomplete='one-time-code';}
    var form=$('#mfaChallengeForm');if(form)form.hidden=false;
    ['#loginForm','#signupForm','#passwordResetForm','#passwordUpdateForm'].forEach(function(x){var n=$(x);if(n)n.hidden=true;});
    status('#mfaChallengeStatus','');
    if(code)code.focus();
  }
  async function requireGate(){
    if(!window.SB || !SB.mfaAssurance || !SB.mfaEmail){
      status('#loginErr','خدمة التحقق الأمني غير جاهزة. أعد تحميل الصفحة أو حاول لاحقًا.');
      return true;
    }
    var nativeState=await SB.mfaAssurance();
    if(!nativeState.ok){
      status('#loginErr',nativeState.err||'تعذر التحقق من إعدادات المصادقة الثنائية.');
      return true;
    }
    var emailState=await SB.mfaEmail({action:'status'});
    if(!emailState.ok){
      status('#loginErr','تعذر التحقق من حالة المصادقة عبر البريد. أعد المحاولة لاحقًا؛ لم يتم تجاوز فحص الأمان.');
      return true;
    }

    // E-mail MFA is mandatory: enroll automatically on first entry, then challenge on each new session.
    if(!emailState.enrolled || !emailState.verified){
      var purpose=emailState.enrolled?'login':'enroll';
      var started=await SB.mfaEmail({action:'start',purpose:purpose});
      if(!started.ok){
        var message=started.error||started.err||'تعذر إرسال رمز التحقق.';
        status('#loginErr',message==='EMAIL_DELIVERY_UNAVAILABLE'
          ? 'تعذر إرسال رسالة التحقق حاليًا. لم يتم فتح حسابك؛ حاول لاحقًا أو تواصل مع الإدارة.'
          : message);
        return true;
      }
      showEmailChallenge(started,emailState,purpose);
      return true;
    }

    // If a native Supabase factor is also required, complete it after the mandatory e-mail check.
    var factors=nativeState.factors||[];
    if(!nativeState.required)return false;
    var preferred=factors.find(function(f){return f.type==='totp';})||factors[0];
    if(!preferred){status('#loginErr','لا يوجد عامل تحقق موثّق لهذا الحساب.');return true;}
    var challenge=await SB.mfaStart(preferred.id);
    if(!challenge.ok){status('#loginErr',challenge.err||'تعذر بدء التحقق الإضافي.');return true;}
    pending={factorId:preferred.id,challengeId:challenge.challengeId,type:preferred.type};attempts=0;
    var select=$('#mfaChallengeMethod');
    if(select){
      select.innerHTML='';
      factors.forEach(function(f){
        var o=document.createElement('option');o.value=f.id;
        o.textContent=f.type==='phone'?'رسالة نصية إلى الهاتف':'تطبيق المصادقة (TOTP)';
        o.dataset.type=f.type;select.appendChild(o);
      });
      var recovery=document.createElement('option');recovery.value='recovery';
      recovery.textContent='رمز استرداد احتياطي';select.appendChild(recovery);select.value=preferred.id;
    }
    var hint=$('#mfaChallengeHint');
    if(hint)hint.textContent=preferred.type==='phone'?'أُرسل رمز تحقق إلى رقم الهاتف المسجل.':'افتح تطبيق المصادقة المرتبط بحسابك وأدخل الرمز الحالي.';
    setLoginResendVisibility(preferred.type);
    var code=$('#mfaChallengeCode');if(code){code.value='';code.placeholder='000000';code.inputMode='numeric';}
    var form=$('#mfaChallengeForm');if(form)form.hidden=false;
    ['#loginForm','#signupForm','#passwordResetForm','#passwordUpdateForm'].forEach(function(x){var n=$(x);if(n)n.hidden=true;});
    status('#mfaChallengeStatus','');if(code)code.focus();return true;
  }
  async function returnToLoginAfterMfa(message){
    var closed=false;
    try{var result=await SB.logout();closed=!!(result&&result.ok);}catch(e){}
    pending=null;attempts=0;showLogin();
    status('#loginErr',closed?message:message+' تعذر تأكيد إغلاق الجلسة السحابية؛ أعد تحميل الصفحة قبل إعادة المحاولة.');
  }
  async function finishLogin(){
    try{
      if(await requireGate())return;
      var profile=window.cloudAuthority?await window.cloudAuthority():null;
      if(!profile){await returnToLoginAfterMfa('تم التحقق من الرمز، لكن تعذر تحميل ملفك الدراسي. سجّل الدخول مجددًا.');return;}
      if(!window.DZ || typeof window.DZ.enterApp!=='function'){
        await returnToLoginAfterMfa('تم التحقق من الرمز، لكن واجهة المنصة غير جاهزة. سجّل الدخول مجددًا.');
        return;
      }
      if(typeof window.DZ.toast==='function')window.DZ.toast('🎉 تم التحقق من هويتك — أهلاً بك '+profile.nom,'ok');
      window.DZ.enterApp(profile);
    }catch(error){
      await returnToLoginAfterMfa('تعذر إكمال تسجيل الدخول بعد التحقق. سجّل الدخول مجددًا.');
    }
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
    setLoginResendVisibility(type);
    status('#mfaChallengeStatus','');
  });
  var challengeForm=$('#mfaChallengeForm');
  if(challengeForm)challengeForm.addEventListener('submit',async function(ev){
    ev.preventDefault();var btn=challengeForm.querySelector('button[type="submit"]'),code=$('#mfaChallengeCode'),value=String(code&&code.value||'').trim();
    if(btn){btn.disabled=true;btn.setAttribute('aria-busy','true');}
    try{
      var result=$('#mfaChallengeMethod').value==='recovery'?await SB.mfaVerifyRecovery(value):(pending&&pending.type==='email'?await SB.mfaEmail({action:'verify',challengeId:pending.challengeId,code:value}):(pending?await SB.mfaVerify(pending.factorId,pending.challengeId,value):{ok:false,err:'أعد اختيار طريقة التحقق.'}));
      if(result&&result.ok){pending=null;await finishLogin();return;}
      attempts++;var message=(result&&result.err)||'رمز التحقق غير صحيح.';
      if(attempts>=3){await returnToLoginAfterMfa('تم إيقاف المحاولة الحالية بعد ثلاث محاولات. سجّل الدخول مجددًا.');}
      else status('#mfaChallengeStatus',message+' — المحاولة '+attempts+' من 3.');
    }catch(error){status('#mfaChallengeStatus',error&&error.message||'تعذر التحقق من الرمز.');}
    finally{if(btn){btn.disabled=false;btn.removeAttribute('aria-busy');}}
  });
  document.addEventListener('submit',async function(ev){
    if(ev.target && ev.target.id==='mfaPhoneEnrollForm'){
      ev.preventDefault();
      var number=String($('#mfaPhoneNumber').value||'').trim();
      if(!/^\+[1-9]\d{7,14}$/.test(number)){status('#mfaPhoneError','أدخل رقمًا دوليًا صحيحًا يبدأ بعلامة +.');return;}
      var enrolled=await SB.mfaEnrollPhone(number);
      if(!enrolled.ok){status('#mfaPhoneError',enrolled.err);return;}
      var challenge=await SB.mfaStart(enrolled.factorId);
      if(!challenge.ok){await SB.mfaUnenroll(enrolled.factorId);status('#mfaPhoneError',challenge.err);return;}
      enrollingPhone={factorId:enrolled.factorId,challengeId:challenge.challengeId};
      var stage=$('#mfaPhoneStage');
      stage.innerHTML='<div class="mfa-enroll-box"><h3>تحقق من رقم الهاتف</h3><p>أرسل Supabase رمزًا إلى الرقم '+String(enrolled.phone||number).replace(/[&<>"]/g,'')+'. أدخل الرمز لإتمام ربط الهاتف.</p><form id="mfaPhoneVerifyForm"><label class="fld"><span>رمز SMS</span><input id="mfaPhoneCode" inputmode="numeric" autocomplete="one-time-code" maxlength="8" required></label><p id="mfaPhoneError" class="mfa-security-message" role="status"></p><button class="btn btn-p" type="submit">تأكيد رقم الهاتف</button><button class="btn btn-o" type="button" data-mfa-phone-resend>إعادة إرسال الرمز</button><button class="btn btn-o" type="button" data-mfa-phone-cancel>إلغاء</button></form></div>';
      return;
    }
    if(ev.target && ev.target.id==='mfaPhoneVerifyForm'){
      ev.preventDefault();
      if(!enrollingPhone)return;
      var verified=await SB.mfaVerify(enrollingPhone.factorId,enrollingPhone.challengeId,$('#mfaPhoneCode').value);
      if(!verified.ok){status('#mfaPhoneError',verified.err);return;}
      enrollingPhone=null;await renderSecurity();status('#mfaSecurityMessage','تم توثيق رقم الهاتف وتفعيل المصادقة عبر SMS.');return;
    }
  });
  document.addEventListener('click',async function(ev){
    var resendEmail=ev.target.closest('[data-mfa-email-resend]');
    if(resendEmail){
      ev.preventDefault();resendEmail.disabled=true;resendEmail.setAttribute('aria-busy','true');
      try{
        var enrollForm=resendEmail.closest('#mfaEmailVerifyForm');
        if(enrollForm){var enrollSent=await SB.mfaEmail({action:'start',purpose:'enroll'});if(!enrollSent.ok){status('#mfaEmailVerifyError',enrollSent.error||enrollSent.err||'تعذر إعادة إرسال الرمز.');return;}enrollForm.dataset.challengeId=enrollSent.challengeId;var enrollCode=$('#mfaEmailCode');if(enrollCode)enrollCode.value='';status('#mfaEmailVerifyError','تم طلب إرسال رمز جديد إلى بريدك.');}
        else if(pending&&pending.type==='email'){var loginSent=await SB.mfaEmail({action:'start',purpose:'login'});if(!loginSent.ok){status('#mfaChallengeStatus',loginSent.error||loginSent.err||'تعذر إعادة إرسال الرمز.');return;}pending.challengeId=loginSent.challengeId;var loginCode=$('#mfaChallengeCode');if(loginCode)loginCode.value='';status('#mfaChallengeStatus','تم طلب إرسال رمز جديد إلى بريدك.');}
      }catch(error){status('#mfaChallengeStatus',error&&error.message||'تعذر إعادة إرسال الرمز.');}
      finally{resendEmail.disabled=false;resendEmail.removeAttribute('aria-busy');}
      return;
    }
    var resendLogin=ev.target.closest('[data-mfa-login-resend]');
    if(resendLogin){
      ev.preventDefault();
      if(!pending||pending.type!=='phone')return;
      resendLogin.disabled=true;resendLogin.setAttribute('aria-busy','true');
      try{var sent=await SB.mfaStart(pending.factorId);if(!sent.ok){status('#mfaChallengeStatus',sent.err||'تعذر إعادة إرسال الرمز.');return;}pending.challengeId=sent.challengeId;status('#mfaChallengeStatus','تم طلب إرسال رمز جديد إلى هاتفك.');}
      catch(error){status('#mfaChallengeStatus',error&&error.message||'تعذر إعادة إرسال الرمز.');}
      finally{resendLogin.disabled=false;resendLogin.removeAttribute('aria-busy');}
      return;
    }
    if(ev.target.closest('[data-mfa-cancel]')){ev.preventDefault();await returnToLoginAfterMfa('تم إلغاء تسجيل الدخول.');return;}
    if(ev.target.closest('[data-mfa-enroll]')){await enrollTotp();return;}
    if(ev.target.closest('[data-mfa-phone-resend]')){if(enrollingPhone){var again=await SB.mfaStart(enrollingPhone.factorId);if(again.ok)enrollingPhone.challengeId=again.challengeId;else status('#mfaPhoneError',again.err);}return;}
    if(ev.target.closest('[data-mfa-phone-cancel]')){if(enrollingPhone)await SB.mfaUnenroll(enrollingPhone.factorId);enrollingPhone=null;await renderSecurity();return;}
    if(ev.target.closest('[data-mfa-recovery-generate]')){await generateRecovery(false);return;}
    if(ev.target.closest('[data-mfa-recovery-regenerate]')){if(!window.confirm('سيؤدي التجديد إلى إبطال الرموز السابقة. هل تريد المتابعة؟'))return;await generateRecovery(true);return;}
    var remove=ev.target.closest('[data-mfa-unenroll]');
    if(remove){if(!window.confirm('هل تريد تعطيل عامل المصادقة هذا؟'))return;var r=await SB.mfaUnenroll(remove.dataset.mfaUnenroll);if(!r.ok){status('#mfaSecurityMessage',r.err);return;}await renderSecurity();}
  });
  async function renderSecurity(){
    var host=$('#mfaSecurityContent');if(!host)return;
    if(!window.SB||!SB.mfaListFactors){host.textContent='خدمة الحماية غير متاحة حاليًا.';return;}
    host.textContent='جارٍ تحميل عوامل التحقق…';var r=await SB.mfaListFactors();if(!r.ok){host.textContent=r.err;return;}
    var verifiedTotp=(r.totp||[]).filter(function(f){return f.status==='verified';});
    var verifiedPhone=(r.phone||[]).filter(function(f){return f.status==='verified';});
    var verified=verifiedTotp.concat(verifiedPhone);
    var pendingFactors=(r.totp||[]).concat(r.phone||[]).filter(function(f){return f.status!=='verified';});
    var markup='';
    var emailState=SB.mfaEmail?await SB.mfaEmail({action:'status'}):{ok:false};
    var emailMarkup=emailState.ok&&emailState.enrolled
      ? '<div class="mfa-status-line"><span class="mfa-status-dot"></span><b>التحقق الإلزامي عبر البريد الإلكتروني مفعّل</b></div><p class="mfa-muted">'+String(emailState.emailMasked||'البريد المسجل').replace(/[&<>\"]/g,'')+'</p>'
      : '<div class="mfa-security-message" role="status">التحقق عبر البريد الإلكتروني إلزامي، وسيُفعّل تلقائيًا عند تسجيل الدخول التالي. لا تحتاج إلى إجراء أي خطوة من هذه الصفحة.</div>';
    if(verifiedTotp.length){markup+='<div class="mfa-status-line"><span class="mfa-status-dot"></span><b>تطبيق المصادقة (TOTP) مفعّل</b></div>';verifiedTotp.forEach(function(f){markup+='<div class="mfa-factor-row"><span>📱 '+String(f.friendly_name||'تطبيق المصادقة').replace(/[&<>"]/g,'')+'</span><button type="button" class="btn btn-sm btn-o" data-mfa-unenroll="'+f.id+'">إزالة العامل</button></div>';});}
    else markup+='<button type="button" class="btn btn-p" data-mfa-enroll>🔐 تفعيل تطبيق المصادقة (TOTP)</button>';
    if(verifiedPhone.length){markup+='<div class="mfa-status-line"><span class="mfa-status-dot"></span><b>التحقق عبر الهاتف مفعّل</b></div>';verifiedPhone.forEach(function(f){markup+='<div class="mfa-factor-row"><span>📨 '+String(f.phone||'رقم هاتف موثّق').replace(/[&<>"]/g,'')+'</span><button type="button" class="btn btn-sm btn-o" data-mfa-unenroll="'+f.id+'">إزالة العامل</button></div>';});}
    else markup+='<form id="mfaPhoneEnrollForm" class="mfa-phone-form"><label class="fld"><span>رقم الهاتف بالصيغة الدولية (E.164)</span><input id="mfaPhoneNumber" type="tel" inputmode="tel" autocomplete="tel" placeholder="+213XXXXXXXXX" pattern="\\+[1-9][0-9]{7,14}" required></label><button type="submit" class="btn btn-o">📨 تفعيل التحقق عبر SMS</button><p id="mfaPhoneError" class="mfa-security-message" role="status" aria-live="polite"></p></form><div id="mfaPhoneStage"></div>';
    if(pendingFactors.length)markup+='<p class="mfa-muted">يوجد إعداد غير مكتمل؛ أكمل التحقق أو أعد المحاولة.</p>';
    host.innerHTML=markup+emailMarkup+'<div id="mfaEnrollStage"></div><div id="mfaRecoveryStage"></div><p id="mfaSecurityMessage" class="mfa-security-message" role="status" aria-live="polite"></p>';
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

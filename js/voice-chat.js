/* Dictée vocale du professeur — Web Speech API native, sans dépendance. */
(function(){
  'use strict';
  function init(){
    const button=document.getElementById('chatMicBtn');
    const input=document.getElementById('chatInput');
    const language=document.getElementById('chatVoiceLang');
    const status=document.getElementById('chatVoiceStatus');
    if(!button||!input||button.dataset.voiceReady) return;
    button.dataset.voiceReady='1';
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecognition){
      button.disabled=true;
      button.title='La dictée vocale n’est pas prise en charge par ce navigateur';
      if(status) status.textContent='الإملاء الصوتي غير مدعوم هنا؛ جرّب Chrome أو Edge عبر HTTPS.';
      return;
    }
    const recognition=new SpeechRecognition();
    recognition.continuous=false;
    recognition.interimResults=true;
    recognition.maxAlternatives=1;
    let listening=false, finalText='';
    function setListening(value){
      listening=value;
      button.classList.toggle('is-listening',value);
      button.setAttribute('aria-pressed',String(value));
      button.textContent=value?'⏹️':'🎙️';
      button.title=value?'إيقاف الإملاء':'بدء الإملاء الصوتي';
      if(status) status.textContent=value?'🎙️ أستمع الآن… تحدث بوضوح':'الإملاء الصوتي جاهز';
    }
    button.addEventListener('click',function(){
      if(listening){ recognition.stop(); return; }
      finalText='';
      recognition.lang=(language&&language.value)||'de-DE';
      try{ recognition.start(); }
      catch(error){ if(status) status.textContent='تعذّر بدء الميكروفون؛ تحقق من إذن المتصفح.'; }
    });
    recognition.onstart=function(){setListening(true);};
    recognition.onresult=function(event){
      let interim='';
      for(let i=event.resultIndex;i<event.results.length;i++){
        const phrase=event.results[i][0].transcript;
        if(event.results[i].isFinal) finalText+=phrase;
        else interim+=phrase;
      }
      if(status) status.textContent=(finalText||interim)?'تم التعرف: '+(finalText+interim):'🎙️ أستمع الآن…';
    };
    recognition.onerror=function(event){
      setListening(false);
      const messages={ 'not-allowed':'يجب السماح باستخدام الميكروفون من إعدادات المتصفح.','no-speech':'لم أسمع كلامًا؛ حاول مرة أخرى.','audio-capture':'لم يتم العثور على ميكروفون.','network':'تعذر الاتصال بخدمة التعرف على الكلام.' };
      if(status) status.textContent=messages[event.error]||'حدث خطأ في الإملاء الصوتي: '+event.error;
    };
    recognition.onend=function(){
      setListening(false);
      const transcript=finalText.trim();
      if(transcript){
        input.value=(input.value.trim()?input.value.trim()+' ':'')+transcript;
        input.focus();
        if(status) status.textContent='تم إدراج النص؛ راجعه ثم اضغط إرسال.';
      }
    };
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
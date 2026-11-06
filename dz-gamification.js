/* ═══════════════════════════════════════════════════════════════
   DZ GAMIFICATION — XP, niveaux et 20 badges fondés sur l'activité réelle.
   Aucun profil de démonstration, aucun XP fictif, aucune statistique nationale.
   ═══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
var KEY='dz_de_gamification_v1',panelId='dzGamificationPanel',celebrateLayer=null;
var thresholds=[0,100,250,450,700,1000,1400,1900,2500,3200];
var levelNames=['مبتدئ','متعلّم','مجتهد','مثابر','متفوّق','متميّز','خبير','متألّق','قائد التعلّم','بطل المعرفة'];
function account(){try{var s=window.AUTH&&AUTH.session?AUTH.session():null;return s&&s.user?'local:'+String(s.user).toLowerCase():null;}catch(e){return null;}}
function key(){var a=account();return a?KEY+':'+a:null;}
function fresh(){return {xp:0,events:[],lessons:[],units:[],quizzes:0,perfect:0,score60:false,score80:false,activeDays:[]};}
function read(){var k=key();if(!k)return fresh();try{return Object.assign(fresh(),JSON.parse(localStorage.getItem(k)||'{}'));}catch(e){return fresh();}}
function save(s){var k=key();if(k)try{localStorage.setItem(k,JSON.stringify(s));}catch(e){}}
function dateKey(t){var d=new Date(t),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());}
function activity(s,t){var d=dateKey(t||Date.now());if(s.activeDays.indexOf(d)<0)s.activeDays.push(d);s.activeDays=s.activeDays.slice(-120);}
function streak(s){var days=s.activeDays.slice().sort().reverse(),today=dateKey(Date.now()),yesterday=dateKey(Date.now()-86400000),base=days.indexOf(today)>=0?today:(days.indexOf(yesterday)>=0?yesterday:null);if(!base)return 0;var count=0,cur=new Date(base+'T12:00:00');while(days.indexOf(dateKey(cur.getTime()))>=0){count++;cur.setDate(cur.getDate()-1);}return count;}
function level(xp){var n=1;for(var i=1;i<thresholds.length;i++)if(xp>=thresholds[i])n=i+1;else break;var floor=thresholds[n-1],next=thresholds[n]||floor;return {n:n,name:levelNames[n-1],floor:floor,next:next,pct:next>floor?Math.max(0,Math.min(100,Math.round((xp-floor)/(next-floor)*100))):100};}
function badgeList(s){var l=level(s.xp),days=s.activeDays.length,st=streak(s),less=s.lessons.length,units=s.units.length;
return [
['first-lesson','📘','أول حصة','أكمل أول حصة تعليمية',less>=1],
['five-lessons','📚','خطوات ثابتة','أكمل 5 حصص',less>=5],
['ten-lessons','🎒','متقدّم','أكمل 10 حصص',less>=10],
['twenty-five-lessons','🏅','مثابر','أكمل 25 حصة',less>=25],
['fifty-lessons','🏆','بطل الحصص','أكمل 50 حصة',less>=50],
['first-quiz','🎯','أول اختبار','أكمل أول سلسلة تمارين',s.quizzes>=1],
['five-quizzes','🧩','محبّ التحدّي','أكمل 5 سلاسل',s.quizzes>=5],
['ten-quizzes','🧠','عقل نشيط','أكمل 10 سلاسل',s.quizzes>=10],
['score-60','⭐','نتيجة مشجّعة','احصل على 60% في اختبار',s.score60],
['score-80','🌟','نتيجة ممتازة','احصل على 80% في اختبار',s.score80],
['perfect','💯','علامة كاملة','احصل على 100% في اختبار',s.perfect>=1],
['three-perfect','🥇','إتقان متكرر','احصل على 3 علامات كاملة',s.perfect>=3],
['xp-100','⚡','مئة نقطة خبرة','اجمع 100 XP',s.xp>=100],
['xp-500','🔥','خمسمئة نقطة خبرة','اجمع 500 XP',s.xp>=500],
['xp-1000','🚀','ألف نقطة خبرة','اجمع 1000 XP',s.xp>=1000],
['three-days','📅','مواظب','تعلّم في 3 أيام مختلفة',days>=3],
['seven-streak','🗓️','أسبوع من الالتزام','حافظ على سلسلة 7 أيام',st>=7],
['first-unit','🎓','وحدة مكتملة','أكمل جميع حصص وحدة واحدة',units>=1],
['three-units','🏫','ثلاث وحدات','أكمل 3 وحدات',units>=3],
['five-units','👑','قائد التعلّم','أكمل 5 وحدات',units>=5]
];}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function toast(m){if(window.toast)window.toast(m,'ok');else if(window.DZ_INTERACTIONS)DZ_INTERACTIONS.recordToast(m,'ok');}
function showCelebration(title,sub,icon){
if(celebrateLayer)celebrateLayer.remove();celebrateLayer=document.createElement('div');celebrateLayer.className='dz-celebrate-layer';
var particles='';for(var i=0;i<28;i++)particles+='<i class="dz-confetti" style="left:'+(4+i*3.3)+'%;animation-delay:'+(i*.025)+'s"></i>';
celebrateLayer.innerHTML='<div class="dz-celebrate-backdrop"></div><section class="dz-celebrate-card" role="dialog" aria-modal="true"><button class="dz-celebrate-close" aria-label="إغلاق">×</button><div class="dz-celebrate-icon">'+icon+'</div><p class="dz-celebrate-kicker">إنجاز جديد</p><h2>'+esc(title)+'</h2><p>'+esc(sub)+'</p><button class="dz-celebrate-ok">مواصلة التعلّم</button>'+particles+'</section>';
document.body.appendChild(celebrateLayer);function done(){if(celebrateLayer){celebrateLayer.remove();celebrateLayer=null;}}
celebrateLayer.addEventListener('click',function(e){if(e.target.closest('.dz-celebrate-close,.dz-celebrate-ok,.dz-celebrate-backdrop'))done();});
}
function renderPanel(){
var host=document.getElementById('masarBody');if(!host)return;
var old=document.getElementById(panelId);if(old)old.remove();
var s=read(),l=level(s.xp),badges=badgeList(s),unlocked=badges.filter(b=>b[4]).length;
var h='<section class="dz-gamification-panel" id="'+panelId+'"><div class="dz-gamification-head"><div><span class="dz-gamification-kicker">🏅 إنجازاتك الشخصية</span><h3>مستواك ومكافآتك</h3><p>تُحتسب النقاط عند إكمال الحصص والاختبارات فعلياً.</p></div><div class="dz-level-number"><small>المستوى</small><b>'+l.n+'</b></div></div>';
h+='<div class="dz-xp-summary"><div><span>رصيد الخبرة</span><b>'+s.xp+' <small>XP</small></b></div><div><span>'+esc(l.name)+'</span><b>'+unlocked+'<small> / 20 شارة</small></b></div></div>';
h+='<div class="dz-xp-track"><div style="width:'+l.pct+'%"></div></div><div class="dz-xp-foot"><span>'+s.xp+' XP</span><span>'+(l.n>=10?'أعلى مستوى':(l.next-s.xp)+' XP للمستوى التالي')+'</span></div>';
h+='<div class="dz-badges-title"><b>معرض الشارات</b><span>'+unlocked+' مفتوحة · '+(20-unlocked)+' مقفلة</span></div><div class="dz-badges-grid">';
badges.forEach(function(b){h+='<article class="dz-badge-card '+(b[4]?'is-unlocked':'is-locked')+'"><span class="dz-badge-icon">'+b[1]+'</span><b>'+esc(b[2])+'</b><small>'+esc(b[3])+'</small><em>'+(b[4]?'مفتوحة':'مقفلة')+'</em></article>';});
h+='</div></section>';
var hero=host.querySelector('.ms-hero');if(hero)hero.insertAdjacentHTML('afterend',h);else host.insertAdjacentHTML('afterbegin',h);
}
function award(id,xp,kind,detail){
var s=read();if(s.events.indexOf(id)>=0)return;
var before=level(s.xp).n;s.events.push(id);s.events=s.events.slice(-500);s.xp+=xp;activity(s,detail.at);
if(kind==='lesson'){var lid=String(detail.unit)+':'+String(detail.session);if(s.lessons.indexOf(lid)<0)s.lessons.push(lid);if(detail.unitComplete&&s.units.indexOf(String(detail.unit))<0)s.units.push(String(detail.unit));}
if(kind==='quiz'){s.quizzes++;var pct=detail.total?detail.score/detail.total:0;if(pct>=.6)s.score60=true;if(pct>=.8)s.score80=true;if(pct>=1)s.perfect++;}
var after=level(s.xp).n,badges=badgeList(s),newBadges=badges.filter(function(b){return b[4]&&s.events.indexOf('badge:'+b[0])<0;});
newBadges.forEach(function(b){s.events.push('badge:'+b[0]);});
save(s);renderPanel();
if(after>before)toast('🎉 ارتقيت إلى المستوى '+after);
newBadges.forEach(function(b){toast('🏅 شارة جديدة: '+b[2]);});
if(after>before&&newBadges.length)showCelebration('المستوى '+after+' · شارة جديدة '+newBadges[0][2],'وصلت إلى '+s.xp+' نقطة خبرة وفتحت '+newBadges.length+' شارة جديدة.','🎉');
else if(after>before)showCelebration('وصلت إلى المستوى '+after+'!','رصيدك الآن '+s.xp+' نقطة خبرة. واصل التعلّم لتحقق إنجازات جديدة.','🎉');
else if(newBadges.length)showCelebration('فتحت شارة '+newBadges[0][2],newBadges.length>1?'فتحت '+newBadges.length+' شارات جديدة. '+newBadges[0][3]:newBadges[0][3],newBadges[0][1]);
}
document.addEventListener('dz:lesson-complete',function(e){var d=e.detail||{};if(!account()||!d.unit||!d.session)return;award('lesson:'+d.unit+':'+d.session,10,'lesson',d);});
document.addEventListener('dz:quiz-complete',function(e){var d=e.detail||{};if(!account()||!d.attemptId)return;award('quiz:'+d.attemptId,Number(d.score)||0,'quiz',d);});
document.addEventListener('dz:view',function(e){var v=e&&e.detail&&(e.detail.view||e.detail);if(v==='masar')setTimeout(renderPanel,180);});
document.addEventListener('dz:auth',function(){setTimeout(renderPanel,180);});
window.DZ_GAMIFICATION={read:read,level:level,badges:badgeList,render:renderPanel};
})();
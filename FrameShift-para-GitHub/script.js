'use strict';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
function closeMenu(){mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';mobileMenu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');});
mobileMenu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileMenu.hidden){closeMenu();menuButton.focus();}});
window.matchMedia('(min-width: 701px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
const canHover=window.matchMedia('(hover: hover) and (pointer: fine)');
let keyboardNavigation=false;
function setInputMode(keyboard){
 if(keyboardNavigation===keyboard)return;
 keyboardNavigation=keyboard;
 document.dispatchEvent(new Event('inputmodechange'));
}
document.addEventListener('keydown',event=>{if(['Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))setInputMode(true);},true);
document.addEventListener('pointerdown',()=>setInputMode(false),true);
if('IntersectionObserver' in window&&!reducedMotion.matches){const items=document.querySelectorAll('.section-heading,.project,.service-intro,.steps article,.team-card');items.forEach(item=>item.classList.add('reveal'));const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});items.forEach(item=>observer.observe(item));document.documentElement.classList.add('motion-ready');}
document.querySelector('#year').textContent=new Date().getFullYear();

// The floating navigation collapses without changing document layout.
const siteHeader=document.querySelector('.header');
let headerFrame=0;
function syncHeader(){siteHeader.classList.toggle('is-compact',window.scrollY>36);headerFrame=0;}
window.addEventListener('scroll',()=>{if(!headerFrame)headerFrame=requestAnimationFrame(syncHeader);},{passive:true});
syncHeader();

// A background-position animation under a fixed backdrop filter can keep
// repainting even when the heading is above the viewport. Stop that work.
const aiWord=document.querySelector('.ai-word');
let aiIsVisible=false;
function syncAiPlayback(){
  aiWord?.classList.toggle('ai-in-view',aiIsVisible&&!document.hidden&&!reducedMotion.matches);
}
if(aiWord&&'IntersectionObserver' in window){
  const aiVisibility=new IntersectionObserver(entries=>{
    aiIsVisible=entries[entries.length-1].isIntersecting;
    syncAiPlayback();
  });
  aiVisibility.observe(aiWord);
  document.addEventListener('visibilitychange',syncAiPlayback);
  reducedMotion.addEventListener('change',syncAiPlayback);
}

// Card navigation and touch gestures. Animation stops outside the viewport.
const carousel=document.querySelector('.client-carousel');
if(carousel){
  const deck=carousel.querySelector('.client-deck');
  const slides=[...carousel.querySelectorAll('.client-slide')];
  const labels=slides.map(slide=>slide.getAttribute('aria-label'));
  let current=0, visible=false, hovered=false, timer, gesture=null, suppressClick=false;
  function render(){
    slides.forEach(slide=>slide.dispatchEvent(new Event('previewreset')));
    slides.forEach((slide,index)=>{
      let slot=(index-current+slides.length)%slides.length;
      if(slot>slides.length/2)slot-=slides.length;
      slide.style.setProperty('--slot',slot);
      slide.dataset.position=String(slot);
      slide.inert=Math.abs(slot)>1;
      slide.setAttribute('aria-hidden',String(Math.abs(slot)>1));
      slide.tabIndex=Math.abs(slot)<=1?0:-1;
      if(slot===0){slide.removeAttribute('role');slide.setAttribute('aria-label',labels[index]);}
      else{slide.setAttribute('role','button');slide.setAttribute('aria-label',`${slot<0?'Previous':'Next'} project: ${slide.querySelector('strong').textContent}`);}
    });
    hovered=canHover.matches&&slides[current].matches(':hover');
    if(hovered&&!reducedMotion.matches)slides[current].dispatchEvent(new Event('previewstart'));
  }
  function schedule(){
    clearTimeout(timer);
    const keyboardFocus=keyboardNavigation&&slides.some(slide=>slide.matches(':focus-visible'));
    if(!reducedMotion.matches&&visible&&!document.hidden&&!hovered&&!keyboardFocus&&!gesture){
      timer=setTimeout(()=>step(1),5000);
    }
  }
  function step(direction){current=(current+direction+slides.length)%slides.length;render();schedule();}
  slides.forEach(slide=>{
    slide.querySelector('img').draggable=false;
    // Decode once before a card moves into view, avoiding decoding during a transition.
    slide.querySelector('img').decode?.().catch(()=>{});
    slide.addEventListener('click',event=>{
      const slot=Number(slide.dataset.position);
      if(slot!==0){event.preventDefault();step(slot<0?-1:1);}
    });
    slide.addEventListener('keydown',event=>{
      if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
        event.preventDefault();step(event.key==='ArrowLeft'?-1:1);slides[current].focus();
      }else if(event.key===' '&&Number(slide.dataset.position)!==0){event.preventDefault();slide.click();}
    });
    slide.addEventListener('pointerenter',event=>{
      if(event.pointerType==='mouse'&&slide===slides[current]){hovered=true;schedule();}
    });
    slide.addEventListener('pointerleave',()=>{
      if(slide===slides[current]){hovered=false;schedule();}
    });
    slide.addEventListener('transitionend',event=>{
      if(event.target!==slide||event.propertyName!=='transform')return;
      hovered=canHover.matches&&slides[current].matches(':hover');
      slide.dispatchEvent(new Event('previewinterest'));
      schedule();
    });
  });
  deck.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse'||!event.isPrimary)return;
    suppressClick=false;
    gesture={id:event.pointerId,x:event.clientX,y:event.clientY,dx:0,horizontal:false};
    schedule();
  });
  deck.addEventListener('pointermove',event=>{
    if(!gesture||gesture.id!==event.pointerId)return;
    const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
    if(!gesture.horizontal){
      if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){gesture=null;schedule();return;}
      if(Math.abs(dx)<10||Math.abs(dx)<=Math.abs(dy))return;
      gesture.horizontal=true;deck.setPointerCapture(event.pointerId);deck.classList.add('is-dragging');
    }
    gesture.dx=dx;suppressClick=true;
    deck.style.setProperty('--drag',`${Math.max(-70,Math.min(70,dx*.4))}px`);
  });
  function endGesture(event){
    if(!gesture||gesture.id!==event.pointerId)return;
    const {dx,horizontal}=gesture;gesture=null;
    deck.classList.remove('is-dragging');deck.style.setProperty('--drag','0px');
    if(deck.hasPointerCapture(event.pointerId))deck.releasePointerCapture(event.pointerId);
    if(event.type!=='pointercancel'&&horizontal&&Math.abs(dx)>35)step(dx<0?1:-1);
    else schedule();
    if(suppressClick)setTimeout(()=>{suppressClick=false;},400);
  }
  deck.addEventListener('pointerup',endGesture);
  deck.addEventListener('pointercancel',endGesture);
  deck.addEventListener('click',event=>{
    if(suppressClick){event.preventDefault();event.stopImmediatePropagation();}
  },true);
  carousel.addEventListener('focusin',schedule);
  carousel.addEventListener('focusout',()=>queueMicrotask(schedule));
  document.addEventListener('visibilitychange',schedule);
  reducedMotion.addEventListener('change',schedule);
  document.addEventListener('inputmodechange',schedule);
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;carousel.classList.toggle('in-view',visible);schedule();},{threshold:.15}).observe(carousel);
  }else{visible=true;}
  render();carousel.classList.add('is-ready');schedule();
}

// Short acceleration ramps keep cruise speed consistent and endpoints gentle.
document.querySelectorAll('.client-slide').forEach(slide=>{
 const frame=slide.querySelector('.client-preview'), image=frame.querySelector('img');
 let active=false, animation=null, travel=null, timer;
 const speed=325, ramp=.18;
 const interested=()=>!document.hidden&&slide.dataset.position==='0'&&((canHover.matches&&slide.matches(':hover'))||(keyboardNavigation&&slide.matches(':focus-visible')));
 const position=()=>{const transform=getComputedStyle(image).transform;return transform==='none'?0:new DOMMatrixReadOnly(transform).m42;};
 const velocity=()=>{
  if(!animation||!travel)return 0;
  const t=Math.max(0,Math.min(travel.duration,Number(animation.currentTime||0)/1000));
  if(travel.braking)return travel.velocity*(1-t/travel.duration);
  return travel.direction*travel.peak*Math.max(0,Math.min(1,t/travel.ramp,(travel.duration-t)/travel.ramp));
 };
 const freeze=()=>{const y=position();animation?.cancel();animation=null;travel=null;image.style.transform=`translateY(${y}px)`;return y;};
 const reset=()=>{active=false;clearTimeout(timer);animation?.cancel();animation=null;travel=null;image.style.transform='translateY(0)';};
 function animate(frames,duration,target,complete){
  const motion=image.animate(frames,{duration:duration*1000,fill:'forwards'});
  animation=motion;
  motion.onfinish=()=>{if(animation!==motion)return;image.style.transform=`translateY(${target}px)`;motion.cancel();animation=null;travel=null;complete?.();};
 }
 function moveTo(target,complete){
  const from=freeze();
  const distance=Math.abs(target-from),direction=Math.sign(target-from);
  if(distance<.5){image.style.transform=`translateY(${target}px)`;complete?.();return;}
  const peak=Math.min(speed,Math.sqrt(distance*speed/ramp));
  const acceleration=peak/(speed/ramp),duration=distance/peak+acceleration;
  const rampOffset=Math.min(.5,acceleration/duration);
  const edge=peak*acceleration/2;
  travel={direction,peak,ramp:acceleration,duration};
  animate([
   {transform:`translateY(${from}px)`,offset:0,easing:'cubic-bezier(.333333,0,.666667,.333333)'},
   {transform:`translateY(${from+direction*edge}px)`,offset:rampOffset,easing:'linear'},
   {transform:`translateY(${target-direction*edge}px)`,offset:1-rampOffset,easing:'cubic-bezier(.333333,.666667,.666667,1)'},
   {transform:`translateY(${target}px)`,offset:1}
  ],duration,target,complete);
 }
 function tour(){
  if(!active)return;
  const distance=Math.max(0,image.clientHeight-frame.clientHeight);
  if(!distance)return;
  moveTo(-distance,()=>{if(active)timer=setTimeout(()=>moveTo(0,()=>{if(active)timer=setTimeout(tour,1500);}),200);});
 }
 const start=()=>{if(active||!interested()||reducedMotion.matches)return;active=true;clearTimeout(timer);tour();};
 const stop=()=>{
  if(!active)return;
  active=false;clearTimeout(timer);
  if(reducedMotion.matches){reset();return;}
  const currentVelocity=velocity(),from=freeze();
  const distance=Math.max(0,image.clientHeight-frame.clientHeight);
  const target=Math.max(-distance,Math.min(0,from+currentVelocity*ramp/2));
  const resume=()=>{timer=setTimeout(()=>moveTo(0),250);};
  if(Math.abs(currentVelocity)<1||Math.abs(target-from)<.5){resume();return;}
  const duration=2*Math.abs(target-from)/Math.abs(currentVelocity);
  travel={braking:true,velocity:currentVelocity,duration};
  animate([{transform:`translateY(${from}px)`,easing:'cubic-bezier(.333333,.666667,.666667,1)'},{transform:`translateY(${target}px)`}],duration,target,resume);
 };
 const syncInterest=()=>{if(interested())start();else stop();};
 image.addEventListener('load',()=>{if(active)tour();});
 if('ResizeObserver' in window)new ResizeObserver(()=>{if(active)tour();else reset();}).observe(frame);
 slide.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')syncInterest();});
 slide.addEventListener('pointerleave',syncInterest);
 slide.addEventListener('focus',syncInterest);
 slide.addEventListener('blur',syncInterest);
 slide.addEventListener('previewstart',start);
 slide.addEventListener('previewreset',reset);
 slide.addEventListener('previewinterest',syncInterest);
 document.addEventListener('inputmodechange',syncInterest);
 reducedMotion.addEventListener('change',reset);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
});

// The entire project is a native link; wheel/touch scrolling remains native.
document.querySelectorAll('.project-link').forEach(link=>{
 const frame=link.querySelector('.website-scroll');
 link.querySelector('img').draggable=false;
 link.addEventListener('keydown',event=>{
  if(['ArrowDown','ArrowUp','PageDown','PageUp'].includes(event.key)){
   event.preventDefault();
   const delta=event.key.startsWith('Page')?frame.clientHeight*.85:60;
   frame.scrollBy({top: /Down$/.test(event.key)?delta:-delta,behavior:reducedMotion.matches?'instant':'smooth'});
  }
 });
});

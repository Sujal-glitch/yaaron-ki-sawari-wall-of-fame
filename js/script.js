/* Lightweight scripts for sliders, modal, lazy load, parallax, randomized counters */
document.addEventListener('DOMContentLoaded', function(){

  // helpers
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

  // set year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // VIDEO SLIDER
  const slidesWrap = document.getElementById('videoSlides');
  const slides = Array.from(document.querySelectorAll('.slide'));
  let vIndex = 0;
  if(slidesWrap && slides.length){
    function showVideos(i){
      slidesWrap.style.transform = `translateX(-${i*100}%)`;
    }
    // prev / next
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    nextBtn && nextBtn.addEventListener('click', ()=>{ vIndex = (vIndex+1) % slides.length; showVideos(vIndex); });
    prevBtn && prevBtn.addEventListener('click', ()=>{ vIndex = (vIndex-1+slides.length) % slides.length; showVideos(vIndex); });

    // autoplay with pause on hover (desktop)
    let vAuto = setInterval(()=>{ vIndex=(vIndex+1)%slides.length; showVideos(vIndex); }, 6000);
    slidesWrap.addEventListener('mouseenter', ()=> clearInterval(vAuto));
    slidesWrap.addEventListener('mouseleave', ()=> { vAuto = setInterval(()=>{ vIndex=(vIndex+1)%slides.length; showVideos(vIndex); }, 6000); });
  }

  // PLAY BUTTONS -> open modal
  const modal = $('#modal');
  const modalVideo = $('#modalVideo');
  $$('.play').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const src = btn.getAttribute('data-src');
      if(!src) return;
      modalVideo.src = src;
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden','false');
      modalVideo.play().catch(()=>{});
    });
  });
  $('#modalClose') && $('#modalClose').addEventListener('click', ()=>{ modalVideo.pause(); modalVideo.src=''; modal.style.display='none'; modal.setAttribute('aria-hidden','true'); });
  modal && modal.addEventListener('click', (e)=>{ if(e.target === modal){ modalVideo.pause(); modalVideo.src=''; modal.style.display='none'; modal.setAttribute('aria-hidden','true'); }});

  // TESTIMONIAL SLIDER
  const testiSlider = document.getElementById('testiSlider');
  const testiItems = testiSlider ? Array.from(testiSlider.children) : [];
  let tIndex = 0;
  if(testiSlider && testiItems.length){
    testiSlider.style.display = 'flex';
    testiSlider.style.transition = 'transform 0.6s ease';
    testiItems.forEach(it=> it.style.minWidth = '100%');
    document.getElementById('testiNext') && document.getElementById('testiNext').addEventListener('click', ()=>{ tIndex = (tIndex+1)%testiItems.length; testiSlider.style.transform = `translateX(-${tIndex*100}%)`; });
    document.getElementById('testiPrev') && document.getElementById('testiPrev').addEventListener('click', ()=>{ tIndex = (tIndex-1+testiItems.length)%testiItems.length; testiSlider.style.transform = `translateX(-${tIndex*100}%)`; });
    setInterval(()=>{ tIndex = (tIndex+1)%testiItems.length; testiSlider.style.transform = `translateX(-${tIndex*100}%)`; }, 6000);
  }

  // Lazy load observer for images and videos (small)
  const lazyTargets = Array.from(document.querySelectorAll('img, video'));
  const lazyIO = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const el = en.target;
        // for video, do nothing (src already set) — but can play if autoplay attribute used
        if(el.tagName === 'IMG' && el.dataset && el.dataset.src) el.src = el.dataset.src;
        lazyIO.unobserve(el);
      }
    });
  }, {threshold: 0.2});
  lazyTargets.forEach(t => lazyIO.observe(t));

  // Parallax for elements with .parallax
  const parallaxEls = Array.from(document.querySelectorAll('.parallax'));
  window.addEventListener('scroll', ()=>{
    const sc = window.scrollY;
    parallaxEls.forEach(el=>{
      const speed = parseFloat(el.dataset.speed || 0.6);
      el.style.transform = `translateY(${-(sc*speed/8)}px)`;
    });
  });

  // Randomized activity counters (small random fluctuation for lively feel)
  function randomPulse(id, base, variance, suffix = ''){
    const el = document.getElementById(id);
    if(!el) return;
    setInterval(()=>{ const v = base + Math.floor(Math.random()*variance); el.textContent = v + suffix; }, 3200 + Math.random()*4200);
  }
  randomPulse('d-videos', 250, 20, '+');
  randomPulse('d-google', 550, 12, '+');
  randomPulse('d-trip', 426, 8, '');
  randomPulse('s1', 250, 20, '+');
  randomPulse('s2', 550, 12, '+');
  randomPulse('s3', 426, 8, '');

  // small confetti effect on load and on click of whatsapp/share buttons
  function confettiSmall(){
    try{
      for(let i=0;i<18;i++){
        const el = document.createElement('div');
        el.style.position = 'fixed';
        el.style.width = '8px'; el.style.height = '8px'; el.style.borderRadius = '50%';
        const colors = ['#FFD166','#ffc857','#3B6978','#204051'];
        el.style.background = colors[Math.floor(Math.random()*colors.length)];
        el.style.left = (50 + (Math.random()-0.5)*40) + '%';
        el.style.top = (30 + Math.random()*30) + '%';
        el.style.zIndex = 1200;
        document.body.appendChild(el);
        el.animate([{transform:'translateY(0) rotate(0)', opacity:1},{transform:`translateY(${120+Math.random()*80}px) rotate(${Math.random()*360}deg)`, opacity:0}], {duration:900+Math.random()*600, easing:'cubic-bezier(.2,.9,.2,1)'});
        setTimeout(()=> el.remove(), 1800);
      }
    }catch(e){}
  }
  setTimeout(confettiSmall, 700);
  Array.from(document.querySelectorAll('.whatsapp, #whatsAppFab')).forEach(el=> el.addEventListener('click', confettiSmall));

  // accessibility: show focus outlines when keyboard used
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Tab') document.body.classList.add('show-focus'); });

});

const header=document.querySelector('.site-header');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>18));

const observer=new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

let bag=0;const bagCount=document.getElementById('bag-count');const toast=document.getElementById('toast');const toastProduct=document.getElementById('toast-product');let toastTimer;
document.querySelectorAll('.quick-add').forEach(btn=>btn.addEventListener('click',()=>{bag++;bagCount.textContent=bag;toastProduct.textContent=btn.dataset.product;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2200)}));

const overlay=document.getElementById('search-overlay');
document.querySelector('[data-open-search]').addEventListener('click',()=>{overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');setTimeout(()=>overlay.querySelector('input').focus(),150)});
document.querySelector('[data-close-search]').addEventListener('click',()=>{overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')overlay.classList.remove('open')});

document.getElementById('newsletter-form').addEventListener('submit',e=>{e.preventDefault();const msg=document.getElementById('form-message');msg.textContent='You’re in. Welcome to the Good Pet Club ♡';e.target.querySelector('input').value=''});

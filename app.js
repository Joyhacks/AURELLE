'use strict';

/** AURELLE — frontend-only portfolio concept. Cart persists locally; no payment processing. */
const products = [
  {id:'daily-drop',no:'01',name:'The Daily Drop',type:'Hydrating face serum',category:'Treat',size:'30 ml',price:32,bg:'#e6d7be',image:'./assets/product-daily-drop.svg',tag:'BESTSELLER',description:'A lightweight, comfortable daily serum that slips into your routine without a second thought. Your morning reset in a little glass bottle.',ingredients:['Niacinamide','Beta-glucan','Glycerin'],ritual:'Apply a few drops after cleansing, before moisturiser.'},
  {id:'soft-reset',no:'02',name:'Soft Reset',type:'Everyday cream cleanser',category:'Cleanse',size:'150 ml',price:26,bg:'#ddd8cb',image:'./assets/product-soft-reset.svg',tag:'THE FIRST STEP',description:'A gentle, creamy start and finish to your day. Made for washing the day away without making a big deal of it.',ingredients:['Oat extract','Squalane','Glycerin'],ritual:'Massage onto damp skin, then rinse with lukewarm water.'},
  {id:'good-barrier',no:'03',name:'Good Barrier',type:'Daily comfort moisturiser',category:'Moisturise',size:'50 ml',price:36,bg:'#c8d4b6',image:'./assets/product-good-barrier.svg',tag:'EVERYDAY FAVOURITE',description:'A cushiony daily cream for that soft, supported feeling. The kind of moisturiser you finish down to the last little bit.',ingredients:['Ceramides','Glycerin','Squalane'],ritual:'Smooth a small amount over skin after serum, morning or night.'},
  {id:'after-hours',no:'04',name:'After Hours',type:'Nourishing face oil',category:'Treat',size:'30 ml',price:34,bg:'#e7c5b6',image:'./assets/product-after-hours.svg',tag:'NIGHT RITUAL',description:'A little something for the end of a long day. A few drops help turn a nightly routine into a moment for yourself.',ingredients:['Squalane','Meadowfoam seed oil','Jojoba oil'],ritual:'Press 2–3 drops over moisturiser as the last step of your evening routine.'}
];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
const productById = id => products.find(p => p.id === id);
const cartKey='aurelle-demo-cart-v1';
let cart={};let activeFilter='All';let toastTimer;
try {const saved=JSON.parse(localStorage.getItem(cartKey)||'{}');if(saved && typeof saved==='object'&&!Array.isArray(saved)){for(const [id,n] of Object.entries(saved)){if(productById(id)&&Number.isInteger(n)&&n>0&&n<=30)cart[id]=n;}}}catch(_){cart={};}
function saveCart(){try{localStorage.setItem(cartKey,JSON.stringify(cart));}catch(_){/* cart still works in this tab */}}
function cartCount(){return Object.values(cart).reduce((a,b)=>a+b,0)}
function cartSubtotal(){return Object.entries(cart).reduce((sum,[id,n])=>sum+(productById(id)?.price||0)*n,0)}
function toast(message){const node=$('#toast');node.textContent=message;node.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('is-visible'),3100)}
function updateBag(){const count=cartCount();$('#bagCount').textContent=count;$('#cartTitleCount').textContent=`(${count})`;$('#openCart').setAttribute('aria-label',`Open bag, ${count} items`)}
function addToBag(id){const p=productById(id);if(!p)return;cart[id]=Math.min(30,(cart[id]||0)+1);saveCart();updateBag();renderCart();toast(`${p.name} added to your bag`)}
function renderProducts(filter='All'){
 activeFilter=filter;
 const shown=products.filter(p=>filter==='All'||p.category===filter);
 $('#productGrid').innerHTML=shown.map((p,i)=>`<article class="product-card" style="--product-bg:${p.bg};animation-delay:${i*55}ms"><button type="button" class="product-image-button" data-view="${p.id}" aria-label="View ${p.name} details"><span class="product-tag">${p.tag}</span><img class="product-visual" src="${p.image}" alt="${p.name} packaging" width="480" height="540" loading="lazy"><span class="product-view" aria-hidden="true">↗</span><span class="product-no">A / ${p.no}</span></button><div class="product-meta"><div><h3>${p.name}</h3><p>${p.type} · ${p.size}</p></div><span class="price">${money(p.price)}</span></div><button type="button" class="product-action" data-add="${p.id}" aria-label="Add ${p.name} to bag">Add to bag <span aria-hidden="true">+</span></button></article>`).join('')||'<div class="empty-products">No products in this edit yet.</div>';
 $$('#productFilters [data-filter]').forEach(btn=>{const selected=btn.dataset.filter===filter;btn.classList.toggle('is-active',selected);btn.setAttribute('aria-pressed',selected?'true':'false')});
}
function renderCart(){const items=Object.entries(cart).filter(([id,q])=>productById(id)&&q>0);$('#cartItems').innerHTML=items.length?items.map(([id,q])=>{const p=productById(id);return `<article class="cart-line" style="--product-bg:${p.bg}"><div class="cart-thumb"><img src="${p.image}" alt="" width="91" height="102"></div><div><div class="cart-line-top"><div><h3>${p.name}</h3><small>${p.type}</small></div><strong>${money(p.price*q)}</strong></div><div class="cart-qty"><button type="button" data-qty="${id}" data-delta="-1" aria-label="Decrease ${p.name} quantity">−</button><span>${q}</span><button type="button" data-qty="${id}" data-delta="1" aria-label="Increase ${p.name} quantity">+</button><button type="button" class="remove-line" data-remove="${id}">Remove</button></div></div></article>`}).join(''):`<div class="cart-empty"><strong>Your bag is taking a breather.</strong><p>Good things start with one little essential.</p><button class="button button-ink" type="button" data-shop="true">Explore the edit <span>↗</span></button></div>`;
 const sub=cartSubtotal();$('#cartSubtotal').textContent=money(sub);
 $('#shippingMessage').textContent=items.length===0?'Shipping details appear once you add an item.':sub>=65?'Your bag qualifies for complimentary standard shipping.':`Add ${money(65-sub)} more to reach complimentary standard shipping.`;
 $('#checkoutButton').disabled=items.length===0;$('#checkoutButton').style.opacity=items.length===0?'.5':'1';
}
function changeQty(id,delta){if(!productById(id))return;const next=(cart[id]||0)+delta;if(next<=0)delete cart[id];else cart[id]=Math.min(next,30);saveCart();updateBag();renderCart()}
function showDialog(id){const d=document.getElementById(id);if(!d)return;$$('dialog[open]').forEach(dialog=>dialog.close());d.showModal();document.body.classList.add('has-dialog')}
function closeDialog(id){const d=document.getElementById(id);if(d?.open)d.close()}
$$('dialog').forEach(d=>{d.addEventListener('close',()=>{if(!$$('dialog[open]').length)document.body.classList.remove('has-dialog')});d.addEventListener('click',ev=>{if(ev.target===d){const bounds=d.getBoundingClientRect();if(ev.clientX<bounds.left||ev.clientX>bounds.right||ev.clientY<bounds.top||ev.clientY>bounds.bottom)d.close()}})});
function openQuick(id){const p=productById(id);if(!p)return;$('#quickTitle').textContent=p.name;$('#quickContent').innerHTML=`<div class="quick-cover" style="--product-bg:${p.bg}"><img src="${p.image}" alt="${p.name} package" width="480" height="540"></div><div class="quick-details"><div class="quick-price">${money(p.price)} <span style="font-weight:400;color:var(--muted);font-size:12px;margin-left:8px">/ ${p.size}</span></div><p>${p.description}</p><h3>Inside the formula</h3><ul>${p.ingredients.map(x=>`<li>${x}</li>`).join('')}</ul><h3>Make it a ritual</h3><p style="margin-top:8px">${p.ritual}</p><button class="button button-ink" type="button" data-add="${p.id}">Add to bag — ${money(p.price)} <span>↗</span></button></div>`;showDialog('quickDialog')}
function search(term=''){const q=term.trim().toLowerCase();const matched=products.filter(p=>`${p.name} ${p.type} ${p.category} ${p.description} ${p.ingredients.join(' ')}`.toLowerCase().includes(q));$('#searchResults').innerHTML=matched.length?matched.map(p=>`<button class="search-result" type="button" data-view="${p.id}" style="--product-bg:${p.bg}"><img src="${p.image}" alt="" width="60" height="66"><span><strong>${p.name}</strong><small>${p.type}</small></span><span>↗</span></button>`).join(''):'<p class="search-no-results">No match yet. Try “serum” or “cream”.</p>'}
let quizStep=0,skinFeel='';
function renderQuiz(){const el=$('#quizContent');if(quizStep===0){el.innerHTML=`<div class="quiz-content"><p class="quiz-step">01 / 02 — LET'S START SIMPLE</p><h3>How does your skin tend to feel?</h3><div class="quiz-choices"><button data-feel="dry">Dry, tight, or a bit thirsty <span>↗</span></button><button data-feel="balanced">Pretty balanced most days <span>↗</span></button><button data-feel="oily">Shiny, especially by midday <span>↗</span></button><button data-feel="varies">A little of everything <span>↗</span></button></div></div>`}else if(quizStep===1){el.innerHTML=`<div class="quiz-content"><p class="quiz-step">02 / 02 — THE THING YOU WANT MOST</p><h3>What sounds good for your routine right now?</h3><div class="quiz-choices"><button data-goal="hydration">More everyday comfort <span>↗</span></button><button data-goal="reset">A fresh start, morning or night <span>↗</span></button><button data-goal="simple">Keeping things uncomplicated <span>↗</span></button><button data-goal="winddown">A small end-of-day ritual <span>↗</span></button></div><div style="margin-top:23px"><button type="button" class="quiz-link" data-back>← Back a step</button></div></div>`}}
function quizResult(goal){let id='daily-drop';if(goal==='hydration')id='good-barrier';else if(goal==='reset')id='soft-reset';else if(goal==='winddown')id='after-hours';else if(goal==='simple')id=skinFeel==='dry'?'good-barrier':skinFeel==='oily'?'soft-reset':'daily-drop';const p=productById(id);quizStep=2;$('#quizContent').innerHTML=`<div class="quiz-content"><p class="quiz-step">YOUR EDIT / NO RULES, JUST A START</p><h3>Meet your new everyday favourite.</h3><div class="quiz-product"><img src="${p.image}" alt="${p.name}" class="quiz-result-img"><div><h4>${p.name}</h4><p>${p.description}</p><p><strong>${money(p.price)}</strong> · ${p.size}</p></div></div><p style="font-size:12px;line-height:1.7">A suggested starting point, not a diagnosis. Patch test new products and find what works for your skin.</p><div class="quiz-actions"><button class="button button-ink" type="button" data-add="${p.id}">Add your match <span>+</span></button><button class="quiz-link" type="button" data-restart>Start again</button></div></div>`}
const articles={
 texture:{title:'Skin has a texture. That’s a good thing.',lead:'An ode to the freckles, pores, lines and changing little details that make skin human.',body:['It’s easy to forget that skin is a living thing. It changes with the weather, with sleep, with stress and with time. That isn’t a design flaw. It’s what skin does.','A more realistic approach to skincare starts with paying attention: how your face feels after washing, when it needs comfort, what you actually enjoy using. A good routine can be simple and flexible.','There is no finish line called perfect skin. There’s the day you’re in, the skin you have, and the small ways you care for it.']},
 ritual:{title:'How to build a ritual that actually fits.',lead:'A thoughtful routine is one you can keep — especially on the days you’re busy.',body:['Start with the essentials. Cleanse gently when it makes sense for your day, keep skin comfortable with moisturiser, and make daily sun protection a habit using an appropriately rated sunscreen.','If you enjoy a serum or face oil, add one at a time. Giving yourself space between new products makes it easier to notice what suits you.','The best routine isn’t the longest one. It’s the one that feels natural enough to become part of your life.']}
};
function openArticle(id){const a=articles[id];if(!a)return;$('#articleContent').innerHTML=`<article class="article-inner"><span class="mini-label">AN AURELLE FIELD NOTE</span><h2 id="articleTitle">${a.title}</h2><p class="article-lead">${a.lead}</p>${a.body.map(p=>`<p>${p}</p>`).join('')}<a href="#shop" class="text-link" data-article-shop="true">Explore the collection <span>↗</span></a></article>`;showDialog('articleDialog')}

document.addEventListener('click',ev=>{
 const close=ev.target.closest('[data-close]');if(close){closeDialog(close.dataset.close);return}
 const add=ev.target.closest('[data-add]');if(add){addToBag(add.dataset.add);return}
 const view=ev.target.closest('[data-view]');if(view){openQuick(view.dataset.view);return}
 const filter=ev.target.closest('[data-filter]');if(filter){renderProducts(filter.dataset.filter);return}
 const qty=ev.target.closest('[data-qty]');if(qty){changeQty(qty.dataset.qty,Number(qty.dataset.delta));return}
 const remove=ev.target.closest('[data-remove]');if(remove){delete cart[remove.dataset.remove];saveCart();updateBag();renderCart();return}
 const shop=ev.target.closest('[data-shop]');if(shop){closeDialog('cartDialog');$('#shop').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});return}
 const feel=ev.target.closest('[data-feel]');if(feel){skinFeel=feel.dataset.feel;quizStep=1;renderQuiz();return}
 const goal=ev.target.closest('[data-goal]');if(goal){quizResult(goal.dataset.goal);return}
 if(ev.target.closest('[data-back]')){quizStep=0;renderQuiz();return}
 if(ev.target.closest('[data-restart]')){quizStep=0;skinFeel='';renderQuiz();return}
 const article=ev.target.closest('[data-article]');if(article){openArticle(article.dataset.article);return}
 if(ev.target.closest('[data-article-shop]')){closeDialog('articleDialog')}
});
$('#openCart').addEventListener('click',()=>{renderCart();showDialog('cartDialog')});
function openSearch(){search();$('#searchInput').value='';showDialog('searchDialog');$('#searchInput').focus()}
$('#openSearch').addEventListener('click',openSearch);
$('#footerSearch').addEventListener('click',openSearch);
$('#searchInput').addEventListener('input',ev=>search(ev.target.value));
$('#openQuiz').addEventListener('click',()=>{skinFeel='';quizStep=0;renderQuiz();showDialog('quizDialog')});
$('#openMenu').addEventListener('click',()=>showDialog('menuDialog'));
$$('#menuDialog nav a').forEach(a=>a.addEventListener('click',()=>closeDialog('menuDialog')));
$('#checkoutButton').addEventListener('click',()=>toast('Checkout is not connected in this frontend demo.'));
$('#newsletterForm').addEventListener('submit',ev=>{ev.preventDefault();const email=$('#email');if(email.checkValidity()){const m=$('#newsletterMessage');m.textContent='Thanks for stopping by. Newsletter signup is a visual demo, so your email was not saved.';email.value='';toast('AURELLE is still a concept. No email was stored.')}});
const mailLink=$('#mailLink');mailLink.href='#contact';mailLink.textContent='Stay in the loop ↗';
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px -40px 0px'});$$('.reveal').forEach(el=>observer.observe(el))}else{$$('.reveal').forEach(el=>el.classList.add('in-view'))}
renderProducts();updateBag();renderCart();

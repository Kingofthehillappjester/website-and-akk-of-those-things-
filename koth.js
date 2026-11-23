/* King of the Hill — shared behaviour: reveal on scroll, mobile nav,
   contact dialog (with trip preselect), floating contact button. */
(function(){
  // Reveal on scroll
  var els=document.querySelectorAll('.r');
  function revealAll(){ els.forEach(function(el){ el.classList.add('in'); }); }
  if(!('IntersectionObserver' in window)){ revealAll(); }
  else {
    try{
      var io=new IntersectionObserver(function(e){
        e.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); } });
      },{threshold:0.05,rootMargin:'0px 0px -5% 0px'});
      els.forEach(function(el){ io.observe(el); });
      setTimeout(revealAll,1500);
    }catch(err){ revealAll(); }
  }

  // Mobile nav
  var nav=document.getElementById('siteNav');
  if(nav){
    var t=nav.querySelector('.nav-toggle');
    t.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      t.setAttribute('aria-expanded',open?'true':'false');
      t.setAttribute('aria-label',open?'Close menu':'Open menu');
    });
    nav.querySelectorAll('.nav-links a').forEach(function(a){
      a.addEventListener('click',function(){
        nav.classList.remove('open');
        t.setAttribute('aria-expanded','false');
        t.setAttribute('aria-label','Open menu');
      });
    });
  }

  // Contact dialog
  var dlg=document.getElementById('contact'), form=document.getElementById('contactForm'),
      done=document.getElementById('cfDone'), status=document.getElementById('cfStatus');
  if(dlg&&form){
    var ENDPOINT='https://formsubmit.co/ajax/info@kingofthehill.co.uk';
    // Also send each enquiry to the KOTH enquiry desk. Best effort: the email above still goes either way.
    var DESK='https://koth-enquiry-desk.vercel.app/api/intake';
    var last=null, trip=form.elements.trip;
    function open(e){
      if(e) e.preventDefault();
      last=document.activeElement;
      var want=(e&&e.currentTarget&&e.currentTarget.getAttribute('data-tour'))||document.body.getAttribute('data-tour')||'';
      if(trip&&want){ trip.value=want; }
      form.hidden=false; done.hidden=true; status.textContent='';
      if(dlg.showModal) dlg.showModal(); else dlg.setAttribute('open','');
      setTimeout(function(){ document.getElementById('cfName').focus(); },30);
    }
    function close(){ if(dlg.close) dlg.close(); else dlg.removeAttribute('open'); if(last&&last.focus) last.focus(); }
    document.querySelectorAll('[data-contact]').forEach(function(b){ b.addEventListener('click',open); });
    dlg.querySelectorAll('[data-close]').forEach(function(b){ b.addEventListener('click',close); });
    dlg.addEventListener('click',function(e){ if(e.target===dlg) close(); });
    if(location.hash==='#contact') open();
    function tripLabel(){ return trip&&trip.value?trip.value:'Not sure yet'; }
    function mailto(){ var f=form.elements;
      return 'mailto:info@kingofthehill.co.uk?subject='+encodeURIComponent('Website enquiry ('+tripLabel()+') from '+f.name.value)+
        '&body='+encodeURIComponent(f.message.value+'\n\nTrip: '+tripLabel()+'\n'+f.name.value+'\n'+f.phone.value); }
    form.addEventListener('submit',function(e){
      e.preventDefault(); var f=form.elements, bad=null;
      ['name','phone','message'].forEach(function(k){ var ok=f[k].value.trim().length>0;
        f[k].setAttribute('aria-invalid',ok?'false':'true'); if(!ok&&!bad) bad=f[k]; });
      if(f.phone.value.trim() && !/^[+()0-9\s-]{7,}$/.test(f.phone.value.trim())){ f.phone.setAttribute('aria-invalid','true'); bad=bad||f.phone; }
      if(f.email.value.trim() && !f.email.checkValidity()){ f.email.setAttribute('aria-invalid','true'); bad=bad||f.email; }
      if(bad){ status.textContent='Please fill in your name, a valid phone number and your question.'; bad.focus(); return; }
      if(f._honey.value) return;
      var btn=form.querySelector('.cf-submit'); btn.disabled=true; btn.textContent='Sending…'; status.textContent='';
      var data={ name:f.name.value.trim(), phone:f.phone.value.trim(), trip:tripLabel(), message:f.message.value.trim(),
        _subject:'Website enquiry ('+tripLabel()+'): '+f.name.value.trim(), _template:'table', _captcha:'false' };
      if(f.email.value.trim()){ data.email=f.email.value.trim(); data._replyto=data.email; }
      try{
        var desk={ name:data.name, phone:data.phone, trip:(trip&&trip.value)||'', message:data.message, page:location.pathname };
        if(data.email) desk.email=data.email;
        fetch(DESK,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(desk),keepalive:true}).catch(function(){});
      }catch(err){}
      fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){ return r.json().then(function(j){ if(!r.ok || String(j.success)!=='true') throw 0; }); })
        .then(function(){ form.reset(); form.hidden=true; done.hidden=false; done.querySelector('[data-close].book-btn').focus(); })
        .catch(function(){ status.innerHTML='Sorry, that didn&rsquo;t send. Please <a href="'+mailto()+'">email us directly</a> instead.'; })
        .then(function(){ btn.disabled=false; btn.textContent='Send message'; });
    });
  }

  // Floating contact button: show after the hero, hide over booking areas
  var fab=document.getElementById('fabContact'), hero=document.querySelector('.hero');
  if(fab){
    if(!hero||!('IntersectionObserver' in window)){ fab.classList.add('show'); }
    else {
      var pastHero=false, blocking=new Set();
      var upd=function(){ fab.classList.toggle('show', pastHero && blocking.size===0); };
      new IntersectionObserver(function(e){ pastHero=!e[0].isIntersecting; upd(); }).observe(hero);
      var bo=new IntersectionObserver(function(es){ es.forEach(function(x){ x.isIntersecting?blocking.add(x.target):blocking.delete(x.target); }); upd(); });
      document.querySelectorAll('.booking,.cta-strip,footer,#consultation').forEach(function(el){ bo.observe(el); });
    }
  }
})();

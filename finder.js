/* Homepage "Find your trip" selector. Runs entirely in the browser. */
(function(){
  var form=document.getElementById('finder'), out=document.getElementById('finderResult');
  if(!form||!out) return;
  var T={
    learn:{name:'Learn to Ski Tour the Himalayas',url:'learn-to-ski-tour-himalayas',meta:'14 days &middot; 4,130m &middot; from &pound;4,950'},
    anna:{name:'Annapurna Ski Expedition',url:'annapurna-ski-expedition',meta:'10 days &middot; 5,416m &middot; from &pound;13,500'},
    mera:{name:'Mera Peak Ski Expedition',url:'mera-peak-ski-expedition',meta:'18 days &middot; 6,476m &middot; from &pound;8,950'},
    him:{name:'Himlung Himal Ski Expedition',url:'himlung-himal-ski-expedition',meta:'About 30 days &middot; 7,126m &middot; from &pound;11,950'}
  };
  function val(n){ var el=form.querySelector('input[name="'+n+'"]:checked'); return el?el.value:null; }
  function link(k,txt){ return '<a href="'+T[k].url+'">'+(txt||T[k].name)+'</a>'; }
  function show(kicker,title,body,k,alt){
    var btn=k?'<a class="book-btn primary" href="'+T[k].url+'">See '+T[k].name+' &rarr;</a>':
      '<button type="button" class="book-btn primary" data-contact>Talk to us</button>';
    out.innerHTML='<div class="kicker"><span>'+kicker+'</span></div><h3>'+title+'</h3>'+
      (k?'<p class="small" style="margin:-4px 0 12px;">'+T[k].meta+'</p>':'')+
      '<p>'+body+'</p>'+btn+(alt?'<p class="alt">'+alt+'</p>':'');
    var c=out.querySelector('[data-contact]'), f=document.querySelector('#fabContact');
    if(c&&f){ c.addEventListener('click',function(e){ e.preventDefault(); f.click(); }); }
  }
  function decide(){
    var ski=val('ski'), tour=val('tour'), alt=val('alt'), style=val('style');
    if(ski==='piste'){
      show('Not quite yet','Build your <em>off-piste first.</em>',
        'All of our trips are off the piste. A week or two of off-piste lessons will get you ready, and then '+link('learn','Learn to Ski Tour the Himalayas')+' is the place to start. We&rsquo;re happy to suggest where to go.',
        null,'Or have a look at '+link('learn','what Learn to Ski Tour involves')+'.');
      return;
    }
    if(!ski||!tour||!alt||!style){
      var left=[ski,tour,alt,style].filter(function(x){return !x;}).length;
      out.innerHTML='<div class="kicker"><span>Your match</span></div><h3>'+left+' more to go&hellip;</h3><p>Answer every question to see the trip that fits you best.</p>';
      return;
    }
    if(style==='lux'){
      var a=(ski==='strong'&&tour==='lots'&&alt==='high')?'You&rsquo;re also qualified for '+link('him')+' if you ever want it wild.':
            (ski==='strong'&&tour!=='never')?'Want something wilder later? Try '+link('mera')+'.':
            'No touring experience is needed. Want to learn properly first? See '+link('learn')+'.';
      show('Your match','Annapurna Ski <em>Expedition</em>',
        'Our only luxury trip: five-star hotels, a heated private-tent base camp at 4,565m, snowmobile uplift after the first tour and a helicopter exit. You need to be comfortable on reds and blacks with some off-piste, and no touring experience is required.','anna',a);
      return;
    }
    if(ski==='strong'&&tour==='lots'&&alt==='high'){
      show('Your match','Himlung Himal <em>Ski Expedition</em>',
        'You&rsquo;ve got the skiing, the touring and a 6,000m+ summit, so you&rsquo;re ready for the top of the ladder: a month-long 7,126m expedition in the Nar Phu valley. We&rsquo;ll check your experience before you book.','him',
        'Want a shorter trip this year? '+link('mera')+' is 18 days.');
      return;
    }
    if(ski==='strong'&&tour!=='never'){
      show('Your match','Mera Peak <em>Ski Expedition</em>',
        'A 6,476m summit on skis, for confident off-piste skiers who&rsquo;ve toured before. It&rsquo;s rugged, with teahouses and tents, and it&rsquo;s the summit that qualifies you for Himlung.','mera',
        alt==='low'?'Never been above 4,000m? That&rsquo;s fine: the itinerary climbs slowly, with spare days.':'Next step after Mera: '+link('him')+'.');
      return;
    }
    show('Your match','Learn to Ski Tour <em>the Himalayas</em>',
      'Two weeks in the Annapurna Sanctuary, learning to tour from scratch with HST&rsquo;s guides: skins, kick turns, avalanche rescue and your first Himalayan descents. Teahouses, not hotels.','learn',
      'Prefer comfort? The '+link('anna')+' needs no touring experience either. Already touring? Look at '+link('mera')+'.');
  }
  form.addEventListener('change',decide);
})();

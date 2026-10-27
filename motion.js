window.AssociationMotion = (() => {
  const {createTimeline, animate, stagger, svg} = window.anime || {};
  let intro;
  let search;
  let finishSearch;
  function stopIntro() { if (intro) { intro.revert(); intro = null; } }
  function welcome(app) {
    if (!createTimeline || app.reducedMotion) { app.finishIntro(); return; }
    const start=document.querySelector('.intro-monogram').getBoundingClientRect();
    const end=document.querySelector('.brand-symbol').getBoundingClientRect();
    intro = createTimeline({defaults:{ease:'out(3)'},onComplete:()=>app.finishIntro()})
      .add('.intro-i',{y:[-35,0],opacity:[0,1],duration:800},0)
      .add('.intro-t',{x:[35,0],opacity:[0,1],duration:850},180)
      .add(svg.createDrawable('.intro-rule'),{draw:['0 0','0 1'],duration:700},450)
      .add('.welcome-wordmark h2, .welcome-caption',{y:[10,0],opacity:[0,1],delay:stagger(100),duration:600},600)
      .add('.welcome-colors i',{scaleX:[0,1],opacity:[0,1],delay:stagger(70),duration:500},900)
      .add('.welcome-wordmark h2, .welcome-caption, .welcome-colors, .intro-rule',{opacity:[1,0],duration:380},1800)
      .add('.intro-monogram',{x:[0,end.x+end.width/2-start.x-start.width/2],y:[0,end.y+end.height/2-start.y-start.height/2],scale:[1,end.width/start.width],duration:650,ease:'inOut(3)'},1800)
      .add('.intro-t',{fill:['#25251f','#2949b8'],duration:650},1800)
      .add('.welcome-skip',{opacity:[1,0],duration:200},2050);
  }
  function arrive() {
    if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    animate('.headline-first, .headline-second',{y:[14,0],opacity:[0,1],duration:650,delay:stagger(80),ease:'out(3)'});
    animate('.department-band',{x:[20,0],opacity:[0,1],duration:650,delay:stagger(65),ease:'out(3)'});
  }
  function cancelSearch() {
    if (search) { search.revert(); search = null; }
    if (finishSearch) { const resolve = finishSearch; finishSearch = null; resolve(false); }
  }
  function lookup(app) {
    if (!createTimeline || app.reducedMotion) return Promise.resolve(true);
    cancelSearch();
    return new Promise(resolve => {
      finishSearch = resolve;
      search = createTimeline({defaults:{ease:'out(3)'},onComplete:()=>{finishSearch=null;resolve(true);}})
        .add('.search-name',{opacity:[0,1],y:[10,0],duration:350},0)
        .add('.department-token',{opacity:[0,1],x:[14,0],duration:350,delay:stagger(60)},0);
      const captions=['从好奇开始。','让想法成为现实。','把每一次相遇记录下来。','把认真，连接在一起。','为想法，找到自己的表达。'];
      app.departments.forEach((department,index)=>{
        const row=document.querySelectorAll('.department-token')[index];
        const at=130+index*520;
        search.call(()=>{app.searchStep=department;app.searchCaption=captions[index];},at)
          .add(row.querySelector('.token-line'),{scaleX:[0,1],duration:440},at);
        const icon=row.querySelector('svg');
        if(index===0 || index===2 || index===4) search.add(svg.createDrawable(icon.querySelector('path')),{draw:['0 0','0 1'],duration:450},at);
        if(index===1) search.add(icon,{scale:[.65,1],rotate:[-12,0],duration:440},at);
        if(index===3) search.add(icon,{x:[-10,0],rotate:[-7,0],duration:440},at);
      });
      search.add('.search-content',{opacity:[1,0],duration:240},2870);
    });
  }
  function result(reduced) {
    if (!animate || reduced) return;
    animate('.result-heading, .member-pass, .member-details, .result-actions',{
      y:[12,0],opacity:[0,1],duration:600,delay:stagger(90),ease:'out(3)'
    });
  }
  document.addEventListener('visibilitychange',()=>{
    for(const timeline of [intro,search]) if(timeline&&!timeline.completed) document.hidden?timeline.pause():timeline.resume();
  });
  return {welcome,stopIntro,arrive,lookup,cancelSearch,result};
})();

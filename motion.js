window.AssociationMotion = (() => {
  let intro;
  let search;
  let finishSearch;
  const departments = ['学习部','技术部','媒体部','办公室部','设计部'];
  const captions = ['翻开新的一页。','让想法，一点点成真。','把相遇，认真记录。','让每一份心意，有处安放。','为新的故事，添上一笔。'];
  const {createTimeline, animate, stagger, svg} = window.anime || {};
  function stopIntro() {
    if (intro) { intro.revert(); intro = null; }
  }
  function welcome(app) {
    if (!createTimeline || app.reducedMotion) { app.finishIntro(); return; }
    stopIntro();
    intro = createTimeline({defaults:{ease:'out(3)'},onComplete:()=>app.finishIntro()})
      .add('.welcome-dialog .intro-buddy',{y:[16,0],opacity:[0,1],duration:750},0)
      .add('.buddy-i',{rotate:[-12,0],duration:950},100)
      .add('.buddy-t',{y:[18,0],rotate:[8,0],duration:850},300)
      .add('.buddy-wave',{rotate:[0,-22,0],duration:900,ease:'inOutSine'},650)
      .add('.welcome-content h2',{opacity:[0,1],y:[10,0],duration:650},600)
      .add('.welcome-caption',{opacity:[0,1],duration:650},1000)
      .add('.welcome-content',{opacity:[1,0],y:[0,-8],duration:350},2700);
  }
  function arrive() {
    if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    animate('.intro > .hello-note, .intro h1, .intro .lookup, .buddy-scene',{
      opacity:[0,1],y:[10,0],delay:stagger(70),duration:600,ease:'out(3)'
    });
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
      search = createTimeline({defaults:{ease:'out(3)'},onComplete:()=>{
        finishSearch = null;
        resolve(true);
      }})
        .add('.search-art',{opacity:[0,1],y:[10,0],duration:400},0)
        .add('.department-token',{y:[10,0],delay:stagger(65),duration:350},0);
      departments.forEach((department,index)=>{
        const at = index * 560 + 160;
        search.call(()=>{app.searchStep=department;app.searchCaption=captions[index];},at)
          .add(document.querySelectorAll('.department-token svg')[index],{y:[0,-6,0],rotate:[0,index%2?6:-6,0],duration:520},at)
          .add('.search-companion',{rotate:[0,-3,0],duration:520},at);
      });
      search
        .add(svg.createDrawable('.search-book-line'),{draw:['0 0','0 1'],duration:500},160)
        .add('.search-brackets',{opacity:[0,1],scale:[1.12,1],duration:500},720)
        .add(svg.createDrawable('.search-frame'),{draw:['0 0','0 1'],duration:500},1280)
        .add('.search-sheets',{rotate:[-3,0],y:[6,0],opacity:[0,1],duration:500},1840)
        .add(svg.createDrawable('.search-underline'),{draw:['0 0','0 1'],duration:520},2400)
        .add('.search-art',{y:[0,-5],duration:260},3030);
    });
  }
  document.addEventListener('visibilitychange',()=>{
    for (const timeline of [intro,search]) {
      if (timeline && !timeline.completed) document.hidden ? timeline.pause() : timeline.resume();
    }
  });
  return {welcome,stopIntro,arrive,lookup,cancelSearch};
})();

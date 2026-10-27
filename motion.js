window.AssociationMotion = (() => {
  const {createTimeline, animate, stagger, svg} = window.anime || {};
  let intro, search, resolveSearch, sourceRect, inputRect, searchRect, searchNameRect;
  function stopIntro() { if(intro){intro.revert();intro=null;} }
  function welcome(app) {
    if(!createTimeline || app.reducedMotion){app.finishIntro();return;}
    const start=document.querySelector('.intro-monogram').getBoundingClientRect();
    const end=document.querySelector('.brand-symbol').getBoundingClientRect();
    intro=createTimeline({defaults:{ease:'out(3)'},onComplete:()=>app.finishIntro()})
      .add(svg.createDrawable('.intro-left, .intro-right'),{draw:['0 0','0 1'],duration:660,delay:stagger(100)},0)
      .add(svg.createDrawable('.intro-i, .intro-t'),{draw:['0 0','0 1'],duration:580,delay:stagger(100)},180)
      .add('.intro-cursor',{opacity:[0,1],x:[-12,0],duration:420},630)
      .add('.intro-code',{clipPath:['inset(0 100% 0 0)','inset(0 0% 0 0)'],opacity:[0,1],duration:600},600)
      .add('.welcome-wordmark h2,.welcome-caption',{y:[7,0],opacity:[0,1],duration:500,delay:stagger(80)},900)
      .add('.intro-code,.welcome-wordmark h2,.welcome-caption,.intro-cursor',{opacity:[1,0],duration:300},1690)
      .add('.intro-monogram',{x:[0,end.x+end.width/2-start.x-start.width/2],y:[0,end.y+end.height/2-start.y-start.height/2],scale:[1,end.width/start.width],duration:680,ease:'inOut(3)'},1710)
      .add('.welcome-skip',{opacity:[1,0],duration:250},2080);
  }
  function arrive() {
    if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    animate('.hero, .query-area, .site-footer',{y:[8,0],opacity:[0,1],duration:480,delay:stagger(60),ease:'out(3)'});
  }
  function prepareSearch(element) {
    sourceRect=element.getBoundingClientRect();
    inputRect=document.querySelector('#member-name').getBoundingClientRect();
    searchRect=null;
  }
  function keyboardReady() {
    const viewport=window.visualViewport;
    if(!viewport||viewport.height>=document.documentElement.clientHeight-100)return Promise.resolve();
    return new Promise(resolve=>{
      const done=()=>{clearTimeout(timer);viewport.removeEventListener('resize',resized);resolve();};
      const resized=()=>{if(viewport.height>=document.documentElement.clientHeight-40)done();};
      const timer=setTimeout(done,450);
      viewport.addEventListener('resize',resized);
    });
  }
  function surface(from,parent) {
    const el=document.createElement('div');
    el.className='transition-surface';el.setAttribute('aria-hidden','true');
    Object.assign(el.style,{position:'fixed',pointerEvents:'none',background:'#fff',border:'1px solid #c9d8cf',borderRadius:'16px',left:from.x+'px',top:from.y+'px',width:from.width+'px',height:from.height+'px',zIndex:0});
    parent.prepend(el);
    return el;
  }
  function sharedName(parent,text,from,to,fromSize,toSize) {
    const el=document.createElement('span');el.textContent=text;
    el.className='transition-name';el.setAttribute('aria-hidden','true');
    Object.assign(el.style,{position:'fixed',pointerEvents:'none',zIndex:2,left:from.x+'px',top:from.y+(from.height-fromSize*1.5)/2+'px',fontFamily:'var(--sans)',fontSize:fromSize+'px',fontWeight:'650',lineHeight:'1.5',letterSpacing:'.025em',color:'#203b35',whiteSpace:'nowrap',maxWidth:Math.min(from.width,to.width)+'px',overflow:'hidden',textOverflow:'ellipsis'});
    parent.append(el);
    return{element:el,values:{left:[from.x,to.x],top:[from.y+(from.height-fromSize*1.5)/2,to.y+(to.height-toSize*1.5)/2],fontSize:[fromSize,toSize],duration:480,ease:'inOut(3)'}};
  }
  function cancelSearch() {
    if(search){search.revert();search=null;}
    document.querySelectorAll('.transition-surface,.transition-name').forEach(el=>el.remove());
    if(resolveSearch){const resolve=resolveSearch;resolveSearch=null;resolve(false);}
  }
  function captureSearch(){searchRect=document.querySelector('.search-console').getBoundingClientRect();searchNameRect=document.querySelector('.search-name').getBoundingClientRect();}
  function lookup(app,member) {
    if(!createTimeline||app.reducedMotion)return Promise.resolve(true);
    cancelSearch();
    const consoleEl=document.querySelector('.search-console');
    const name=document.querySelector('.search-name');
    const target=consoleEl.getBoundingClientRect();
    const nameTarget=name.getBoundingClientRect();
    const ghost=surface(sourceRect,app.$refs.search);
    const movingName=sharedName(ghost,app.name.trim(),inputRect,nameTarget,parseFloat(getComputedStyle(document.querySelector('#member-name')).fontSize),parseFloat(getComputedStyle(name).fontSize));
    const track=document.querySelector('.module-track');
    const travel=track.getBoundingClientRect().width-5;
    const rowHeight=document.querySelector('.running-row').getBoundingClientRect().height;
    const moduleKeys=document.querySelectorAll('.module-key');
    return new Promise(resolve=>{
      resolveSearch=resolve;
      search=createTimeline({defaults:{ease:'out(3)'},onComplete:()=>{resolveSearch=null;resolve(true);}})
        .add(ghost,{left:[sourceRect.x,target.x],top:[sourceRect.y,target.y],width:[sourceRect.width,target.width],height:[sourceRect.height,target.height],duration:480,ease:'inOut(3)'},0)
        .add(movingName.element,movingName.values,0)
        .add(consoleEl,{opacity:[0,1],duration:80},480)
        .call(()=>ghost.remove(),562)
        .add('.search-kicker,.running-code,.module-stage,.search-stage',{opacity:[0,1],duration:260,delay:stagger(45)},480)
        .add('.search-cancel',{opacity:[0,1],duration:240},400)
        .add('.search-progress i',{scaleX:[0,1],duration:2370,ease:'linear'},250)
        .add('.running-line',{clipPath:['inset(0 100% 0 0)','inset(0 0% 0 0)'],duration:520,delay:stagger(540),ease:'steps(24)'},520)
        .add('.code-line-marker',{y:[0,rowHeight],duration:280,ease:'inOut(3)'},980)
        .add('.code-line-marker',{y:[rowHeight,rowHeight*2],duration:280,ease:'inOut(3)'},1520)
        .add('.module-track-fill',{scaleX:[0,1],duration:1520,ease:'inOut(2)'},680)
        .add('.module-packet',{x:[0,travel],duration:1520,ease:'inOut(2)'},680);
      const captions=['学习部 · 把好奇变成收获','技术部 · 让想法真正运行','媒体部 · 记录每一个闪光时刻','办公室部 · 认真连接每个人','设计部 · 为创意找到表达'];
      app.departments.forEach((dept,index)=>{
        const at=620+index*350;
        search.call(()=>{app.searchStep=dept;app.searchCaption=captions[index];},at)
          .add(moduleKeys[index],{y:[0,-4,0],duration:460,ease:'inOut(2)'},at);
      });
      search.add('.module-packet',{opacity:[1,0],duration:200},2280)
        .call(()=>{app.searchCaption=member?member.department+' · 邀请已就绪':'姓名核对完成';if(member)app.searchStep=member.department;},2410)
        .add('.search-progress',{opacity:[1,.4],duration:220},2620);
    });
  }
  function result(reduced) {
    const pass=document.querySelector('.member-pass');
    if(!animate||reduced){pass.style.opacity='1';searchRect=null;return;}
    pass.style.opacity='0';
    const end=pass.getBoundingClientRect();
    if(searchRect){
      const ghost=surface(searchRect,document.querySelector('.success-dialog'));
      const memberName=document.querySelector('.member-name');
      const movingName=sharedName(ghost,memberName.textContent,searchNameRect,memberName.getBoundingClientRect(),parseFloat(getComputedStyle(document.querySelector('.search-name')).fontSize),parseFloat(getComputedStyle(memberName).fontSize));
      animate(movingName.element,{...movingName.values,duration:450});
      animate(ghost,{left:[searchRect.x,end.x],top:[searchRect.y,end.y],width:[searchRect.width,end.width],height:[searchRect.height,end.height],duration:450,ease:'inOut(3)',onComplete:()=>ghost.remove()});
    }
    animate('.member-pass',{opacity:[0,1],duration:1,delay:450});
    animate(svg.createDrawable('.pass-emblem path'),{draw:['0 0','0 1'],duration:720,delay:450,ease:'out(2)'});
    animate('.result-heading,.result-actions,.member-details,.result-footer',{opacity:[0,1],y:[8,0],duration:480,delay:stagger(65,{start:180}),ease:'out(3)'});
    searchRect=null;
  }
  document.addEventListener('visibilitychange',()=>{
    for(const timeline of [intro,search])if(timeline&&!timeline.completed)document.hidden?timeline.pause():timeline.resume();
  });
  return{welcome,stopIntro,arrive,keyboardReady,prepareSearch,lookup,captureSearch,cancelSearch,result};
})();

window.createPassImage = async function ({club,name,department,theme}) {
  await document.fonts.ready;
  const canvas=document.createElement('canvas');
  canvas.width=1600; canvas.height=1000;
  const ctx=canvas.getContext('2d');
  const sans='"Microsoft YaHei","PingFang SC",sans-serif';
  const serif='"Songti SC","SimSun",serif';
  ctx.fillStyle='#f4f1e9';ctx.fillRect(0,0,1600,1000);
  ctx.fillStyle='#fcfaf5';ctx.fillRect(48,48,1504,904);
  ctx.fillStyle=theme.ink;ctx.fillRect(48,48,1504,10);
  ctx.fillStyle='#25251f';ctx.font=`500 34px ${sans}`;ctx.fillText(club,112,143);
  ctx.strokeStyle='#d1cec3';ctx.beginPath();ctx.moveTo(112,188);ctx.lineTo(1488,188);ctx.stroke();
  ctx.fillStyle=theme.ink;
  ctx.fillRect(1410,100,16,60);ctx.fillRect(1436,100,40,16);ctx.fillRect(1448,124,16,36);
  ctx.font=`26px ${sans}`;ctx.fillStyle='#66665c';ctx.fillText('欢迎加入',112,320);
  let size=132;
  ctx.font=`400 ${size}px ${serif}`;
  while(ctx.measureText(name).width>1080 && size>50){size-=4;ctx.font=`400 ${size}px ${serif}`;}
  ctx.fillStyle='#25251f';ctx.fillText(name,112,485);
  ctx.font=`34px ${sans}`;
  const departmentWidth=ctx.measureText(department).width;
  ctx.fillStyle=theme.accent;ctx.fillRect(112,565,departmentWidth+54,64);
  ctx.fillStyle=theme.ink;ctx.fillText(department,139,611);
  ctx.strokeStyle='#d1cec3';ctx.beginPath();ctx.moveTo(112,794);ctx.lineTo(1488,794);ctx.stroke();
  ctx.font=`28px ${sans}`;ctx.fillStyle='#25251f';ctx.fillText('新成员通行证',112,877);
  for(let index=0;index<18;index++)ctx.fillRect(1344+2+index*8,838,4,48);
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('PNG generation failed')),'image/png'));
};

window.createPassImage = async function ({club, name, department, theme}) {
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const sans = '"Microsoft YaHei", "PingFang SC", sans-serif';
  function wrap(text, font, width) {
    ctx.font = font;
    const lines = [];
    let line = '';
    for (const char of text) {
      if (line && ctx.measureText(line + char).width > width) {
        lines.push(line);
        line = '';
      }
      line += char;
    }
    lines.push(line);
    return lines;
  }
  const nameFont = `700 52px ${sans}`;
  const departmentFont = `700 24px ${sans}`;
  const nameLines = wrap(name, nameFont, 490);
  const departmentLines = wrap(department, departmentFont, 510);
  const departmentY = 152 + nameLines.length * 70 + 20;
  const footerY = Math.max(430, departmentY + departmentLines.length * 34 + 40);
  const height = footerY + 120;
  canvas.width = 1600;
  canvas.height = height * 2;
  ctx.scale(2, 2);
  ctx.fillStyle = '#f7f8f2';
  ctx.fillRect(0, 0, 800, height);
  ctx.beginPath();
  ctx.roundRect(24, 24, 752, height - 48, 12);
  ctx.fillStyle = '#fffef8';
  ctx.fill();
  ctx.strokeStyle = '#171b18';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = theme.accent;
  ctx.fillRect(24, footerY, 752, 96);
  ctx.restore();
  ctx.strokeStyle = '#d3d8ca';
  ctx.beginPath();
  ctx.moveTo(24, 108);
  ctx.lineTo(776, 108);
  ctx.stroke();
  ctx.fillStyle = '#171b18';
  ctx.font = `700 22px ${sans}`;
  ctx.fillText(club, 58, 76);
  ctx.textAlign = 'right';
  ctx.fillStyle = theme.ink;
  ctx.font = '20px Consolas, monospace';
  ctx.fillText(theme.code, 742, 76);
  ctx.textAlign = 'left';
  ctx.save();
  ctx.translate(640, 148);
  ctx.scale(.75, .75);
  const emblem = new Path2D(theme.path);
  if (theme.solid) {
    ctx.fillStyle = theme.accent;
    ctx.fill(emblem);
  } else {
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 6;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke(emblem);
  }
  ctx.restore();
  ctx.font = nameFont;
  ctx.fillStyle = '#171b18';
  nameLines.forEach((line, index) => ctx.fillText(line, 58, 204 + index * 70));
  ctx.font = `18px ${sans}`;
  ctx.fillStyle = '#596158';
  ctx.fillText('所属部门', 58, departmentY + 24);
  ctx.font = departmentFont;
  ctx.fillStyle = theme.ink;
  departmentLines.forEach((line, index) => ctx.fillText(line, 202, departmentY + 24 + index * 34));
  ctx.strokeStyle = '#859079';
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(24, footerY);
  ctx.lineTo(776, footerY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#f7f8f2';
  for (const x of [24, 776]) {
    ctx.beginPath();
    ctx.arc(x, footerY, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#171b18';
  ctx.font = `20px ${sans}`;
  ctx.fillText('新成员通行证', 58, footerY + 59);
  ctx.save();
  ctx.translate(634, footerY + 30);
  ctx.scale(1.5, 1.5);
  for (let index = 0; index < 18; index++) ctx.fillRect(1 + index * 4, 0, 2, 24);
  ctx.restore();
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG generation failed')), 'image/png'));
};

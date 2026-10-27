# IT 实训协会 · 入社邀请

当前版本：手机优先的浅色开发工具界面。代码行、语法色、光标与 <IT> 标识；输入工作台连续变形为五部门查询，再承接个人通行证。不使用拟人角色。

正式网站：https://suibian2088.github.io/?v=20261028-p2
上码上传包：it-association-site.zip（12个文件，纯静态，无需安装依赖或构建）。
离线使用：双击“打开页面.cmd”，或用浏览器打开 dist/index.html。

## 数据与流程

正式名单47人：技术部16、学习部9、媒体部8、办公室部9、设计部5。维护 dist/members.js；完整姓名经NFKC规范化和首尾空白清理后精确匹配。
首次开场可跳过，同标签页不重复；不主动弹出手机键盘。五部门查询可取消并保留输入；减少动态效果时直接查询。成功后显示部门和全部同部门伙伴，排除本人。
PNG1600×1000，只含个人通行证，不含伙伴。手机先查看可长按的PNG并提供下载链接；桌面保留一键下载。关闭邀请使未完成的图片任务失效，避免成员切换时文件串名。姓名在本机查询，不上传访客输入。“魏秀秀”保留独立彩蛋；根目录微信验证TXT保持原样。

## 设计与验证

- 当前设计：mobile-dev-20261027/DESIGN.md。上版海报方向已被用户否定，本规范优先。
- 当前源码：dist/；手机重做保留目录：mobile-dev-20261027/site/。
- 当前检查：verify-polish.cjs（25项、含IME保护/保存竞态/手机图片预览/失败重试），verify-mobile-dev.cjs（33项、含快速取消），verify-roster.cjs（198项本地/199项HTTPS），verify-easter-egg.cjs（16项），lookup.test.cjs（2项）。用node直接运行；verify-polish、verify-mobile-dev、verify-roster与verify-easter-egg支持可选网址参数。
- 当前交互证据与独立评审：evidence/polish-20261028/，录屏 capture-final-c/micro-interactions.webm；首轮重做证据仍在 evidence/mobile-dev-20261027/。
- 历史布局的verify-redesign、verify-ui、verify-motion等脚本保留供复现，不作为当前布局的验收。
- GitHub发布目录：D:/新生/github-pages/suibian2088.github.io。
- 本轮前备份：it-association-before-interaction-polish.zip；更早重做前备份仍保留。

浏览器模拟检查320/360/390/430宽度、短屏和横屏。真实手机软键盘、微信内置浏览器及相册保存需目标设备验收，浏览器模拟不能代替真机验证。本机端口绑定受限时可直接打开离线HTML。

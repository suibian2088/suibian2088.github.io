window.findMember = function (name) {
  const normalized = name.normalize('NFKC').trim();
  return window.CLUB.members.find(member => member.name.normalize('NFKC').trim() === normalized);
};
window.clubApp = function () {
  return {
    club: window.CLUB.name,
    themes: window.DEPARTMENTS,
    departments: ['学习部','技术部','媒体部','办公室部','设计部'],
    name: '', error: '', busy: false, opened: false, closing: false,
    introActive: false, searchStep: '', searchCaption: '',
    activeName: '', department: '', peers: [],
    downloaded: false, saving: false, saveError: '', saveRun: 0,
    passImage: '', passFilename: '',
    eggOpened: false, eggStage: '', eggRun: 0,
    get theme() { return this.themes[this.department] || this.themes['技术部']; },
    get reducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; },
    get touchDevice() { return window.matchMedia('(pointer: coarse)').matches; },
    init() {
      let welcomed = false;
      try { welcomed = sessionStorage.getItem('it-devtool-welcome-v3') === 'seen'; } catch {}
      this.introActive = !welcomed && !this.reducedMotion && Boolean(window.anime);
      this.$nextTick(() => {
        if (this.introActive) { this.$refs.welcome.showModal(); this.$refs.introTitle.focus({preventScroll:true}); window.AssociationMotion.welcome(this); }
      });
    },
    finishIntro() {
      if (!this.introActive) return;
      window.AssociationMotion.stopIntro();
      this.introActive = false;
      this.$refs.welcome.close();
      try { sessionStorage.setItem('it-devtool-welcome-v3', 'seen'); } catch {}
      this.$nextTick(() => { window.AssociationMotion.arrive(); });
    },
    showError(message) { this.error = message; this.$refs.name.focus({preventScroll:true}); },
    cancelSearch() {
      window.AssociationMotion.cancelSearch();
      this.$refs.search.close(); this.busy = false;
      this.$refs.name.focus({preventScroll:true});
    },
    async submit() {
      if (this.busy || this.eggOpened || this.introActive) return;
      this.error = '';
      if (!this.name.trim()) { this.showError('先写下你的姓名，再查收邀请。'); return; }
      if (this.name.normalize('NFKC').trim() === '魏秀秀') { await this.playEgg(); return; }
      const member = window.findMember(this.name);
      if (!member) { this.showError('暂未查到，请核对姓名或联系协会负责人。'); return; }
      this.$refs.name.blur();
      this.busy = true;
      await this.$nextTick();
      await window.AssociationMotion.keyboardReady();
      if (!this.reducedMotion && window.anime) {
        this.searchStep = '学习部'; this.searchCaption = '连接每一种好奇心。';
        window.AssociationMotion.prepareSearch(document.querySelector('.lookup'));
        this.$refs.search.showModal(); this.$refs.search.querySelector('button').focus({preventScroll:true});
        if (!await window.AssociationMotion.lookup(this,member)) return;
        window.AssociationMotion.captureSearch();
        this.$refs.search.close(); window.AssociationMotion.cancelSearch();
      }
      this.busy = false;
      this.activeName = member.name; this.department = member.department;
      this.peers = window.CLUB.members.filter(peer => peer.department === member.department && peer.name !== member.name);
      this.clearPassImage(); this.saveError = '';
      await this.$nextTick();
      this.opened = true; this.$refs.invitation.showModal();
      this.$refs.invitation.scrollTop = 0; this.$refs.save.focus({preventScroll:true});
      window.AssociationMotion.result(this.reducedMotion);
    },
    async playEgg() {
      const run = ++this.eggRun;
      this.eggOpened = true;
      this.eggStage = 'invite';
      this.$refs.egg.showModal();
      this.$refs.eggSkip.focus({preventScroll:true});
      for (const [stage, duration] of [['invite', 5400], ['aside', 4200], ['shutdown', 1100]]) {
        this.eggStage = stage;
        await this.$nextTick();
        if (run !== this.eggRun) return;
        const frames = stage === 'shutdown' && !this.reducedMotion
          ? [{transform:'scale(1)',opacity:1,offset:0},{transform:'scale(1,.006)',opacity:1,offset:.65},{transform:'scale(.002,.006)',opacity:1,offset:.88},{transform:'scale(0)',opacity:0,offset:1}]
          : [{opacity:1},{opacity:1}];
        const animation = this.$refs.eggScreen.animate(frames, {
          duration: this.reducedMotion ? (stage === 'shutdown' ? 0 : 3500) : duration,
          easing: stage === 'shutdown' ? 'cubic-bezier(.65,0,.35,1)' : 'linear'
        });
        await animation.finished.catch(() => {});
        if (run !== this.eggRun) return;
      }
      this.eggStage = 'off';
      await this.$nextTick();
      if (run === this.eggRun) this.$refs.eggRestart.focus({preventScroll:true});
    },
    closeEgg() {
      this.$refs.egg.close();
    },
    eggClosed() {
      ++this.eggRun;
      this.$refs.eggScreen.getAnimations({subtree:true}).forEach(animation => animation.cancel());
      this.eggOpened = false;
      this.eggStage = '';
      this.$refs.name.focus({preventScroll:true});
    },
    async closeInvitation() {
      if (this.closing) return;
      this.closing = true;
      this.clearPassImage();
      if (!this.reducedMotion) await this.$refs.content.animate([{opacity:1},{opacity:0}],{duration:180,easing:'ease-in'}).finished;
      this.$refs.invitation.close();
    },
    closed() { this.opened = false; this.closing = false; this.$refs.name.focus({preventScroll:true}); },
    clearPassImage() {
      ++this.saveRun; this.saving = false; this.downloaded = false;
      if (this.passImage) URL.revokeObjectURL(this.passImage);
      this.passImage = ''; this.passFilename = '';
    },
    presentPassImage() {
      if (this.touchDevice) {
        this.$refs.imagePreview.showModal();
        this.$refs.imageClose.focus({preventScroll:true});
      } else {
        const link = document.createElement('a');
        link.href = this.passImage; link.download = this.passFilename; link.click();
        this.downloaded = true;
      }
    },
    closePassImage() { this.$refs.imagePreview.close(); },
    async download() {
      if (this.saving || this.closing) return;
      if (this.passImage) { this.presentPassImage(); return; }
      const run = ++this.saveRun;
      const pass = {club:this.club, name:this.activeName, department:this.department, theme:this.theme};
      this.saving = true;
      this.saveError = '';
      try {
        const blob = await window.createPassImage(pass);
        if (run !== this.saveRun) return;
        this.passImage = URL.createObjectURL(blob);
        this.passFilename = `${pass.club}-${pass.department}-${pass.name}-入社通行证.png`;
        await this.$nextTick();
        await this.$refs.previewImage.decode();
        if (run !== this.saveRun) return;
        this.presentPassImage();
      } catch {
        if (run === this.saveRun) { this.clearPassImage(); this.saveError = '图片未能生成，请重试。'; }
      } finally {
        if (run === this.saveRun) this.saving = false;
      }
    }
  };
};

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
    downloaded: false, saving: false, saveError: '',
    eggOpened: false, eggStage: '', eggRun: 0,
    get theme() { return this.themes[this.department] || this.themes['技术部']; },
    get reducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; },
    init() {
      let welcomed = false;
      try { welcomed = sessionStorage.getItem('it-editorial-welcome') === 'seen'; } catch {}
      this.introActive = !welcomed && !this.reducedMotion && Boolean(window.anime);
      this.$nextTick(() => {
        if (this.introActive) { this.$refs.welcome.showModal(); window.AssociationMotion.welcome(this); }
      });
    },
    finishIntro() {
      if (!this.introActive) return;
      window.AssociationMotion.stopIntro();
      this.introActive = false;
      this.$refs.welcome.close();
      try { sessionStorage.setItem('it-editorial-welcome', 'seen'); } catch {}
      this.$nextTick(() => { this.$refs.name.focus({preventScroll:true}); window.AssociationMotion.arrive(); });
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
      this.busy = true;
      await this.$nextTick();
      if (!this.reducedMotion && window.anime) {
        this.searchStep = '学习部'; this.searchCaption = '从好奇开始。';
        this.$refs.search.showModal(); this.$refs.search.querySelector('button').focus({preventScroll:true});
        if (!await window.AssociationMotion.lookup(this)) return;
        this.$refs.search.close(); window.AssociationMotion.cancelSearch();
      }
      this.busy = false;
      if (!member) { this.showError('暂时没有查到这个名字。请核对报名姓名，或联系协会负责人。'); return; }
      this.activeName = member.name; this.department = member.department;
      this.peers = window.CLUB.members.filter(peer => peer.department === member.department && peer.name !== member.name);
      this.downloaded = false; this.saveError = '';
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
      if (!this.reducedMotion) await this.$refs.content.animate([{opacity:1},{opacity:0}],{duration:180,easing:'ease-in'}).finished;
      this.$refs.invitation.close();
    },
    closed() { this.opened = false; this.closing = false; this.$refs.name.focus({preventScroll:true}); },
    async download() {
      if (this.saving) return;
      this.saving = true;
      this.saveError = '';
      try {
        const blob = await window.createPassImage({club:this.club, name:this.activeName, department:this.department, theme:this.theme});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.club}-${this.department}-${this.activeName}-入社通行证.png`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        this.downloaded = true;
      } catch {
        this.saveError = '图片未能生成，请重试。';
      } finally {
        this.saving = false;
      }
    }
  };
};

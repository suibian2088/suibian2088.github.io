window.findMember = function (name) {
  const normalized = name.normalize('NFKC').trim();
  return window.CLUB.members.find(member => member.name.normalize('NFKC').trim() === normalized);
};

window.clubApp = function () {
  return {
    club: window.CLUB.name,
    name: '',
    error: '',
    focused: false,
    pageHidden: document.hidden,
    busy: false,
    opened: false,
    closing: false,
    activeName: '',
    department: '',
    peers: [],
    downloaded: false,
    saving: false,
    saveError: '',
    get theme() {
      return window.DEPARTMENTS[this.department] || window.DEPARTMENTS['技术部'];
    },
    get reducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    showError(message) {
      this.error = message;
      this.$refs.name.focus();
      if (!this.reducedMotion) {
        this.$refs.inputRow.animate([{transform:'translateX(0)'},{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(-2px)'},{transform:'translateX(0)'}], {duration:260,easing:'ease-out'});
      }
    },
    tiltTicket(event) {
      if (event.pointerType !== 'mouse' || this.reducedMotion || this.busy) return;
      const rect = this.$refs.ticket.getBoundingClientRect();
      const x = Math.max(-.5, Math.min(.5, (event.clientX - rect.left) / rect.width - .5));
      const y = Math.max(-.5, Math.min(.5, (event.clientY - rect.top) / rect.height - .5));
      this.$refs.ticket.style.setProperty('--tilt-x', `${-y * 5}deg`);
      this.$refs.ticket.style.setProperty('--tilt-y', `${x * 9}deg`);
      this.$refs.ticket.style.setProperty('--shadow-x', `${8 - x * 20}px`);
      this.$refs.ticket.style.setProperty('--shadow-y', `${11 - y * 18}px`);
      this.$refs.ticket.style.setProperty('--shadow-blur', `${32 + (Math.abs(x) + Math.abs(y)) * 10}px`);
    },
    resetTilt() {
      this.$refs.ticket.style.removeProperty('--tilt-x');
      this.$refs.ticket.style.removeProperty('--tilt-y');
      this.$refs.ticket.style.removeProperty('--shadow-x');
      this.$refs.ticket.style.removeProperty('--shadow-y');
      this.$refs.ticket.style.removeProperty('--shadow-blur');
    },
    async submit() {
      if (this.busy) return;
      this.error = '';
      if (!this.name.trim()) {
        this.showError('先写下你的姓名，再查收邀请。');
        return;
      }
      const member = window.findMember(this.name);
      if (!member) {
        this.showError('暂时没有查到这个名字。请核对报名姓名，或联系协会负责人。');
        return;
      }
      this.busy = true;
      this.resetTilt();
      this.activeName = member.name;
      this.department = member.department;
      this.peers = window.CLUB.members.filter(peer => peer.department === member.department && peer.name !== member.name);
      this.downloaded = false;
      this.saveError = '';
      await this.$nextTick();
      if (!this.reducedMotion) {
        await this.$refs.progress.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}], {duration:1350,easing:'cubic-bezier(.2,.7,.2,1)',fill:'forwards'}).finished;
      }
      this.busy = false;
      this.opened = true;
      this.$refs.invitation.showModal();
      this.$refs.invitation.scrollTop = 0;
      this.$refs.save.focus({preventScroll:true});
    },
    async closeInvitation() {
      if (this.closing) return;
      this.closing = true;
      if (!this.reducedMotion) {
        await this.$refs.content.animate([{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(10px) scale(.985)'}], {duration:280,easing:'ease-in'}).finished;
      }
      this.$refs.invitation.close();
    },
    closed() {
      this.opened = false;
      this.closing = false;
      this.$refs.name.focus();
    },
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

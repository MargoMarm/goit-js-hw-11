export default class LoadMoreBtn {
  constructor({ selector, isHidden = false }) {
    this.btn = this.getBtnRefs(selector);
    isHidden && this.hide();
  }

  getBtnRefs(selector) {
    return document.querySelector(selector);
  }

  enable() {
    this.btn.disabled = false;
    this.btn.textContent = 'Load more...';
  }

	disabled() {
    this.btn.disabled = true;
    this.btn.textContent = 'Loading...';
  }

  hide() {
    this.btn.classList.add('hidden');
  }

  show() {
    this.btn.classList.remove('hidden');
  }
}

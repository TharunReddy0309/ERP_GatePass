let _logoutHandler: (() => void) | null = null;
let _loginHandler: (() => void) | null = null;

export function setCaretakerLogoutHandler(fn: () => void) {
  _logoutHandler = fn;
}

export function triggerCaretakerLogout() {
  _logoutHandler?.();
}

export function setCaretakerLoginHandler(fn: () => void) {
  _loginHandler = fn;
}

export function triggerCaretakerLogin() {
  _loginHandler?.();
}


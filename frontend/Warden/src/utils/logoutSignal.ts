let _logoutHandler: (() => void) | null = null;
let _loginHandler: (() => void) | null = null;

export function setWardenLogoutHandler(fn: () => void) {
  _logoutHandler = fn;
}

export function triggerWardenLogout() {
  _logoutHandler?.();
}

export function setWardenLoginHandler(fn: () => void) {
  _loginHandler = fn;
}

export function triggerWardenLogin() {
  _loginHandler?.();
}


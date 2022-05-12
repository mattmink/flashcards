export function getAllCookies() {
  return document.cookie.split("; ").reduce((obj, str) => {
    const [key, value] = str.split(/=(.*)/s);
    obj[key] = value;
    return obj;
  }, {});
}

export function getCookie(name) {
  return getAllCookies()[name];
}

export function deleteCookie(name) {
  if (!getCookie(name)) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

export function setCookie(name, value, expHours) {
  if (!name) return;

  if (!value) {
    deleteCookie(name);
    return;
  }

  let expires = "";

  if (expHours) {
    const date = new Date();
    date.setTime(date.getTime() + expHours * 60 * 60 * 1000);
    expires = ` expires=${date.toUTCString()};`;
  }

  document.cookie = `${name}=${value};${expires} path=/`;
}

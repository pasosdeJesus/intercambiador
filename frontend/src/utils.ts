/* Based on
* https://github.com/ton-connect/demo-dapp-with-backend/blob/master/src/utils.ts
*/

export function isMobile(): boolean {
  return window.innerWidth <= 500;
}

export function openLink(href: string, target = '_self') {
  window.open(href, target, 'noreferrer noopener');
}

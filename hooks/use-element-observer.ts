// hooks/useElementObserver.ts

import { useEffect } from 'react';

export function useElementObserver(
  targetClass: string,
  callback: () => void
) {
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let node of mutation.addedNodes) {
            if (node instanceof HTMLElement && node.classList.contains(targetClass)) {
              callback();
              return; // 如果你只想在第一次出现时触发回调，可以在这里返回
            }
          }
        }
      }
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    return () => observer.disconnect();
  }, [targetClass, callback]);
}

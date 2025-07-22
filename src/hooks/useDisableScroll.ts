import { useEffect } from 'react';

export const useDisableScroll = (shouldDisable: boolean = true) => {
  useEffect(() => {
    if (shouldDisable) {
      // Disable scroll on mobile
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';

      return () => {
        // Re-enable scroll when component unmounts
        document.body.style.overflow = originalStyle;
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
      };
    }
  }, [shouldDisable]);
}; 
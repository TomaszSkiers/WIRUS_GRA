import { useEffect } from 'react';
import { useBeforeUnload } from 'react-use';

export function useNavigationWarning(message) {
  useBeforeUnload((event) => {
    event.preventDefault();
    event.returnValue = message; // Tylko w niektórych przeglądarkach działa
  });

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const confirmationMessage = message || 'Czy na pewno chcesz opuścić tę stronę?';
      event.returnValue = confirmationMessage; // Tylko niektóre przeglądarki wyświetlą to
      return confirmationMessage;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [message]);
}


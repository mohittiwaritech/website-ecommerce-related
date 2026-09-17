import React, { useEffect, useState } from 'react';

const DISMISS_KEY = 'bz-pwa-dismissed';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (sessionStorage.getItem(DISMISS_KEY) === '1') return;

    const onPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (!visible || !deferredPrompt) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  const install = async () => {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-80 z-40 bg-white border border-gray-200 shadow-lg p-4 text-sm">
      <p className="font-semibold text-slate-800">Install BillingZone</p>
      <p className="text-gray-600 mt-1 text-[13px] leading-relaxed">
        Add the shop to your home screen for quicker reordering and driver downloads.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={install}
          className="flex-1 bg-[#006699] text-white py-2 font-semibold"
        >
          Install
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="flex-1 border border-gray-300 py-2 font-semibold text-gray-600"
        >
          Not now
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;

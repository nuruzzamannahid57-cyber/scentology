import { useState } from 'react';
import { Facebook, MessageCircle, Send, X } from 'lucide-react';
import { useStore } from '../store/StoreContext';

export function FloatingHelp() {
  const { settings } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="floating-help">
      {open && (
        <div className="floating-menu">
          <a href={settings.whatsapp} target="_blank" rel="noreferrer" className="floating-option whatsapp">
            <Send size={17} /> <span>WhatsApp</span>
          </a>
          <a href={settings.messenger} target="_blank" rel="noreferrer" className="floating-option messenger">
            <MessageCircle size={17} /> <span>Messenger</span>
          </a>
          <a href={settings.facebook} target="_blank" rel="noreferrer" className="floating-option facebook">
            <Facebook size={17} /> <span>Facebook</span>
          </a>
        </div>
      )}
      <button className="floating-trigger" onClick={() => setOpen((v) => !v)} aria-label="Order on WhatsApp or Messenger">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && <span className="floating-pulse" />}
      </button>
    </div>
  );
}

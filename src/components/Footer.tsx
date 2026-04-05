import { Instagram, Facebook } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary dark:bg-slate-950 text-white py-16 islamic-pattern border-t-4 border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 max-w-md">
            <img 
              src="https://i.ibb.co/KjJSFyzK/Airbrush-BG-CHANGER-1775314610814.png" 
              alt="Muhammadan Marriage And Divorce Registrar & Kazi" 
              className="w-full h-auto drop-shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <p className="text-emerald-100/70 max-w-md mb-10 italic font-serif">
            {t('footer.desc')}
          </p>

          <div className="w-full h-[1px] bg-white/10 mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6 text-sm text-emerald-100/50">
            <p>{t('footer.copy')}</p>
            <div className="flex gap-6">
              <a href="https://www.instagram.com/kazi_office_durgapur" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/share/1Z6huK8cgx/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <p>{t('footer.auth')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

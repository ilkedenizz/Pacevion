import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-brand font-heading">Pacevion</span>
          <span className="footer-copyright text-secondary">
            &copy; {currentYear} Pacevion. {t('allRightsReserved')}
          </span>
        </div>
        
        <div className="footer-right">
          <span className="footer-disclaimer text-secondary">
            {t('footerDisclaimer')}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__server-info">
          Server: 192.168.1.21, Database: widemo, Version: 1.8.0.13795, Build for: Default
        </div>
        <div className="footer__copyright">
          Copyright © Polsystem SI 2013 - 2025
        </div>
      </div>
    </footer>
  );
};

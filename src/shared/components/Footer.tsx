import React from 'react';
import styled from '@emotion/styled';

const FooterContainer = styled.footer`
  background: ${props => props.theme.colors.background};
  border-top: 1px solid ${props => props.theme.colors.border || '#e0e0e0'};
  padding: 6px ${props => props.theme.spacing.md};
  margin-top: auto;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 10px;
  line-height: 1.2;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const ServerInfo = styled.div`
  margin-bottom: 2px;
  font-family: 'Roboto', monospace;
`;

const Copyright = styled.div`
  font-weight: 400;
`;

export const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <ServerInfo>
          Server: 192.168.1.21, Database: widemo, Version: 1.8.0.13795, Build for: Default
        </ServerInfo>
        <Copyright>
          Copyright © Polsystem SI 2013 - 2025
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

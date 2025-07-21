import React from 'react';
import styled from '@emotion/styled';

const FooterContainer = styled.div`
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.secondary};
  background: transparent;
  border: none;
  box-shadow: none;
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

const FooterContent = styled.div`
  width: 100%;
  text-align: right;
  padding-right: 20px;
  marigin-bottom: 20px;
`;

const ServerInfo = styled.div`
  margin-bottom: 4px;
  font-family: 'Roboto', monospace;
  line-height: 1.2;
`;

const Copyright = styled.div`
  font-weight: 400;
  line-height: 1.2;
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

import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 2rem;
  margin-top: 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  
  a {
    color: #38bdf8;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  @media (max-width: 768px) {
    gap: 1rem;
    flex-direction: column;
  }
`;

const Copyright = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #94a3b8;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLinks>
          <a href="https://github.com/scagogogo/golang-binary-dependencies-parser" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://github.com/scagogogo/golang-binary-dependencies-parser/issues" target="_blank" rel="noopener noreferrer">Report an Issue</a>
          <a href="https://golang.org" target="_blank" rel="noopener noreferrer">Go Language</a>
          <a href="https://golang.org/pkg/debug/buildinfo" target="_blank" rel="noopener noreferrer">BuildInfo Package</a>
        </FooterLinks>
        <Copyright>
          &copy; {new Date().getFullYear()} GoBinaryParser. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 
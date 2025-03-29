import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';

// Import pages
import HomePage from './pages/HomePage';
import DocumentationPage from './pages/DocumentationPage';
import ExamplesPage from './pages/ExamplesPage';
import InstallationPage from './pages/InstallationPage';

// Styled Components
const NavBar = styled.nav`
  background-color: #0f172a;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  color: #f8fafc;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const LogoIcon = styled.span`
  margin-right: 0.5rem;
  font-size: 1.75rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)`
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: #0ea5e9;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const MainContent = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Footer = styled.footer`
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 2rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #f8fafc;
`;

const FooterLink = styled(Link)`
  display: block;
  color: #cbd5e1;
  text-decoration: none;
  margin-bottom: 0.5rem;
  
  &:hover {
    color: #0ea5e9;
  }
`;

const ExternalLink = styled.a`
  display: block;
  color: #cbd5e1;
  text-decoration: none;
  margin-bottom: 0.5rem;
  
  &:hover {
    color: #0ea5e9;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  color: #94a3b8;
  border-top: 1px solid #334155;
  margin-top: 2rem;
`;

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <NavBar>
          <NavContainer>
            <Logo to="/">
              <LogoIcon>📦</LogoIcon>
              Go Binary Parser
            </Logo>
            <NavLinks>
              <NavLink to="/">首页</NavLink>
              <NavLink to="/documentation">文档</NavLink>
              <NavLink to="/examples">示例</NavLink>
              <NavLink to="/installation">安装</NavLink>
              <ExternalLink href="https://github.com/scagogogo/golang-binary-dependencies-parser" target="_blank" rel="noopener noreferrer" style={{ color: '#e2e8f0' }}>
                GitHub
              </ExternalLink>
            </NavLinks>
          </NavContainer>
        </NavBar>
        
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/documentation" element={<DocumentationPage />} />
            <Route path="/examples" element={<ExamplesPage />} />
            <Route path="/installation" element={<InstallationPage />} />
          </Routes>
        </MainContent>
        
        <Footer>
          <FooterContent>
            <FooterSection>
              <FooterTitle>Go Binary Parser</FooterTitle>
              <p>一个用于解析Go二进制文件依赖的工具，无需源代码即可提取依赖信息。</p>
            </FooterSection>
            
            <FooterSection>
              <FooterTitle>链接</FooterTitle>
              <FooterLink to="/">首页</FooterLink>
              <FooterLink to="/documentation">文档</FooterLink>
              <FooterLink to="/examples">示例</FooterLink>
              <FooterLink to="/installation">安装</FooterLink>
            </FooterSection>
            
            <FooterSection>
              <FooterTitle>资源</FooterTitle>
              <ExternalLink href="https://github.com/scagogogo/golang-binary-dependencies-parser" target="_blank" rel="noopener noreferrer">
                GitHub 仓库
              </ExternalLink>
              <ExternalLink href="https://github.com/scagogogo/golang-binary-dependencies-parser/issues" target="_blank" rel="noopener noreferrer">
                问题反馈
              </ExternalLink>
            </FooterSection>
          </FooterContent>
          
          <Copyright>
            &copy; {new Date().getFullYear()} Go Binary Parser. 保留所有权利。
          </Copyright>
        </Footer>
      </div>
    </Router>
  );
};

export default App; 
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #1e293b;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  
  a {
    color: #38bdf8;
    text-decoration: none;
    display: flex;
    align-items: center;
    
    &:hover {
      color: #0ea5e9;
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const StyledNavLink = styled(NavLink)`
  color: #e2e8f0;
  text-decoration: none;
  padding: 0.5rem 0;
  position: relative;
  font-weight: 500;
  
  &:hover {
    color: #38bdf8;
  }
  
  &.active {
    color: #38bdf8;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #38bdf8;
    }
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Nav>
        <Logo>
          <NavLink to="/">
            <span role="img" aria-label="Package icon" style={{ marginRight: '8px' }}>📦</span>
            GoBinaryParser
          </NavLink>
        </Logo>
        <NavLinks>
          <StyledNavLink to="/">Home</StyledNavLink>
          <StyledNavLink to="/installation">Installation</StyledNavLink>
          <StyledNavLink to="/documentation">Documentation</StyledNavLink>
          <StyledNavLink to="/examples">Examples</StyledNavLink>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 
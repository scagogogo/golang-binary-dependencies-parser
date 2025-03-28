import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FeatureCard from '../components/FeatureCard';
import CodeBlock from '../components/CodeBlock';

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 1rem;
  background-color: #f0f9ff;
  border-radius: 12px;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #0f172a;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #475569;
  max-width: 800px;
  margin: 0 auto 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  background-color: #0ea5e9;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #0284c7;
    text-decoration: none;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: #0ea5e9;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  border: 2px solid #0ea5e9;
  transition: all 0.3s;
  
  &:hover {
    background-color: #f0f9ff;
    text-decoration: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #0f172a;
  text-align: center;
  margin-bottom: 2rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ExampleSection = styled.section`
  margin: 3rem 0;
`;

const sampleCode = `package main

import (
  "fmt"
  "os"
  "path/filepath"

  "github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
  // Parse the binary file
  info, err := gobinaryparser.ParseBinaryFromFile("/usr/local/bin/kubectl")
  if err != nil {
    fmt.Printf("Error: %v\\n", err)
    os.Exit(1)
  }

  // Print basic information
  fmt.Printf("Binary: %s\\n", filepath.Base(info.FilePath))
  fmt.Printf("Module: %s@%s\\n", info.Path, info.Version)
  fmt.Printf("Go Version: %s\\n", info.GoVersion)
  fmt.Printf("Dependencies: %d\\n", len(info.Dependencies))

  // List the first 5 dependencies
  fmt.Println("\\nSome dependencies:")
  for i, dep := range info.Dependencies {
    if i >= 5 {
      break
    }
    fmt.Printf("  - %s@%s\\n", dep.Path, dep.Version)
  }
}`;

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection>
        <Title>GoBinaryParser</Title>
        <Subtitle>
          A powerful library for analyzing dependencies in Go binary files.
          Easily extract and inspect the modules your Go binaries depend on.
        </Subtitle>
        <ButtonContainer>
          <PrimaryButton to="/installation">Get Started</PrimaryButton>
          <SecondaryButton to="/documentation">Documentation</SecondaryButton>
        </ButtonContainer>
      </HeroSection>
      
      <SectionTitle>Key Features</SectionTitle>
      <FeaturesGrid>
        <FeatureCard 
          icon="🔍" 
          title="Binary Analysis" 
          description="Parse any Go binary file to extract its module dependencies, versions, and build information."
        />
        <FeatureCard 
          icon="🔗" 
          title="Dependency Inspection" 
          description="Examine all dependencies, including replaced modules and their versions."
        />
        <FeatureCard 
          icon="📦" 
          title="Standard Library Detection" 
          description="Automatically distinguish between standard library and third-party dependencies."
        />
        <FeatureCard 
          icon="🌐" 
          title="Remote Binary Support" 
          description="Analyze binaries from remote URLs without downloading the entire file."
        />
        <FeatureCard 
          icon="🧰" 
          title="CLI Tool" 
          description="Use the included command-line tool for quick binary analysis without writing code."
        />
        <FeatureCard 
          icon="🚀" 
          title="Fast & Efficient" 
          description="Optimized for performance, with minimal memory footprint even for large binaries."
        />
      </FeaturesGrid>
      
      <ExampleSection>
        <SectionTitle>Quick Example</SectionTitle>
        <CodeBlock 
          language="go" 
          code={sampleCode}
          title="Basic Usage Example"
        />
      </ExampleSection>
    </>
  );
};

export default HomePage; 
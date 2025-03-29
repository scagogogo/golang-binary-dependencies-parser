import React, { useState } from 'react';
import styled from 'styled-components';
import CodeBlock from '../components/CodeBlock';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #4a5568;
  max-width: 800px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const Feature = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  margin: 0 0 0.75rem 0;
  color: #1e293b;
  font-size: 1.25rem;
`;

const FeatureDescription = styled.p`
  margin: 0;
  color: #64748b;
  line-height: 1.6;
`;

const ExampleSection = styled.section`
  margin-bottom: 3rem;
`;

const ExampleHeader = styled.h2`
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
`;

const ExampleButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

interface ExampleButtonProps {
  isActive: boolean;
}

const ExampleButton = styled.button<ExampleButtonProps>`
  background-color: ${props => props.isActive ? '#3b82f6' : 'white'};
  color: ${props => props.isActive ? 'white' : '#4b5563'};
  border: 1px solid ${props => props.isActive ? '#3b82f6' : '#e5e7eb'};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.isActive ? '#2563eb' : '#f9fafb'};
    border-color: ${props => props.isActive ? '#2563eb' : '#d1d5db'};
  }
`;

interface Example {
  code: string;
  title: string;
}

interface Examples {
  [key: string]: Example;
}

const HomePage: React.FC = () => {
  const [activeExampleTab, setActiveExampleTab] = useState<string>('basic');
  
  const examples: Examples = {
    basic: {
      title: 'Basic Usage',
      code: `package main

import (
	"fmt"
	"log"
	
	"github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
	// Parse a binary file
	info, err := gobinaryparser.ParseBinaryFromFile("/usr/local/bin/kubectl")
	if err != nil {
		log.Fatalf("Failed to parse binary: %v", err)
	}
	
	// Print basic information
	fmt.Printf("Binary: %s\\n", info.FilePath)
	fmt.Printf("Main module: %s@%s\\n", info.Path, info.Version)
	fmt.Printf("Go version: %s\\n", info.GoVersion)
	fmt.Printf("Dependencies: %d\\n", len(info.Dependencies))
	
	// Print first 5 dependencies
	for i := 0; i < 5 && i < len(info.Dependencies); i++ {
		dep := info.Dependencies[i]
		fmt.Printf("%d. %s@%s\\n", i+1, dep.Path, dep.Version)
		if dep.Replace != nil {
			fmt.Printf("   (replaced with %s@%s)\\n", 
				dep.Replace.Path, dep.Replace.Version)
		}
	}
}`
    },
    filtering: {
      title: 'Filtering Dependencies',
      code: `// Filter standard library dependencies
stdlibDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
	return gobinaryparser.IsStdLib(dep.Path)
})
fmt.Printf("Standard library dependencies: %d\\n", len(stdlibDeps))

// Filter third-party dependencies
thirdPartyDeps := gobinaryparser.FilterStdLib(info.Dependencies)
fmt.Printf("Third-party dependencies: %d\\n", len(thirdPartyDeps))

// Filter GitHub dependencies
githubDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
	return strings.HasPrefix(dep.Path, "github.com/")
})
fmt.Printf("GitHub dependencies: %d\\n", len(githubDeps))`
    },
    remote: {
      title: 'Remote Binary Analysis',
      code: `// Directly parse a binary from a URL
info, err := gobinaryparser.ParseBinaryFromURL("https://example.com/path/to/binary")
if err != nil {
	log.Fatalf("Failed to parse remote binary: %v", err)
}

// Or with a timeout context
ctx, cancel := context.WithTimeout(context.Background(), 30 * time.Second)
defer cancel()

info, err = gobinaryparser.ParseBinaryFromURLWithContext(ctx, url)
if err != nil {
	log.Fatalf("Failed to parse remote binary: %v", err)
}`
    },
    cli: {
      title: 'CLI Tool Usage',
      code: `# View basic dependency information
godeps /usr/local/bin/kubectl

# Show only standard library dependencies
godeps stdlib /usr/local/bin/kubectl

# Find a specific dependency (exact or partial match)
godeps find cobra /usr/local/bin/kubectl

# Output in JSON format
godeps --json /usr/local/bin/kubectl

# Analyze all Go binaries in a directory
godeps scan /usr/local/bin`
    }
  };
  
  return (
    <PageContainer>
      <Header>
        <Title>GoBinaryParser</Title>
        <Subtitle>
          A powerful Go library and CLI tool for extracting and analyzing dependency information
          from Go binary files without source code.
        </Subtitle>
      </Header>
      
      <FeaturesGrid>
        <Feature>
          <FeatureIcon>🔍</FeatureIcon>
          <FeatureTitle>Binary Analysis</FeatureTitle>
          <FeatureDescription>
            Extract dependency information from any Go binary compiled with Go 1.12+, 
            including module paths, versions, and replacement directives.
          </FeatureDescription>
        </Feature>
        
        <Feature>
          <FeatureIcon>🌐</FeatureIcon>
          <FeatureTitle>Remote Binary Support</FeatureTitle>
          <FeatureDescription>
            Analyze remote binaries directly from URLs without downloading the entire file,
            using HTTP range requests to minimize data transfer.
          </FeatureDescription>
        </Feature>
        
        <Feature>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>Dependency Filtering</FeatureTitle>
          <FeatureDescription>
            Filter dependencies by various criteria like standard library vs third-party,
            specific prefixes, or custom filtering functions.
          </FeatureDescription>
        </Feature>
        
        <Feature>
          <FeatureIcon>🔧</FeatureIcon>
          <FeatureTitle>CLI Tool</FeatureTitle>
          <FeatureDescription>
            Command-line interface for quick dependency analysis, with multiple
            output formats including text and JSON.
          </FeatureDescription>
        </Feature>
        
        <Feature>
          <FeatureIcon>📚</FeatureIcon>
          <FeatureTitle>Library API</FeatureTitle>
          <FeatureDescription>
            Use as a Go library in your own tools and applications with a
            clean, well-documented API.
          </FeatureDescription>
        </Feature>
        
        <Feature>
          <FeatureIcon>🔒</FeatureIcon>
          <FeatureTitle>No Source Required</FeatureTitle>
          <FeatureDescription>
            Analyze closed-source binaries or executables without access to
            the original source code or build environment.
          </FeatureDescription>
        </Feature>
      </FeaturesGrid>
      
      <ExampleSection>
        <ExampleHeader>Code Examples</ExampleHeader>
        <ExampleButtonsContainer>
          <ExampleButton 
            isActive={activeExampleTab === 'basic'} 
            onClick={() => setActiveExampleTab('basic')}
          >
            Basic Usage
          </ExampleButton>
          <ExampleButton 
            isActive={activeExampleTab === 'filtering'} 
            onClick={() => setActiveExampleTab('filtering')}
          >
            Dependency Filtering
          </ExampleButton>
          <ExampleButton 
            isActive={activeExampleTab === 'remote'} 
            onClick={() => setActiveExampleTab('remote')}
          >
            Remote Binary Analysis
          </ExampleButton>
          <ExampleButton 
            isActive={activeExampleTab === 'cli'} 
            onClick={() => setActiveExampleTab('cli')}
          >
            CLI Tool
          </ExampleButton>
        </ExampleButtonsContainer>
        
        <CodeBlock 
          code={examples[activeExampleTab].code} 
          language={activeExampleTab === 'cli' ? 'bash' : 'go'} 
          title={examples[activeExampleTab].title} 
        />
      </ExampleSection>
    </PageContainer>
  );
};

export default HomePage; 
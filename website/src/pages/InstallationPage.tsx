import React from 'react';
import styled from 'styled-components';
import CodeBlock from '../components/CodeBlock';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #0f172a;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: #0f172a;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
`;

const SectionDescription = styled.p`
  margin-bottom: 1.5rem;
  color: #475569;
  line-height: 1.7;
`;

const SubsectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #0f172a;
`;

const libraryInstallCode = `go get github.com/scagogogo/golang-binary-dependencies-parser`;

const cliInstallCode = `go install github.com/scagogogo/golang-binary-dependencies-parser/cmd/godeps@latest`;

const libraryUsageCode = `package main

import (
  "fmt"
  "log"
  
  "github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
  // Parse a binary file
  info, err := gobinaryparser.ParseBinaryFromFile("/usr/local/bin/go")
  if err != nil {
    log.Fatalf("Error parsing binary: %v", err)
  }
  
  // Display basic information
  fmt.Printf("Binary: %s\\n", info.FilePath)
  fmt.Printf("Main module: %s@%s\\n", info.Path, info.Version)
  fmt.Printf("Go version: %s\\n", info.GoVersion)
  fmt.Printf("Dependency count: %d\\n", len(info.Dependencies))
  
  // Filter only non-standard library dependencies
  thirdPartyDeps := gobinaryparser.FilterStdLib(info.Dependencies)
  fmt.Printf("Third-party dependencies: %d\\n", len(thirdPartyDeps))
}`;

const cliUsageCode = `# Basic usage
godeps /usr/local/bin/go

# Filter out standard library dependencies
godeps --nostdlib /usr/local/bin/go

# Show only replaced dependencies
godeps --replaced /usr/local/bin/go

# Output in JSON format
godeps --json /usr/local/bin/go

# Find specific dependencies
godeps find cobra /usr/local/bin/go

# Show only standard library dependencies
godeps stdlib /usr/local/bin/go`;

const InstallationPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Installation</PageTitle>
      
      <Section>
        <SectionTitle>Requirements</SectionTitle>
        <SectionDescription>
          To use GoBinaryParser, you need:
          <ul>
            <li>Go 1.18 or later</li>
            <li>A binary file compiled with Go 1.12 or later (for module information to be available)</li>
          </ul>
        </SectionDescription>
      </Section>
      
      <Section>
        <SectionTitle>Library Installation</SectionTitle>
        <SectionDescription>
          You can install the GoBinaryParser library using the standard Go tools:
        </SectionDescription>
        <CodeBlock 
          language="bash" 
          code={libraryInstallCode} 
          showLineNumbers={false}
        />
        <SubsectionTitle>Basic Usage</SubsectionTitle>
        <SectionDescription>
          Here's a simple example of how to use the library:
        </SectionDescription>
        <CodeBlock 
          language="go" 
          code={libraryUsageCode}
          title="main.go"
        />
      </Section>
      
      <Section>
        <SectionTitle>CLI Tool Installation</SectionTitle>
        <SectionDescription>
          GoBinaryParser also comes with a command-line tool called <code>godeps</code> that allows you to analyze
          Go binaries without writing any code. Install it using:
        </SectionDescription>
        <CodeBlock 
          language="bash" 
          code={cliInstallCode} 
          showLineNumbers={false}
        />
        <SubsectionTitle>CLI Tool Usage</SubsectionTitle>
        <SectionDescription>
          The CLI tool provides various commands and flags for analyzing Go binaries:
        </SectionDescription>
        <CodeBlock 
          language="bash" 
          code={cliUsageCode}
          showLineNumbers={false}
        />
      </Section>
      
      <Section>
        <SectionTitle>Next Steps</SectionTitle>
        <SectionDescription>
          Now that you have installed GoBinaryParser, you can:
          <ul>
            <li>Check out the <a href="/documentation">Documentation</a> for detailed API information</li>
            <li>Explore <a href="/examples">Examples</a> to see more advanced usage patterns</li>
            <li>Visit our <a href="https://github.com/scagogogo/golang-binary-dependencies-parser" target="_blank" rel="noopener noreferrer">GitHub repository</a> to contribute or report issues</li>
          </ul>
        </SectionDescription>
      </Section>
    </PageContainer>
  );
};

export default InstallationPage; 
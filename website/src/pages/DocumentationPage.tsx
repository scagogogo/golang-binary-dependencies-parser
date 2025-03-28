import React, { useState } from 'react';
import styled from 'styled-components';
import CodeBlock from '../components/CodeBlock';

const PageContainer = styled.div`
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  flex-shrink: 0;
  width: 250px;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
  height: calc(100vh - 200px);
  overflow-y: auto;
  
  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    height: auto;
  }
`;

const Content = styled.main`
  flex: 1;
  min-width: 0;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #0f172a;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const NavLink = styled.a<{ active?: boolean }>`
  display: block;
  padding: 0.5rem 1rem;
  color: ${props => props.active ? '#0ea5e9' : '#64748b'};
  text-decoration: none;
  border-radius: 0.25rem;
  font-weight: ${props => props.active ? '500' : 'normal'};
  background-color: ${props => props.active ? '#f0f9ff' : 'transparent'};
  
  &:hover {
    background-color: #f8fafc;
    text-decoration: none;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
  scroll-margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: #0f172a;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
`;

const SubsectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #0f172a;
`;

const SectionContent = styled.div`
  color: #475569;
  line-height: 1.7;
  
  p {
    margin-bottom: 1.5rem;
  }
  
  ul, ol {
    margin-bottom: 1.5rem;
  }
`;

const typesCode = `// DependencyInfo represents a dependency from a Go binary file
type DependencyInfo struct {
    Path    string          \`json:"path"\`              // Import path
    Version string          \`json:"version"\`           // Version string
    Sum     string          \`json:"sum,omitempty"\`     // Checksum
    Replace *DependencyInfo \`json:"replace,omitempty"\` // Replace info if this dependency is replaced
}

// BinaryInfo represents information parsed from a Go binary file
type BinaryInfo struct {
    Path          string            \`json:"path"\`           // Main module path
    Version       string            \`json:"version"\`        // Main module version
    Dependencies  []DependencyInfo  \`json:"dependencies"\`   // List of dependencies
    GoVersion     string            \`json:"go_version"\`     // Go version used for building
    BuildSettings map[string]string \`json:"build_settings"\` // Build settings
    FilePath      string            \`json:"file_path"\`      // Binary file path
    SourceType    string            \`json:"source_type"\`    // Source type (file/url/bytes/reader)
}`;

const parseCode = `// Parse a binary file
info, err := gobinaryparser.ParseBinaryFromFile("/usr/local/bin/go")

// Parse a binary from URL
info, err := gobinaryparser.ParseBinaryFromURL("https://example.com/path/to/binary")

// Parse a binary from byte slice
data, _ := ioutil.ReadFile("/path/to/binary")
info, err := gobinaryparser.ParseBinaryFromBytes(data)

// Parse a binary from io.ReaderAt
file, _ := os.Open("/path/to/binary")
info, err := gobinaryparser.ParseBinaryFromReader(file)`;

const filterCode = `// Filter dependencies with a custom function
gitHubDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
    return strings.HasPrefix(dep.Path, "github.com/")
})

// Check if a path is from the standard library
isStd := gobinaryparser.IsStdLib("fmt")         // true
isStd = gobinaryparser.IsStdLib("github.com/x") // false

// Filter out standard library dependencies
thirdPartyDeps := gobinaryparser.FilterStdLib(info.Dependencies)

// Get a specific dependency by its exact path
dep := info.GetDependencyByPath("github.com/spf13/cobra")`;

const cliCode = `# Basic usage
godeps /usr/local/bin/go

# JSON output
godeps --json /usr/local/bin/go

# Find a specific dependency
godeps find cobra /usr/local/bin/go

# Show only standard library dependencies
godeps stdlib /usr/local/bin/go`;

const ScrollLink: React.FC<{ to: string, children: React.ReactNode, className?: string }> = ({ to, children, className }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(to);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a href={`#${to}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

const DocumentationPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <PageContainer>
      <Sidebar>
        <NavList>
          <NavItem>
            <NavLink as={ScrollLink} to="overview" active={activeSection === 'overview'}>
              Overview
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink as={ScrollLink} to="installation" active={activeSection === 'installation'}>
              Installation
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink as={ScrollLink} to="core-types" active={activeSection === 'core-types'}>
              Core Types
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink as={ScrollLink} to="parsing-functions" active={activeSection === 'parsing-functions'}>
              Parsing Functions
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink as={ScrollLink} to="filtering" active={activeSection === 'filtering'}>
              Filtering Dependencies
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink as={ScrollLink} to="cli-usage" active={activeSection === 'cli-usage'}>
              CLI Tool Usage
            </NavLink>
          </NavItem>
        </NavList>
      </Sidebar>
      
      <Content>
        <PageTitle>Documentation</PageTitle>
        
        <Section id="overview">
          <SectionTitle>Overview</SectionTitle>
          <SectionContent>
            <p>
              GoBinaryParser is a Go library and CLI tool for extracting dependency information from Go binary files.
              It allows you to analyze any Go binary compiled with Go 1.12 or later, which includes module dependency
              information in the binary.
            </p>
            <p>
              The library provides functions for parsing binaries from various sources (files, URLs, byte slices),
              and offers utilities for filtering and analyzing the dependencies.
            </p>
          </SectionContent>
        </Section>
        
        <Section id="installation">
          <SectionTitle>Installation</SectionTitle>
          <SectionContent>
            <p>
              To install the library:
            </p>
            <CodeBlock 
              language="bash" 
              code="go get github.com/scagogogo/golang-binary-dependencies-parser" 
              showLineNumbers={false}
            />
            <p>
              To install the CLI tool:
            </p>
            <CodeBlock 
              language="bash" 
              code="go install github.com/scagogogo/golang-binary-dependencies-parser/cmd/godeps@latest" 
              showLineNumbers={false}
            />
          </SectionContent>
        </Section>
        
        <Section id="core-types">
          <SectionTitle>Core Types</SectionTitle>
          <SectionContent>
            <p>
              The library defines two main types: <code>DependencyInfo</code> and <code>BinaryInfo</code>.
            </p>
            <CodeBlock 
              language="go" 
              code={typesCode}
              title="Core Types"
            />
            <SubsectionTitle>DependencyInfo</SubsectionTitle>
            <p>
              The <code>DependencyInfo</code> type represents a single dependency in a Go binary:
            </p>
            <ul>
              <li><code>Path</code>: The import path of the dependency (e.g., "github.com/spf13/cobra")</li>
              <li><code>Version</code>: The version of the dependency (e.g., "v1.6.1")</li>
              <li><code>Sum</code>: The checksum of the dependency (may be empty)</li>
              <li><code>Replace</code>: Information about what this dependency was replaced with, if any</li>
            </ul>
            
            <SubsectionTitle>BinaryInfo</SubsectionTitle>
            <p>
              The <code>BinaryInfo</code> type contains all the information extracted from a Go binary:
            </p>
            <ul>
              <li><code>Path</code>: The main module path</li>
              <li><code>Version</code>: The main module version</li>
              <li><code>Dependencies</code>: A list of all dependencies</li>
              <li><code>GoVersion</code>: The Go version used to build the binary</li>
              <li><code>BuildSettings</code>: Additional build settings (GOOS, GOARCH, etc.)</li>
              <li><code>FilePath</code>: The path of the binary file (if applicable)</li>
              <li><code>SourceType</code>: The source type ("file", "url", "bytes", or "reader")</li>
            </ul>
          </SectionContent>
        </Section>
        
        <Section id="parsing-functions">
          <SectionTitle>Parsing Functions</SectionTitle>
          <SectionContent>
            <p>
              The library provides several functions for parsing Go binaries from different sources:
            </p>
            <CodeBlock 
              language="go" 
              code={parseCode}
              title="Parsing Functions"
            />
            <p>
              Each function returns a <code>BinaryInfo</code> struct and an error. The <code>BinaryInfo</code> contains
              all the extracted information from the binary, including dependencies, Go version, and build settings.
            </p>
          </SectionContent>
        </Section>
        
        <Section id="filtering">
          <SectionTitle>Filtering Dependencies</SectionTitle>
          <SectionContent>
            <p>
              The library provides functions for filtering and querying dependencies:
            </p>
            <CodeBlock 
              language="go" 
              code={filterCode}
              title="Filtering Dependencies"
            />
            <p>
              These functions allow you to:
            </p>
            <ul>
              <li>Filter dependencies using custom criteria (e.g., all GitHub dependencies)</li>
              <li>Check if a package is from the standard library</li>
              <li>Filter out standard library dependencies</li>
              <li>Look up specific dependencies by their import path</li>
            </ul>
          </SectionContent>
        </Section>
        
        <Section id="cli-usage">
          <SectionTitle>CLI Tool Usage</SectionTitle>
          <SectionContent>
            <p>
              The <code>godeps</code> CLI tool provides a convenient way to analyze Go binaries without writing code:
            </p>
            <CodeBlock 
              language="bash" 
              code={cliCode}
              title="CLI Tool Usage"
            />
            <p>
              The CLI tool has several subcommands and flags:
            </p>
            <ul>
              <li><code>godeps [flags] &lt;binary&gt;</code>: Analyze a binary and display its dependencies</li>
              <li><code>godeps find &lt;name&gt; &lt;binary&gt;</code>: Find dependencies matching a name</li>
              <li><code>godeps stdlib &lt;binary&gt;</code>: Show only standard library dependencies</li>
              <li><code>--json</code>: Output in JSON format</li>
              <li><code>--nostdlib</code>: Filter out standard library dependencies</li>
              <li><code>--replaced</code>: Only show dependencies that have been replaced</li>
              <li><code>--verbose</code>: Show detailed information</li>
            </ul>
          </SectionContent>
        </Section>
      </Content>
    </PageContainer>
  );
};

export default DocumentationPage; 
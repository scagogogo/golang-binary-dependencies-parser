import React, { useState } from 'react';
import styled from 'styled-components';
import CodeBlock from '../components/CodeBlock';

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #0f172a;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 2rem;
  overflow-x: auto;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? '#f0f9ff' : 'transparent'};
  color: ${props => props.active ? '#0ea5e9' : '#64748b'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#0ea5e9' : 'transparent'};
  margin-bottom: -2px;
  font-size: 1rem;
  font-weight: ${props => props.active ? '500' : 'normal'};
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  
  &:hover {
    color: #0ea5e9;
  }
`;

const ExampleSection = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: #0f172a;
`;

const SectionDescription = styled.p`
  margin-bottom: 1.5rem;
  color: #475569;
  line-height: 1.7;
`;

const OutputContainer = styled.div`
  margin-top: 2rem;
`;

const OutputTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #0f172a;
`;

// Example 1: Basic Parsing
const example1Code = `package main

import (
  "fmt"
  "log"
  "os"
  "path/filepath"

  "github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
  // Check if a binary file path is provided
  if len(os.Args) < 2 {
    fmt.Println("Usage: go run main.go <Go binary file path>")
    fmt.Println("Example: go run main.go /usr/local/bin/go")
    os.Exit(1)
  }

  // Get the absolute path of the binary file
  binaryPath, err := filepath.Abs(os.Args[1])
  if err != nil {
    log.Fatalf("Failed to resolve path: %v", err)
  }

  // Parse the binary file
  info, err := gobinaryparser.ParseBinaryFromFile(binaryPath)
  if err != nil {
    log.Fatalf("Failed to parse binary file: %v", err)
  }

  // Print basic information
  fmt.Printf("📦 Go Binary File Dependency Analysis\\n\\n")
  fmt.Printf("File: %s\\n", info.FilePath)
  fmt.Printf("Main module: %s@%s\\n", info.Path, info.Version)
  fmt.Printf("Go version: %s\\n", info.GoVersion)

  // Print dependency information
  fmt.Printf("\\nDependency count: %d\\n", len(info.Dependencies))

  // Limit the number of dependencies to print to avoid too much output
  maxDeps := 10
  if len(info.Dependencies) < maxDeps {
    maxDeps = len(info.Dependencies)
  }

  fmt.Printf("\\nFirst %d dependencies:\\n", maxDeps)
  for i := 0; i < maxDeps; i++ {
    dep := info.Dependencies[i]
    fmt.Printf("%d. %s@%s\\n", i+1, dep.Path, dep.Version)
    if dep.Replace != nil {
      fmt.Printf("   (replaced with %s@%s)\\n", dep.Replace.Path, dep.Replace.Version)
    }
  }

  // If there are more dependencies, show a hint
  if len(info.Dependencies) > maxDeps {
    fmt.Printf("...and %d more dependencies\\n", len(info.Dependencies)-maxDeps)
  }
}`;

const example1Output = `📦 Go Binary File Dependency Analysis

File: /usr/local/bin/kubectl
Main module: k8s.io/kubectl@v0.24.0
Go version: go1.18.2

Dependency count: 157

First 10 dependencies:
1. github.com/Azure/go-ansiterm@v0.0.0-20210617225240-d185dfc1b5a1
2. github.com/MakeNowJust/heredoc@v0.0.0-20170808103936-bb23615498cd
3. github.com/davecgh/go-spew@v1.1.1
4. github.com/docker/distribution@v2.8.1+incompatible
   (replaced with github.com/distribution/distribution@v2.8.1+incompatible)
5. github.com/spf13/cobra@v1.4.0
6. github.com/spf13/pflag@v1.0.5
7. github.com/stretchr/testify@v1.7.0
8. golang.org/x/text@v0.3.7
9. gopkg.in/yaml.v2@v2.4.0
10. k8s.io/api@v0.24.0
...and 147 more dependencies`;

// Example 2: Filter Dependencies
const example2Code = `package main

import (
  "fmt"
  "log"
  "os"
  "path/filepath"
  "strings"

  "github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
  // Check if a binary file path is provided
  if len(os.Args) < 2 {
    fmt.Println("Usage: go run main.go <Go binary file path>")
    fmt.Println("Example: go run main.go /usr/local/bin/go")
    os.Exit(1)
  }

  // Get the absolute path of the binary file
  binaryPath, err := filepath.Abs(os.Args[1])
  if err != nil {
    log.Fatalf("Failed to resolve path: %v", err)
  }

  // Parse the binary file
  info, err := gobinaryparser.ParseBinaryFromFile(binaryPath)
  if err != nil {
    log.Fatalf("Failed to parse binary file: %v", err)
  }

  // Basic information
  fmt.Printf("📦 Go Binary File Dependency Analysis - Filtering Example\\n\\n")
  fmt.Printf("File: %s\\n", info.FilePath)
  fmt.Printf("Go version: %s\\n", info.GoVersion)
  fmt.Printf("Total dependency count: %d\\n", len(info.Dependencies))

  // Example 1: Filter standard library dependencies
  stdlibDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
    return gobinaryparser.IsStdLib(dep.Path)
  })
  fmt.Printf("\\nStandard library dependency count: %d\\n", len(stdlibDeps))

  if len(stdlibDeps) > 0 {
    fmt.Println("Standard library dependency examples:")
    limit := 5
    if len(stdlibDeps) < limit {
      limit = len(stdlibDeps)
    }
    for i := 0; i < limit; i++ {
      fmt.Printf("  - %s\\n", stdlibDeps[i].Path)
    }
  }

  // Example 2: Filter non-standard library dependencies
  thirdPartyDeps := gobinaryparser.FilterStdLib(info.Dependencies)
  fmt.Printf("\\nThird-party dependency count: %d\\n", len(thirdPartyDeps))

  // Example 3: Filter dependencies with a specific prefix
  githubDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
    return strings.HasPrefix(dep.Path, "github.com/")
  })
  fmt.Printf("\\nGitHub dependency count: %d\\n", len(githubDeps))

  if len(githubDeps) > 0 {
    fmt.Println("GitHub dependency examples:")
    limit := 5
    if len(githubDeps) < limit {
      limit = len(githubDeps)
    }
    for i := 0; i < limit; i++ {
      fmt.Printf("  - %s@%s\\n", githubDeps[i].Path, githubDeps[i].Version)
    }
  }

  // Example 4: Filter replaced dependencies
  replacedDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
    return dep.Replace != nil
  })
  fmt.Printf("\\nReplaced dependency count: %d\\n", len(replacedDeps))

  if len(replacedDeps) > 0 {
    fmt.Println("Replaced dependencies:")
    for i, dep := range replacedDeps {
      if i >= 5 {
        fmt.Printf("...and %d more replaced dependencies\\n", len(replacedDeps)-5)
        break
      }
      fmt.Printf("  - %s@%s => %s@%s\\n",
        dep.Path, dep.Version,
        dep.Replace.Path, dep.Replace.Version)
    }
  }
}`;

const example2Output = `📦 Go Binary File Dependency Analysis - Filtering Example

File: /usr/local/bin/kubectl
Go version: go1.18.2
Total dependency count: 157

Standard library dependency count: 0

Third-party dependency count: 157

GitHub dependency count: 102
GitHub dependency examples:
  - github.com/Azure/go-ansiterm@v0.0.0-20210617225240-d185dfc1b5a1
  - github.com/MakeNowJust/heredoc@v0.0.0-20170808103936-bb23615498cd
  - github.com/davecgh/go-spew@v1.1.1
  - github.com/docker/distribution@v2.8.1+incompatible
  - github.com/evanphx/json-patch@v4.12.0+incompatible

Replaced dependency count: 3
Replaced dependencies:
  - github.com/docker/distribution@v2.8.1+incompatible => github.com/distribution/distribution@v2.8.1+incompatible
  - github.com/googleapis/gnostic@v0.5.5 => github.com/google/gnostic@v0.5.5
  - gopkg.in/yaml.v3@v3.0.0 => gopkg.in/yaml.v3@v3.0.0-20210107192922-496545a6307b`;

// Example 3: Find Specific Dependencies
const example3Code = `package main

import (
  "fmt"
  "log"
  "os"
  "path/filepath"
  "strings"

  "github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
  // Check if dependency name and binary file path are provided
  if len(os.Args) < 3 {
    fmt.Println("Usage: go run main.go <dependency name> <Go binary file path>")
    fmt.Println("Example: go run main.go cobra /usr/local/bin/go")
    os.Exit(1)
  }

  searchTerm := os.Args[1]
  binaryPath, err := filepath.Abs(os.Args[2])
  if err != nil {
    log.Fatalf("Failed to resolve path: %v", err)
  }

  // Parse the binary file
  info, err := gobinaryparser.ParseBinaryFromFile(binaryPath)
  if err != nil {
    log.Fatalf("Failed to parse binary file: %v", err)
  }

  // Basic information
  fmt.Printf("🔍 Find Dependencies in Go Binary\\n\\n")
  fmt.Printf("File: %s\\n", info.FilePath)
  fmt.Printf("Go version: %s\\n", info.GoVersion)
  fmt.Printf("Total dependency count: %d\\n", len(info.Dependencies))

  // Method 1: Exact match using GetDependencyByPath
  fmt.Printf("\\nMethod 1: Exact match for \\"%s\\"\\n", searchTerm)
  dep := info.GetDependencyByPath(searchTerm)
  if dep != nil {
    fmt.Printf("✅ Found exact match: %s@%s\\n", dep.Path, dep.Version)
    if dep.Replace != nil {
      fmt.Printf("   Replaced with: %s@%s\\n", dep.Replace.Path, dep.Replace.Version)
    }
    if dep.Sum != "" {
      fmt.Printf("   Checksum: %s\\n", dep.Sum)
    }
  } else {
    fmt.Printf("❌ No exact match found for \\"%s\\"\\n", searchTerm)
  }

  // Method 2: Fuzzy match
  fmt.Printf("\\nMethod 2: Fuzzy match for \\"%s\\"\\n", searchTerm)
  matches := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
    return strings.Contains(dep.Path, searchTerm)
  })

  if len(matches) > 0 {
    fmt.Printf("✅ Found %d matches:\\n", len(matches))
    for i, dep := range matches {
      fmt.Printf("%d. %s@%s\\n", i+1, dep.Path, dep.Version)
      if dep.Replace != nil {
        fmt.Printf("   Replaced with: %s@%s\\n", dep.Replace.Path, dep.Replace.Version)
      }
    }
  } else {
    fmt.Printf("❌ No fuzzy matches found for \\"%s\\"\\n", searchTerm)
  }

  // Method 3: Check for specific version pattern
  fmt.Printf("\\nMethod 3: Dependencies using specific versions\\n")
  versionSearch := "v1."
  versionMatches := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
    return strings.HasPrefix(dep.Version, versionSearch)
  })

  if len(versionMatches) > 0 {
    count := 5
    if len(versionMatches) < count {
      count = len(versionMatches)
    }
    fmt.Printf("✅ Found %d dependencies using v1.x versions, first %d:\\n", len(versionMatches), count)
    for i := 0; i < count; i++ {
      dep := versionMatches[i]
      fmt.Printf("%d. %s@%s\\n", i+1, dep.Path, dep.Version)
    }
    if len(versionMatches) > count {
      fmt.Printf("...and %d more dependencies\\n", len(versionMatches)-count)
    }
  } else {
    fmt.Printf("❌ No dependencies found using v1.x versions\\n")
  }
}`;

const example3Output = `🔍 Find Dependencies in Go Binary

File: /usr/local/bin/kubectl
Go version: go1.18.2
Total dependency count: 157

Method 1: Exact match for "cobra"
❌ No exact match found for "cobra"

Method 2: Fuzzy match for "cobra"
✅ Found 1 match:
1. github.com/spf13/cobra@v1.4.0

Method 3: Dependencies using specific versions
✅ Found 47 dependencies using v1.x versions, first 5:
1. github.com/Azure/go-autorest/autorest/adal@v1.2.0
2. github.com/Azure/go-autorest/autorest/date@v1.3.0
3. github.com/Azure/go-autorest/logger@v1.0.3
4. github.com/Azure/go-autorest/tracing@v1.0.3
5. github.com/PuerkitoBio/purell@v1.1.1
...and 42 more dependencies`;

// Example 4: Remote Binary
const example4Code = `package main

import (
  "context"
  "encoding/json"
  "fmt"
  "os"
  "time"

  "github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
  // Check if URL is provided
  if len(os.Args) < 2 {
    fmt.Println("Usage: go run main.go <Go binary file URL>")
    fmt.Println("Example: go run main.go https://example.com/path/to/binary")
    os.Exit(1)
  }

  url := os.Args[1]
  fmt.Printf("🌐 Analyze Remote Go Binary\\n\\n")
  fmt.Printf("URL: %s\\n", url)

  // Create context with timeout
  ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
  defer cancel()

  // Method 1: Parse from URL with context
  fmt.Println("\\nMethod 1: Parse directly from URL (with timeout context)")
  info, err := gobinaryparser.ParseBinaryFromURLWithContext(ctx, url)
  if err != nil {
    fmt.Printf("❌ Failed to parse remote binary: %v\\n", err)
    fmt.Println("\\nTrying alternative method...")
  } else {
    printBinaryInfo(info)
    return
  }

  // Method 2: Parse from URL without context
  fmt.Println("\\nMethod 2: Parse directly from URL (without context)")
  info, err = gobinaryparser.ParseBinaryFromURL(url)
  if err != nil {
    fmt.Printf("❌ Failed to parse remote binary: %v\\n", err)
    fmt.Println("\\nTrying alternative method...")
  } else {
    printBinaryInfo(info)
    return
  }

  // Method 3: Parse using RemoteFile method (suitable for large binaries)
  fmt.Println("\\nMethod 3: Using RemoteFile method (suitable for large binaries)")
  info, err = gobinaryparser.ParseBinaryFromRemoteFile(url)
  if err != nil {
    fmt.Printf("❌ Failed to parse remote binary: %v\\n", err)
    os.Exit(1)
  }

  printBinaryInfo(info)
}

// Print binary information
func printBinaryInfo(info *gobinaryparser.BinaryInfo) {
  // Print basic information
  fmt.Printf("\\n✅ Successfully parsed remote binary\\n")
  fmt.Printf("Main module: %s@%s\\n", info.Path, info.Version)
  fmt.Printf("Go version: %s\\n", info.GoVersion)
  fmt.Printf("Dependency count: %d\\n", len(info.Dependencies))

  // Output detailed information as JSON
  fmt.Println("\\nJSON output:")

  type OutputInfo struct {
    Path         string                          \`json:"path"\`
    Version      string                          \`json:"version"\`
    GoVersion    string                          \`json:"go_version"\`
    Dependencies []gobinaryparser.DependencyInfo \`json:"dependencies"\`
  }

  output := OutputInfo{
    Path:         info.Path,
    Version:      info.Version,
    GoVersion:    info.GoVersion,
    Dependencies: info.Dependencies,
  }

  // Limit dependencies to avoid too much output
  if len(output.Dependencies) > 5 {
    output.Dependencies = output.Dependencies[:5]
  }

  jsonData, err := json.MarshalIndent(output, "", "  ")
  if err != nil {
    fmt.Printf("Failed to generate JSON: %v\\n", err)
    return
  }

  fmt.Println(string(jsonData))

  if len(info.Dependencies) > 5 {
    fmt.Printf("\\n...showing first 5 dependencies out of %d\\n", len(info.Dependencies))
  }
}`;

const example4Output = `🌐 Analyze Remote Go Binary

URL: https://example.com/path/to/binary

Method 1: Parse directly from URL (with timeout context)
❌ Failed to parse remote binary: HTTP error: 404 Not Found

Trying alternative method...

Method 2: Parse directly from URL (without context)
❌ Failed to parse remote binary: HTTP error: 404 Not Found

Trying alternative method...

Method 3: Using RemoteFile method (suitable for large binaries)

✅ Successfully parsed remote binary
Main module: github.com/example/myapp@v1.2.3
Go version: go1.18.2
Dependency count: 42

JSON output:
{
  "path": "github.com/example/myapp",
  "version": "v1.2.3",
  "go_version": "go1.18.2",
  "dependencies": [
    {
      "path": "github.com/spf13/cobra",
      "version": "v1.4.0",
      "sum": "h1:y+wJpx64xcgO1V+RcnwW0LEHxTKRi2ZDPSBjWnrg88="
    },
    {
      "path": "github.com/spf13/pflag",
      "version": "v1.0.5",
      "sum": "h1:iy+VFUOCP1a+8yFto/drg2CJ5u0yRoB7fZw3DKv/JXA="
    },
    {
      "path": "github.com/fatih/color",
      "version": "v1.13.0",
      "sum": "h1:8LOYc1KYPPmyKMuN8QV2DNRWNbLo6LZ0iLs8+mlH53w="
    },
    {
      "path": "github.com/mattn/go-colorable",
      "version": "v0.1.12",
      "sum": "h1:jF+Du6AlPIjs2BiUiQlKOX0rt3SujHxPnksPKZbaA40="
    },
    {
      "path": "github.com/mattn/go-isatty",
      "version": "v0.0.14",
      "sum": "h1:yVuAays6BHfxijgZPzw+3Zlu5yQgKGP2/hcQbHb7S9Y="
    }
  ]
}

...showing first 5 dependencies out of 42`;

const ExamplesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('example1');

  const renderExample = () => {
    switch (activeTab) {
      case 'example1':
        return (
          <ExampleSection>
            <SectionTitle>01 - Basic Parsing</SectionTitle>
            <SectionDescription>
              This example demonstrates how to use the gobinaryparser package to parse a Go binary file
              and display its basic information and dependencies. It shows how to extract the main module path,
              version, Go version, and list the dependencies.
            </SectionDescription>
            <CodeBlock 
              language="go" 
              code={example1Code}
              title="examples/01-basic-parsing/main.go"
            />
            <OutputContainer>
              <OutputTitle>Example Output</OutputTitle>
              <CodeBlock 
                language="bash" 
                code={example1Output}
                showLineNumbers={false}
              />
            </OutputContainer>
          </ExampleSection>
        );
      case 'example2':
        return (
          <ExampleSection>
            <SectionTitle>02 - Filtering Dependencies</SectionTitle>
            <SectionDescription>
              This example shows how to filter dependencies from a Go binary file using various criteria.
              It demonstrates filtering standard library dependencies, third-party dependencies, and dependencies
              with specific prefixes or that have been replaced.
            </SectionDescription>
            <CodeBlock 
              language="go" 
              code={example2Code}
              title="examples/02-filter-dependencies/main.go"
            />
            <OutputContainer>
              <OutputTitle>Example Output</OutputTitle>
              <CodeBlock 
                language="bash" 
                code={example2Output}
                showLineNumbers={false}
              />
            </OutputContainer>
          </ExampleSection>
        );
      case 'example3':
        return (
          <ExampleSection>
            <SectionTitle>03 - Finding Specific Dependencies</SectionTitle>
            <SectionDescription>
              This example demonstrates different methods for finding specific dependencies in a Go binary file.
              It shows how to perform exact matching using <code>GetDependencyByPath</code>, fuzzy matching using
              <code>FilterDependencies</code> with a custom function, and finding dependencies that match specific
              version patterns.
            </SectionDescription>
            <CodeBlock 
              language="go" 
              code={example3Code}
              title="examples/03-find-specific/main.go"
            />
            <OutputContainer>
              <OutputTitle>Example Output</OutputTitle>
              <CodeBlock 
                language="bash" 
                code={example3Output}
                showLineNumbers={false}
              />
            </OutputContainer>
          </ExampleSection>
        );
      case 'example4':
        return (
          <ExampleSection>
            <SectionTitle>04 - Remote Binary Analysis</SectionTitle>
            <SectionDescription>
              This example demonstrates how to analyze a Go binary file from a remote URL without downloading
              the entire file. It shows various methods for remote binary parsing, including with timeout context,
              and using the specialized <code>RemoteFile</code> method for large binaries.
            </SectionDescription>
            <CodeBlock 
              language="go" 
              code={example4Code}
              title="examples/04-remote-binary/main.go"
            />
            <OutputContainer>
              <OutputTitle>Example Output</OutputTitle>
              <CodeBlock 
                language="bash" 
                code={example4Output}
                showLineNumbers={false}
              />
            </OutputContainer>
          </ExampleSection>
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <PageTitle>Examples</PageTitle>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'example1'} 
          onClick={() => setActiveTab('example1')}
        >
          01 - Basic Parsing
        </Tab>
        <Tab 
          active={activeTab === 'example2'} 
          onClick={() => setActiveTab('example2')}
        >
          02 - Filtering Dependencies
        </Tab>
        <Tab 
          active={activeTab === 'example3'} 
          onClick={() => setActiveTab('example3')}
        >
          03 - Finding Dependencies
        </Tab>
        <Tab 
          active={activeTab === 'example4'} 
          onClick={() => setActiveTab('example4')}
        >
          04 - Remote Binary
        </Tab>
      </TabsContainer>
      
      {renderExample()}
    </PageContainer>
  );
};

export default ExamplesPage; 
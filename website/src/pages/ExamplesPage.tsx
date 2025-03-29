import React, { useState } from 'react';
import styled from 'styled-components';
import CodeBlock from '../components/CodeBlock';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #0f172a;
`;

const Text = styled.p`
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #334155;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 2rem;
  overflow-x: auto;
`;

interface TabProps {
  active: boolean;
}

const Tab = styled.button<TabProps>`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#0ea5e9' : 'transparent'};
  color: ${props => props.active ? '#0ea5e9' : '#64748b'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover {
    color: #0ea5e9;
    background-color: #f1f5f9;
  }
`;

const ExampleContainer = styled.div`
  margin-bottom: 2rem;
`;

const OutputTitle = styled.h3`
  font-size: 1.2rem;
  margin: 1.5rem 0 1rem;
  color: #0f172a;
`;

const OutputBox = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  font-family: monospace;
  white-space: pre-wrap;
  overflow-x: auto;
  margin-bottom: 2rem;
`;

interface Example {
  code: string;
  description: string;
  output: string;
}

interface Examples {
  [key: string]: Example;
}

const ExamplesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  
  // 基本解析示例代码
  const basicCode = `package main

import (
  "fmt"
  "log"
  "os"
  "path/filepath"
  
  "github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
  // 检查是否提供了二进制文件路径
  if len(os.Args) < 2 {
    fmt.Println("用法: go run main.go <Go二进制文件路径>")
    fmt.Println("例如: go run main.go /usr/local/bin/go")
    os.Exit(1)
  }

  // 获取二进制文件的绝对路径
  binaryPath, err := filepath.Abs(os.Args[1])
  if err != nil {
    log.Fatalf("无法解析路径: %v", err)
  }

  // 解析二进制文件
  info, err := gobinaryparser.ParseBinaryFromFile(binaryPath)
  if err != nil {
    log.Fatalf("解析二进制文件失败: %v", err)
  }

  // 打印基本信息
  fmt.Printf("📦 Go 二进制文件依赖分析\\n\\n")
  fmt.Printf("文件: %s\\n", info.FilePath)
  fmt.Printf("主模块: %s@%s\\n", info.Path, info.Version)
  fmt.Printf("Go版本: %s\\n", info.GoVersion)

  // 打印依赖信息
  fmt.Printf("\\n依赖数量: %d\\n", len(info.Dependencies))

  // 限制打印的依赖数量，避免输出过多
  maxDeps := 10
  if len(info.Dependencies) < maxDeps {
    maxDeps = len(info.Dependencies)
  }

  fmt.Printf("\\n前%d个依赖:\\n", maxDeps)
  for i := 0; i < maxDeps; i++ {
    dep := info.Dependencies[i]
    fmt.Printf("%d. %s@%s\\n", i+1, dep.Path, dep.Version)
    if dep.Replace != nil {
      fmt.Printf("   (被替换为 %s@%s)\\n", dep.Replace.Path, dep.Replace.Version)
    }
  }

  // 如果有更多依赖，显示提示信息
  if len(info.Dependencies) > maxDeps {
    fmt.Printf("...和 %d 个其他依赖\\n", len(info.Dependencies)-maxDeps)
  }
}`;

  // 过滤依赖示例代码
  const filterCode = `package main

import (
  "fmt"
  "log"
  "os"
  "path/filepath"
  "strings"

  "github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
  // 检查是否提供了二进制文件路径
  if len(os.Args) < 2 {
    fmt.Println("用法: go run main.go <Go二进制文件路径>")
    fmt.Println("例如: go run main.go /usr/local/bin/go")
    os.Exit(1)
  }

  // 获取二进制文件的绝对路径
  binaryPath, err := filepath.Abs(os.Args[1])
  if err != nil {
    log.Fatalf("无法解析路径: %v", err)
  }

  // 解析二进制文件
  info, err := gobinaryparser.ParseBinaryFromFile(binaryPath)
  if err != nil {
    log.Fatalf("解析二进制文件失败: %v", err)
  }

  // 基本信息
  fmt.Printf("📦 Go 二进制文件依赖分析 - 过滤示例\\n\\n")
  fmt.Printf("文件: %s\\n", info.FilePath)
  fmt.Printf("Go版本: %s\\n", info.GoVersion)
  fmt.Printf("总依赖数量: %d\\n", len(info.Dependencies))

  // 示例1: 过滤标准库依赖
  stdlibDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
    return gobinaryparser.IsStdLib(dep.Path)
  })
  fmt.Printf("\\n标准库依赖数量: %d\\n", len(stdlibDeps))

  if len(stdlibDeps) > 0 {
    fmt.Println("标准库依赖示例:")
    limit := 5
    if len(stdlibDeps) < limit {
      limit = len(stdlibDeps)
    }
    for i := 0; i < limit; i++ {
      fmt.Printf("  - %s\\n", stdlibDeps[i].Path)
    }
  }

  // 示例2: 过滤第三方依赖
  thirdPartyDeps := gobinaryparser.FilterStdLib(info.Dependencies)
  fmt.Printf("\\n第三方依赖数量: %d\\n", len(thirdPartyDeps))

  // 示例3: 过滤包含特定前缀的依赖
  githubDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
    return strings.HasPrefix(dep.Path, "github.com/")
  })
  fmt.Printf("\\nGitHub依赖数量: %d\\n", len(githubDeps))

  if len(githubDeps) > 0 {
    fmt.Println("GitHub依赖示例:")
    limit := 5
    if len(githubDeps) < limit {
      limit = len(githubDeps)
    }
    for i := 0; i < limit; i++ {
      fmt.Printf("  - %s@%s\\n", githubDeps[i].Path, githubDeps[i].Version)
    }
  }

  // 示例4: 过滤被替换的依赖
  replacedDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
    return dep.Replace != nil
  })
  fmt.Printf("\\n被替换的依赖数量: %d\\n", len(replacedDeps))

  if len(replacedDeps) > 0 {
    fmt.Println("被替换的依赖:")
    for i, dep := range replacedDeps {
      if i >= 5 {
        fmt.Printf("...以及其他 %d 个被替换的依赖\\n", len(replacedDeps)-5)
        break
      }
      fmt.Printf("  - %s@%s => %s@%s\\n",
        dep.Path, dep.Version,
        dep.Replace.Path, dep.Replace.Version)
    }
  }
}`;

  // 查找特定依赖示例代码
  const findCode = `package main

import (
  "fmt"
  "log"
  "os"
  "path/filepath"
  "strings"

  "github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
  // 检查是否提供了二进制文件路径
  if len(os.Args) < 3 {
    fmt.Println("用法: go run main.go <依赖名称> <Go二进制文件路径>")
    fmt.Println("例如: go run main.go cobra /usr/local/bin/go")
    os.Exit(1)
  }

  searchTerm := os.Args[1]
  binaryPath, err := filepath.Abs(os.Args[2])
  if err != nil {
    log.Fatalf("无法解析路径: %v", err)
  }

  // 解析二进制文件
  info, err := gobinaryparser.ParseBinaryFromFile(binaryPath)
  if err != nil {
    log.Fatalf("解析二进制文件失败: %v", err)
  }

  // 基本信息
  fmt.Printf("🔍 在二进制文件中查找依赖\\n\\n")
  fmt.Printf("文件: %s\\n", info.FilePath)
  fmt.Printf("Go版本: %s\\n", info.GoVersion)
  fmt.Printf("总依赖数量: %d\\n", len(info.Dependencies))

  // 方法1: 使用精确匹配 - GetDependencyByPath
  fmt.Printf("\\n方法1: 精确匹配 \\"%s\\"\\n", searchTerm)
  dep := info.GetDependencyByPath(searchTerm)
  if dep != nil {
    fmt.Printf("✅ 找到完全匹配的依赖: %s@%s\\n", dep.Path, dep.Version)
    if dep.Replace != nil {
      fmt.Printf("   被替换为: %s@%s\\n", dep.Replace.Path, dep.Replace.Version)
    }
    if dep.Sum != "" {
      fmt.Printf("   校验和: %s\\n", dep.Sum)
    }
  } else {
    fmt.Printf("❌ 没有找到完全匹配 \\"%s\\" 的依赖\\n", searchTerm)
  }

  // 方法2: 使用模糊匹配
  fmt.Printf("\\n方法2: 模糊匹配包含 \\"%s\\" 的依赖\\n", searchTerm)
  matches := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
    return strings.Contains(dep.Path, searchTerm)
  })

  if len(matches) > 0 {
    fmt.Printf("✅ 找到 %d 个匹配的依赖:\\n", len(matches))
    for i, dep := range matches {
      fmt.Printf("%d. %s@%s\\n", i+1, dep.Path, dep.Version)
      if dep.Replace != nil {
        fmt.Printf("   被替换为: %s@%s\\n", dep.Replace.Path, dep.Replace.Version)
      }
    }
  } else {
    fmt.Printf("❌ 没有找到包含 \\"%s\\" 的依赖\\n", searchTerm)
  }
}`;

  // 远程解析示例代码
  const remoteCode = `package main

import (
  "context"
  "encoding/json"
  "fmt"
  "os"
  "time"

  "github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
  // 检查是否提供了URL
  if len(os.Args) < 2 {
    fmt.Println("用法: go run main.go <Go二进制文件URL>")
    fmt.Println("例如: go run main.go https://example.com/path/to/binary")
    os.Exit(1)
  }

  url := os.Args[1]
  fmt.Printf("🌐 解析远程Go二进制文件\\n\\n")
  fmt.Printf("URL: %s\\n", url)

  // 创建带有超时的上下文
  ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
  defer cancel()

  // 使用URL直接解析（带上下文）
  fmt.Println("\\n尝试解析远程二进制文件...")
  info, err := gobinaryparser.ParseBinaryFromURLWithContext(ctx, url)
  if err != nil {
    fmt.Printf("❌ 无法解析远程二进制文件: %v\\n", err)
    os.Exit(1)
  }

  // 打印基本信息
  fmt.Printf("\\n✅ 成功解析远程二进制文件\\n")
  fmt.Printf("主模块: %s@%s\\n", info.Path, info.Version)
  fmt.Printf("Go版本: %s\\n", info.GoVersion)
  fmt.Printf("依赖数量: %d\\n", len(info.Dependencies))

  // 以JSON格式输出部分依赖信息
  fmt.Println("\\nJSON输出示例 (前5个依赖):")

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

  // 限制依赖数量，避免输出过多
  if len(output.Dependencies) > 5 {
    output.Dependencies = output.Dependencies[:5]
  }

  jsonData, _ := json.MarshalIndent(output, "", "  ")
  fmt.Println(string(jsonData))

  if len(info.Dependencies) > 5 {
    fmt.Printf("\\n...显示了前5个依赖，共有%d个\\n", len(info.Dependencies))
  }
}`;

  // 示例输出
  const examples: Examples = {
    basic: {
      code: basicCode,
      description: '此示例展示了如何解析本地Go二进制文件并提取其基本依赖信息。它展示了如何获取主模块信息、Go版本以及依赖列表。',
      output: `📦 Go 二进制文件依赖分析

文件: /usr/local/bin/kubectl
主模块: k8s.io/kubectl@v0.24.0
Go版本: go1.18.2

依赖数量: 157

前10个依赖:
1. github.com/Azure/go-ansiterm@v0.0.0-20210617225240-d185dfc1b5a1
2. github.com/MakeNowJust/heredoc@v0.0.0-20170808103936-bb23615498cd
3. github.com/davecgh/go-spew@v1.1.1
4. github.com/docker/distribution@v2.8.1+incompatible
   (被替换为 github.com/distribution/distribution@v2.8.1+incompatible)
5. github.com/spf13/cobra@v1.4.0
6. github.com/spf13/pflag@v1.0.5
7. github.com/stretchr/testify@v1.7.0
8. golang.org/x/text@v0.3.7
9. gopkg.in/check.v1@v1.0.0-20200227125254-8fa46927fb4f
10. k8s.io/klog/v2@v2.60.1
...和 147 个其他依赖`
    },
    filter: {
      code: filterCode,
      description: '此示例展示了如何过滤依赖，包括筛选标准库依赖、第三方依赖、特定前缀的依赖（如 GitHub 依赖）以及被替换的依赖。',
      output: `📦 Go 二进制文件依赖分析 - 过滤示例

文件: /usr/local/bin/kubectl
Go版本: go1.18.2
总依赖数量: 157

标准库依赖数量: 0

第三方依赖数量: 157

GitHub依赖数量: 102
GitHub依赖示例:
  - github.com/Azure/go-ansiterm@v0.0.0-20210617225240-d185dfc1b5a1
  - github.com/MakeNowJust/heredoc@v0.0.0-20170808103936-bb23615498cd
  - github.com/davecgh/go-spew@v1.1.1
  - github.com/docker/distribution@v2.8.1+incompatible
  - github.com/evanphx/json-patch@v4.12.0+incompatible

被替换的依赖数量: 3
被替换的依赖:
  - github.com/docker/distribution@v2.8.1+incompatible => github.com/distribution/distribution@v2.8.1+incompatible
  - github.com/googleapis/gnostic@v0.5.5 => github.com/google/gnostic@v0.5.5
  - gopkg.in/yaml.v3@v3.0.0 => gopkg.in/yaml.v3@v3.0.0-20210107192922-496545a6307b`
    },
    find: {
      code: findCode,
      description: '此示例展示了如何在二进制文件中查找特定依赖，包括精确匹配和部分匹配。这对于检查二进制文件是否使用了特定库或检查库的版本很有用。',
      output: `🔍 在二进制文件中查找依赖

文件: /usr/local/bin/kubectl
Go版本: go1.18.2
总依赖数量: 157

方法1: 精确匹配 "github.com/spf13/cobra"
✅ 找到完全匹配的依赖: github.com/spf13/cobra@v1.4.0
   校验和: h1:y+wJpx64xcgO1V+RcnwW0LEHxTKRi2ZDPSBjWnrg88=

方法2: 模糊匹配包含 "cobra" 的依赖
✅ 找到 2 个匹配的依赖:
1. github.com/russross/blackfriday/v2@v2.1.0
2. github.com/spf13/cobra@v1.4.0`
    },
    remote: {
      code: remoteCode,
      description: '此示例展示了如何直接从URL解析远程二进制文件，无需先下载到本地。它使用HTTP Range请求只获取必要的部分，大大减少了数据传输量。',
      output: `🌐 解析远程Go二进制文件

URL: https://example.com/go-binary

尝试解析远程二进制文件...

✅ 成功解析远程二进制文件
主模块: github.com/example/myapp@v1.2.3
Go版本: go1.18.2
依赖数量: 42

JSON输出示例 (前5个依赖):
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
      "sum": "h1:Y+zgqChV/opLWqYQOCQ4IRe5PYUQvobqKJ3TZQThSU4="
    },
    {
      "path": "golang.org/x/sys",
      "version": "v0.0.0-20220412211240-33da011f77ad",
      "sum": "h1:ntjMns5wyP/fN65tdBD4g8J5w8n015+iIIs9rtjXkY0="
    }
  ]
}

...显示了前5个依赖，共有42个`
    }
  };

  const renderExample = () => {
    const example = examples[activeTab];
    
    return (
      <ExampleContainer>
        <Text>{example.description}</Text>
        <CodeBlock 
          code={example.code} 
          language="go" 
          title="示例代码" 
        />
        <OutputTitle>示例输出</OutputTitle>
        <OutputBox>{example.output}</OutputBox>
      </ExampleContainer>
    );
  };

  return (
    <Container>
      <Section>
        <Title>代码示例</Title>
        <Text>
          以下是使用 GoBinaryParser 库的几个示例代码。这些示例展示了库的主要功能，
          如基本依赖解析、依赖过滤、特定依赖查找和远程二进制解析。
        </Text>
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'basic'} 
            onClick={() => setActiveTab('basic')}
          >
            基本解析
          </Tab>
          <Tab 
            active={activeTab === 'filter'} 
            onClick={() => setActiveTab('filter')}
          >
            依赖过滤
          </Tab>
          <Tab 
            active={activeTab === 'find'} 
            onClick={() => setActiveTab('find')}
          >
            查找特定依赖
          </Tab>
          <Tab 
            active={activeTab === 'remote'} 
            onClick={() => setActiveTab('remote')}
          >
            远程二进制解析
          </Tab>
        </TabsContainer>
        
        {renderExample()}
      </Section>
    </Container>
  );
};

export default ExamplesPage; 
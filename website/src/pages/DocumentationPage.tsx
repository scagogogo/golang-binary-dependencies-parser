import React, { useState } from 'react';
import styled from 'styled-components';
import CodeBlock from '../components/CodeBlock';

const Container = styled.div`
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  width: 250px;
  flex-shrink: 0;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
  height: calc(100vh - 4rem);
  overflow-y: auto;
  padding-right: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    position: static;
    height: auto;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }
`;

const Content = styled.main`
  flex: 1;
  max-width: 900px;
`;

const SidebarTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #0f172a;
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0 0 2rem 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

interface NavLinkProps {
  active?: boolean;
}

const NavLink = styled.a<NavLinkProps>`
  display: block;
  padding: 0.5rem;
  color: ${props => props.active ? '#0ea5e9' : '#64748b'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  border-left: 3px solid ${props => props.active ? '#0ea5e9' : 'transparent'};
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    color: #0ea5e9;
    background-color: #f1f5f9;
    text-decoration: none;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
  scroll-margin-top: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #0f172a;
`;

const Heading = styled.h2`
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
  color: #0f172a;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
  scroll-margin-top: 2rem;
`;

const SubHeading = styled.h3`
  font-size: 1.25rem;
  margin: 1.5rem 0 1rem;
  color: #0f172a;
`;

const Text = styled.p`
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #334155;
`;

const List = styled.ul`
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
`;

interface ScrollLinkProps {
  to: string;
  children: React.ReactNode;
}

const ScrollLink: React.FC<ScrollLinkProps> = ({ to, children }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(to);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <NavLink href={`#${to}`} onClick={handleClick}>
      {children}
    </NavLink>
  );
};

const DocumentationPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  
  // 基本解析示例
  const parseExample = `package main

import (
  "fmt"
  "github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
  // 从文件解析
  info, err := gobinaryparser.ParseBinaryFromFile("/usr/local/bin/go")
  if err != nil {
    fmt.Printf("解析失败: %v\\n", err)
    return
  }
  
  // 打印信息
  fmt.Printf("路径: %s\\n", info.Path)
  fmt.Printf("版本: %s\\n", info.Version)
  fmt.Printf("Go版本: %s\\n", info.GoVersion)
  fmt.Printf("依赖数量: %d\\n", len(info.Dependencies))
  
  // 打印前5个依赖
  for i, dep := range info.Dependencies {
    if i >= 5 {
      break
    }
    fmt.Printf("依赖 #%d: %s@%s\\n", i+1, dep.Path, dep.Version)
  }
}`;

  // 远程二进制解析示例
  const remoteExample = `// 从URL解析二进制文件
info, err := gobinaryparser.ParseBinaryFromURL("https://example.com/my-binary")
if err != nil {
  log.Fatalf("解析失败: %v", err)
}

// 带有超时控制的解析
ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
defer cancel()
info, err := gobinaryparser.ParseBinaryFromURLWithContext(ctx, "https://example.com/my-binary")`;

  // 过滤依赖示例
  const filterExample = `// 过滤标准库依赖
nonStdLibDeps := gobinaryparser.FilterStdLib(info.Dependencies)
fmt.Printf("第三方依赖数量: %d\\n", len(nonStdLibDeps))

// 自定义过滤
githubDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
  return strings.HasPrefix(dep.Path, "github.com/")
})
fmt.Printf("GitHub依赖数量: %d\\n", len(githubDeps))`;

  // CLI工具使用示例
  const cliExample = `# 基本用法
godeps /usr/local/bin/kubectl

# 过滤标准库依赖
godeps --nostdlib /usr/local/bin/kubectl

# JSON格式输出
godeps --json /usr/local/bin/kubectl > deps.json

# 查找特定依赖
godeps find cobra /usr/local/bin/kubectl

# 只显示标准库依赖
godeps stdlib /usr/local/bin/kubectl`;

  // API结构体示例
  const apiStructsExample = `// DependencyInfo 表示Go二进制文件中的一个依赖信息
type DependencyInfo struct {
  Path    string          \`json:"path"\`              // 依赖的导入路径
  Version string          \`json:"version"\`           // 依赖的版本
  Sum     string          \`json:"sum,omitempty"\`     // 依赖的校验和
  Replace *DependencyInfo \`json:"replace,omitempty"\` // 替换信息
}

// BinaryInfo 表示从Go二进制文件中解析出的信息
type BinaryInfo struct {
  Path          string            \`json:"path"\`           // 主模块路径
  Version       string            \`json:"version"\`        // 主模块版本
  Dependencies  []DependencyInfo  \`json:"dependencies"\`   // 依赖列表
  GoVersion     string            \`json:"go_version"\`     // 编译使用的Go版本
  BuildSettings map[string]string \`json:"build_settings"\` // 编译设置
  FilePath      string            \`json:"file_path"\`      // 解析的二进制文件路径
  SourceType    string            \`json:"source_type"\`    // 源类型
}`;

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let currentActive = activeSection;
      
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const scrollY = window.scrollY;
        
        if (scrollY >= sectionTop - 100 && scrollY < sectionTop + sectionHeight - 100) {
          currentActive = section.id;
        }
      });
      
      if (currentActive !== activeSection) {
        setActiveSection(currentActive);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <Container>
      <Sidebar>
        <SidebarTitle>目录</SidebarTitle>
        <NavList>
          <NavItem>
            <ScrollLink to="overview">概述</ScrollLink>
          </NavItem>
          <NavItem>
            <ScrollLink to="installation">安装</ScrollLink>
          </NavItem>
          <NavItem>
            <ScrollLink to="core-types">核心类型</ScrollLink>
          </NavItem>
          <NavItem>
            <ScrollLink to="parsing-functions">解析函数</ScrollLink>
          </NavItem>
          <NavItem>
            <ScrollLink to="filtering">过滤依赖</ScrollLink>
          </NavItem>
          <NavItem>
            <ScrollLink to="cli-usage">命令行工具</ScrollLink>
          </NavItem>
        </NavList>
      </Sidebar>
      
      <Content>
        <Title>GoBinaryParser 文档</Title>
        
        <Section id="overview">
          <Heading>概述</Heading>
          <Text>
            GoBinaryParser 是一个用于解析和分析 Go 二进制文件中依赖关系的工具包。它可以提取二进制文件中的模块依赖信息，
            包括路径、版本、哈希值等，无需源代码即可了解二进制文件的构建依赖关系。
          </Text>
          <Text>
            这个库支持解析本地和远程二进制文件，并提供多种过滤和搜索方法来分析依赖。
          </Text>
        </Section>
        
        <Section id="installation">
          <Heading>安装</Heading>
          <Text>
            您可以通过以下命令将库安装到您的 Go 项目中：
          </Text>
          <CodeBlock 
            code="go get github.com/scagogogo/golang-binary-dependencies-parser" 
            language="bash" 
            showLineNumbers={false}
          />
          <Text>
            或者安装命令行工具：
          </Text>
          <CodeBlock 
            code="go install github.com/scagogogo/golang-binary-dependencies-parser/cmd/godeps@latest" 
            language="bash" 
            showLineNumbers={false}
          />
          <Text>
            有关更详细的安装说明，请参阅<a href="/installation">安装指南</a>。
          </Text>
        </Section>
        
        <Section id="core-types">
          <Heading>核心类型</Heading>
          
          <SubHeading>DependencyInfo</SubHeading>
          <Text>
            DependencyInfo 结构体表示 Go 二进制文件中的单个依赖信息：
          </Text>
          <CodeBlock 
            code={`type DependencyInfo struct {
  Path    string          // 依赖的导入路径，例如 "github.com/spf13/cobra"
  Version string          // 依赖的版本，例如 "v1.6.1"
  Sum     string          // 依赖的校验和
  Replace *DependencyInfo // 替换信息，如果此依赖被替换则不为nil
}`} 
            language="go" 
            showLineNumbers={false}
          />
          
          <SubHeading>BinaryInfo</SubHeading>
          <Text>
            BinaryInfo 结构体表示从 Go 二进制文件中解析出的完整信息：
          </Text>
          <CodeBlock 
            code={`type BinaryInfo struct {
  Path          string            // 主模块路径
  Version       string            // 主模块版本
  Dependencies  []DependencyInfo  // 依赖列表
  GoVersion     string            // 编译使用的Go版本
  BuildSettings map[string]string // 编译设置
  FilePath      string            // 解析的二进制文件路径
  SourceType    string            // 源类型("file", "url", "bytes", "reader")
}`} 
            language="go" 
            showLineNumbers={false}
          />
        </Section>
        
        <Section id="parsing-functions">
          <Heading>解析函数</Heading>
          
          <SubHeading>从文件解析</SubHeading>
          <Text>
            从本地文件解析 Go 二进制文件：
          </Text>
          <CodeBlock 
            code={`// 解析本地二进制文件
info, err := gobinaryparser.ParseBinaryFromFile("/usr/local/bin/go")`} 
            language="go" 
            showLineNumbers={false}
          />
          
          <SubHeading>从远程URL解析</SubHeading>
          <Text>
            直接从远程URL解析 Go 二进制文件，无需完整下载：
          </Text>
          <CodeBlock 
            code={remoteExample} 
            language="go" 
          />
          
          <SubHeading>从字节数组或读取器解析</SubHeading>
          <Text>
            当二进制数据已存在于内存中时：
          </Text>
          <CodeBlock 
            code={`// 从字节数组解析
data, _ := ioutil.ReadFile("/path/to/binary")
info, err := gobinaryparser.ParseBinaryFromBytes(data)

// 从io.ReaderAt接口解析
file, _ := os.Open("/path/to/binary")
info, err := gobinaryparser.ParseBinaryFromReader(file)`} 
            language="go" 
          />
          
          <SubHeading>完整示例</SubHeading>
          <CodeBlock 
            code={parseExample} 
            language="go" 
            title="基本解析示例" 
          />
        </Section>
        
        <Section id="filtering">
          <Heading>过滤依赖</Heading>
          <Text>
            GoBinaryParser 提供了多种过滤和搜索依赖的方法：
          </Text>
          
          <SubHeading>标准库过滤</SubHeading>
          <Text>
            区分标准库和第三方依赖：
          </Text>
          <CodeBlock 
            code={`// 检查单个依赖是否属于标准库
isStd := gobinaryparser.IsStdLib("fmt")  // 返回 true
isStd = gobinaryparser.IsStdLib("github.com/spf13/cobra")  // 返回 false

// 过滤掉标准库依赖
thirdPartyDeps := gobinaryparser.FilterStdLib(info.Dependencies)`} 
            language="go" 
          />
          
          <SubHeading>自定义过滤</SubHeading>
          <Text>
            使用自定义函数过滤依赖：
          </Text>
          <CodeBlock 
            code={filterExample} 
            language="go" 
          />
          
          <SubHeading>查找特定依赖</SubHeading>
          <Text>
            查找特定路径的依赖：
          </Text>
          <CodeBlock 
            code={`// 查找特定依赖
dep := info.GetDependencyByPath("github.com/spf13/cobra")
if dep != nil {
  fmt.Printf("找到依赖: %s@%s\\n", dep.Path, dep.Version)
  if dep.Replace != nil {
    fmt.Printf("被替换为: %s@%s\\n", dep.Replace.Path, dep.Replace.Version)
  }
}`} 
            language="go" 
          />
        </Section>
        
        <Section id="cli-usage">
          <Heading>命令行工具</Heading>
          <Text>
            godeps 命令行工具提供了一个简单的界面来分析 Go 二进制文件：
          </Text>
          <CodeBlock 
            code={cliExample} 
            language="bash" 
            title="命令行工具示例" 
          />
          
          <SubHeading>可用命令</SubHeading>
          <List>
            <li><strong>godeps</strong>：显示二进制文件的所有依赖</li>
            <li><strong>godeps find</strong>：查找特定依赖</li>
            <li><strong>godeps stdlib</strong>：只显示标准库依赖</li>
          </List>
          
          <SubHeading>选项</SubHeading>
          <List>
            <li><strong>--nostdlib, -s</strong>：过滤掉标准库依赖</li>
            <li><strong>--json, -j</strong>：以JSON格式输出结果</li>
            <li><strong>--verbose, -v</strong>：显示详细信息，包括校验和</li>
            <li><strong>--replaced, -r</strong>：只显示被替换的依赖</li>
          </List>
        </Section>
      </Content>
    </Container>
  );
};

export default DocumentationPage; 
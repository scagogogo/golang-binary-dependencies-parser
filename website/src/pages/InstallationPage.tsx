import React from 'react';
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

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
  color: #0f172a;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
`;

const Text = styled.p`
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #334155;
`;

const List = styled.ul`
  margin-bottom: 1.5rem;
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
`;

const InstallationPage: React.FC = () => {
  // 库安装代码
  const libInstallCode = `go get github.com/scagogogo/golang-binary-dependencies-parser`;
  
  // CLI工具安装代码
  const cliInstallCode = `go install github.com/scagogogo/golang-binary-dependencies-parser/cmd/godeps@latest`;
  
  // 库使用示例
  const libUsageCode = `package main

import (
  "fmt"
  "github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
  // 解析二进制文件
  info, err := gobinaryparser.ParseBinaryFromFile("/usr/local/bin/go")
  if err != nil {
    fmt.Printf("解析失败: %v\\n", err)
    return
  }
  
  // 打印基本信息
  fmt.Printf("Go版本: %s\\n", info.GoVersion)
  fmt.Printf("依赖数量: %d\\n", len(info.Dependencies))
}`;

  // CLI工具使用示例
  const cliUsageCode = `# 查看所有依赖
godeps /usr/local/bin/go

# 过滤标准库依赖
godeps --nostdlib /usr/local/bin/go

# 查找特定依赖
godeps find cobra /usr/local/bin/kubectl

# 只显示标准库依赖
godeps stdlib /usr/local/bin/go`;

  return (
    <Container>
      <Section>
        <Title>安装指南</Title>
        <Text>
          GoBinaryParser 提供了两种使用方式：作为库引入到您的 Go 项目中，或者作为命令行工具直接使用。
          以下是两种安装方式的详细说明。
        </Text>
      </Section>

      <Section>
        <Subtitle>前提条件</Subtitle>
        <List>
          <li>Go 1.18 或更高版本</li>
          <li>启用了 Go Modules 的项目</li>
        </List>
      </Section>

      <Section>
        <Subtitle>安装库</Subtitle>
        <Text>
          要将 GoBinaryParser 作为库安装到您的 Go 项目中，请运行以下命令：
        </Text>
        <CodeBlock 
          code={libInstallCode} 
          language="bash" 
          title="安装库" 
          showLineNumbers={false}
        />
        <Text>
          这将下载最新版本的库到您的 Go 模块缓存中，并更新您的 go.mod 和 go.sum 文件。
        </Text>
      </Section>

      <Section>
        <Subtitle>安装命令行工具</Subtitle>
        <Text>
          如果您想作为命令行工具使用，可以使用以下命令安装：
        </Text>
        <CodeBlock 
          code={cliInstallCode} 
          language="bash" 
          title="安装 CLI 工具" 
          showLineNumbers={false}
        />
        <Text>
          这将在您的 GOPATH/bin 目录下安装 godeps 命令行工具。请确保该目录已添加到您的系统 PATH 中，
          以便可以直接调用 godeps 命令。
        </Text>
      </Section>

      <Section>
        <Subtitle>基本使用 - 库</Subtitle>
        <Text>
          以下是使用 GoBinaryParser 库的简单示例：
        </Text>
        <CodeBlock 
          code={libUsageCode} 
          language="go" 
          title="库使用示例" 
        />
      </Section>

      <Section>
        <Subtitle>基本使用 - 命令行工具</Subtitle>
        <Text>
          安装完成后，您可以使用以下命令来分析 Go 二进制文件：
        </Text>
        <CodeBlock 
          code={cliUsageCode} 
          language="bash" 
          title="CLI 工具使用示例" 
        />
      </Section>

      <Section>
        <Subtitle>下一步</Subtitle>
        <Text>
          现在您已经安装了 GoBinaryParser，您可以：
        </Text>
        <List>
          <li>查看<a href="/documentation">完整文档</a>了解所有功能</li>
          <li>浏览<a href="/examples">示例</a>获取更多使用案例</li>
          <li>访问<a href="https://github.com/scagogogo/golang-binary-dependencies-parser" target="_blank" rel="noopener noreferrer">GitHub 仓库</a>获取源代码</li>
        </List>
      </Section>
    </Container>
  );
};

export default InstallationPage; 
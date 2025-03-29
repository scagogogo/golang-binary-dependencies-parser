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
      title: '基本用法',
      code: `package main

import (
	"fmt"
	"log"
	
	"github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
	// 解析二进制文件
	info, err := gobinaryparser.ParseBinaryFromFile("/usr/local/bin/kubectl")
	if err != nil {
		log.Fatalf("解析二进制文件失败: %v", err)
	}
	
	// 打印基本信息
	fmt.Printf("二进制文件: %s\\n", info.FilePath)
	fmt.Printf("主模块: %s@%s\\n", info.Path, info.Version)
	fmt.Printf("Go版本: %s\\n", info.GoVersion)
	fmt.Printf("依赖数量: %d\\n", len(info.Dependencies))
	
	// 打印前5个依赖
	for i := 0; i < 5 && i < len(info.Dependencies); i++ {
		dep := info.Dependencies[i]
		fmt.Printf("%d. %s@%s\\n", i+1, dep.Path, dep.Version)
		if dep.Replace != nil {
			fmt.Printf("   (被替换为 %s@%s)\\n", 
				dep.Replace.Path, dep.Replace.Version)
		}
	}
}`
    },
    filtering: {
      title: '依赖过滤',
      code: `// 过滤标准库依赖
stdlibDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
	return gobinaryparser.IsStdLib(dep.Path)
})
fmt.Printf("标准库依赖数量: %d\\n", len(stdlibDeps))

// 过滤第三方依赖
thirdPartyDeps := gobinaryparser.FilterStdLib(info.Dependencies)
fmt.Printf("第三方依赖数量: %d\\n", len(thirdPartyDeps))

// 过滤GitHub依赖
githubDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
	return strings.HasPrefix(dep.Path, "github.com/")
})
fmt.Printf("GitHub依赖数量: %d\\n", len(githubDeps))`
    },
    remote: {
      title: '远程二进制分析',
      code: `// 直接从URL解析二进制文件
info, err := gobinaryparser.ParseBinaryFromURL("https://example.com/path/to/binary")
if err != nil {
	log.Fatalf("解析远程二进制文件失败: %v", err)
}

// 或者使用超时上下文
ctx, cancel := context.WithTimeout(context.Background(), 30 * time.Second)
defer cancel()

info, err = gobinaryparser.ParseBinaryFromURLWithContext(ctx, url)
if err != nil {
	log.Fatalf("解析远程二进制文件失败: %v", err)
}`
    },
    cli: {
      title: '命令行工具使用',
      code: `# 查看基本依赖信息
godeps /usr/local/bin/kubectl

# 只显示标准库依赖
godeps stdlib /usr/local/bin/kubectl

# 查找特定依赖（精确或部分匹配）
godeps find cobra /usr/local/bin/kubectl

# 以JSON格式输出
godeps --json /usr/local/bin/kubectl

# 分析目录中的所有Go二进制文件
godeps scan /usr/local/bin`
    }
  };
  
  return (
    <PageContainer>
      <Header>
        <Title>Go二进制依赖解析器</Title>
        <Subtitle>
          一个强大的Go库和命令行工具，用于从Go二进制文件中提取和分析依赖信息，无需源代码。
        </Subtitle>
      </Header>
      
      <FeaturesGrid>
        <Feature>
          <FeatureIcon>🔍</FeatureIcon>
          <FeatureTitle>二进制分析</FeatureTitle>
          <FeatureDescription>
            从任何使用Go 1.12+编译的Go二进制文件中提取依赖信息，
            包括模块路径、版本和替换指令。
          </FeatureDescription>
        </Feature>
        
        <Feature>
          <FeatureIcon>🌐</FeatureIcon>
          <FeatureTitle>远程二进制支持</FeatureTitle>
          <FeatureDescription>
            直接从URL分析远程二进制文件，无需下载整个文件，
            使用HTTP范围请求最小化数据传输。
          </FeatureDescription>
        </Feature>
        
        <Feature>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>依赖过滤</FeatureTitle>
          <FeatureDescription>
            通过各种条件过滤依赖，如标准库与第三方库、
            特定前缀或自定义过滤函数。
          </FeatureDescription>
        </Feature>
        
        <Feature>
          <FeatureIcon>🔧</FeatureIcon>
          <FeatureTitle>命令行工具</FeatureTitle>
          <FeatureDescription>
            用于快速依赖分析的命令行界面，支持多种
            输出格式，包括文本和JSON。
          </FeatureDescription>
        </Feature>
        
        <Feature>
          <FeatureIcon>📚</FeatureIcon>
          <FeatureTitle>库API</FeatureTitle>
          <FeatureDescription>
            作为Go库在您自己的工具和应用程序中使用，
            提供清晰、文档完善的API。
          </FeatureDescription>
        </Feature>
        
        <Feature>
          <FeatureIcon>🔒</FeatureIcon>
          <FeatureTitle>无需源代码</FeatureTitle>
          <FeatureDescription>
            分析闭源二进制文件或可执行文件，无需访问
            原始源代码或构建环境。
          </FeatureDescription>
        </Feature>
      </FeaturesGrid>
      
      <ExampleSection>
        <ExampleHeader>代码示例</ExampleHeader>
        <ExampleButtonsContainer>
          <ExampleButton 
            isActive={activeExampleTab === 'basic'} 
            onClick={() => setActiveExampleTab('basic')}
          >
            基本用法
          </ExampleButton>
          <ExampleButton 
            isActive={activeExampleTab === 'filtering'} 
            onClick={() => setActiveExampleTab('filtering')}
          >
            依赖过滤
          </ExampleButton>
          <ExampleButton 
            isActive={activeExampleTab === 'remote'} 
            onClick={() => setActiveExampleTab('remote')}
          >
            远程二进制分析
          </ExampleButton>
          <ExampleButton 
            isActive={activeExampleTab === 'cli'} 
            onClick={() => setActiveExampleTab('cli')}
          >
            命令行工具
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
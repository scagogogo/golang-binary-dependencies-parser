import React, { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';

// 注册需要的语言
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);

const CodeContainer = styled.div`
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const CodeTitle = styled.div`
  background-color: #282c34;
  color: #e2e8f0;
  padding: 0.75rem 1rem;
  font-family: monospace;
  font-size: 0.9rem;
  border-bottom: 1px solid #3e4451;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ScrollContainer = styled.div`
  max-width: 100%;
  overflow-x: auto;
  background-color: #282c34;
  position: relative;
`;

// 为单行代码容器定义props类型
interface SingleLineContainerProps {
  hasTitle: boolean;
  commandType: 'bash' | 'go' | 'other';
}

// 专门用于单行代码的样式容器
const SingleLineCodeContainer = styled.div<SingleLineContainerProps>`
  background-color: #282c34;
  color: #abb2bf;
  padding: 0.75rem 1rem;
  padding-left: ${props => props.commandType === 'bash' ? '2rem' : '1rem'};
  border-radius: ${props => props.hasTitle ? '0 0 8px 8px' : '8px'};
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow-x: auto;
  border-left: 3px solid ${props => 
    props.commandType === 'bash' ? '#98c379' : 
    props.commandType === 'go' ? '#61afef' : '#c678dd'};
  position: relative;

  &::before {
    content: ${props => props.commandType === 'bash' ? "'$'" : "' '"};
    position: absolute;
    left: 0.7rem;
    color: #98c379;
    font-weight: bold;
    display: ${props => props.commandType === 'bash' ? 'block' : 'none'};
  }
`;

// 多行命令容器
interface MultiLineCommandContainerProps {
  title: boolean;
}

const MultiLineCommandContainer = styled.div<MultiLineCommandContainerProps>`
  background-color: #282c34;
  padding: 0.5rem 0;
  border-radius: ${props => props.title ? '0 0 8px 8px' : '8px'};
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  font-size: 0.95rem;
  overflow-x: auto;
  border-left: 3px solid #98c379;
`;

// 命令行样式
const CommandLine = styled.div`
  position: relative;
  padding: 0.25rem 1rem 0.25rem 2rem;
  white-space: nowrap;
  
  &::before {
    content: '$';
    position: absolute;
    left: 0.7rem;
    color: #98c379;
    font-weight: bold;
  }
  
  &.comment {
    color: #7f848e;
    font-style: italic;
    
    &::before {
      content: '#';
      color: #7f848e;
    }
  }
`;

// 复制按钮样式
const CopyButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(40, 44, 52, 0.8);
  color: #abb2bf;
  border: 1px solid #3e4451;
  border-radius: 4px;
  padding: 0.35rem 0.6rem;
  font-size: 0.75rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background-color: #3e4451;
    color: white;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

// 复制图标
const CopyIcon = () => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

// 复制成功图标
const CheckIcon = () => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// 高亮单行代码中的关键部分
const highlightBashCommand = (code: string) => {
  if (!code) return '';
  
  // 简单的命令语法高亮
  return code
    .replace(/(^|\s)(go|git|npm|yarn|docker|kubectl)(\s)/g, '$1<span style="color: #c678dd;">$2</span>$3')
    .replace(/(^|\s)(get|install|run|build|start|test|exec|apply)(\s)/g, '$1<span style="color: #61afef;">$2</span>$3')
    .replace(/(@latest|\.[a-z]+)/g, '<span style="color: #e06c75;">$1</span>')
    .replace(/("|')(.*?)("|')/g, '<span style="color: #98c379;">$1$2$3</span>')
    .replace(/(--[a-zA-Z0-9-]+)/g, '<span style="color: #d19a66;">$1</span>');
};

// 拆分多行bash命令并高亮
const renderMultiLineBash = (code: string) => {
  const lines = code.split('\n');
  
  return lines.map((line, index) => {
    const isComment = line.trim().startsWith('#');
    const classes = isComment ? 'comment' : '';
    
    return (
      <CommandLine 
        key={index} 
        className={classes}
        dangerouslySetInnerHTML={{ 
          __html: isComment 
            ? line.trim().substring(1) // 移除#符号
            : highlightBashCommand(line) 
        }}
      />
    );
  });
};

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  code, 
  language, 
  showLineNumbers = true,
  title
}) => {
  const [copied, setCopied] = useState(false);
  
  // 复制代码函数
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      
      // 3秒后重置状态
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };
  
  // 判断是否为单行代码
  const isSingleLine = !code.includes('\n');
  
  // 自定义样式
  const customStyle = {
    background: '#282c34',
    margin: 0,
    padding: '1rem',
    borderRadius: title ? '0 0 8px 8px' : '8px',
    fontSize: '0.95rem',
    lineHeight: 1.5,
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace'
  };

  // 复制按钮
  const renderCopyButton = (hasTitle: boolean = false) => (
    <CopyButton 
      onClick={copyToClipboard}
      style={{ top: hasTitle ? '0.5rem' : '0.5rem' }}
      title="复制代码"
    >
      {copied ? (
        <>
          <CheckIcon /> 已复制
        </>
      ) : (
        <>
          <CopyIcon /> 复制
        </>
      )}
    </CopyButton>
  );

  // Bash命令的特殊处理
  if (language === 'bash') {
    // 单行bash命令
    if (isSingleLine) {
      return (
        <CodeContainer>
          {title ? (
            <CodeTitle>
              {title}
              {renderCopyButton(true)}
            </CodeTitle>
          ) : renderCopyButton()}
          <SingleLineCodeContainer 
            hasTitle={!!title} 
            commandType="bash"
            dangerouslySetInnerHTML={{ __html: highlightBashCommand(code) }}
          />
        </CodeContainer>
      );
    } 
    // 多行bash命令
    else {
      return (
        <CodeContainer>
          {title ? (
            <CodeTitle>
              {title}
              {renderCopyButton(true)}
            </CodeTitle>
          ) : renderCopyButton()}
          <MultiLineCommandContainer title={!!title}>
            {renderMultiLineBash(code)}
          </MultiLineCommandContainer>
        </CodeContainer>
      );
    }
  }
  
  // 单行Go代码的特殊处理
  if (isSingleLine && language === 'go') {
    return (
      <CodeContainer>
        {title ? (
          <CodeTitle>
            {title}
            {renderCopyButton(true)}
          </CodeTitle>
        ) : renderCopyButton()}
        <SingleLineCodeContainer 
          hasTitle={!!title} 
          commandType="go"
        >
          {code}
        </SingleLineCodeContainer>
      </CodeContainer>
    );
  }

  // 其他所有类型的代码使用正常处理
  return (
    <CodeContainer>
      {title ? (
        <CodeTitle>
          {title}
          {renderCopyButton(true)}
        </CodeTitle>
      ) : renderCopyButton()}
      <ScrollContainer>
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          showLineNumbers={showLineNumbers && !isSingleLine}
          customStyle={customStyle}
          useInlineStyles={true}
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1em',
            textAlign: 'right',
            color: '#636d83',
            marginRight: '1em',
            userSelect: 'none',
            borderRight: '1px solid #3e4451'
          }}
          wrapLongLines={false}
          className="code-block"
        >
          {code}
        </SyntaxHighlighter>
      </ScrollContainer>
    </CodeContainer>
  );
};

export default CodeBlock; 
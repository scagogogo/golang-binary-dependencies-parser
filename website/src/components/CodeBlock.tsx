import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  title?: string;
}

const CodeContainer = styled.div`
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CodeTitle = styled.div`
  background-color: #2d3748;
  color: #e2e8f0;
  padding: 0.75rem 1rem;
  font-family: monospace;
  font-size: 0.9rem;
  border-bottom: 1px solid #4a5568;
`;

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  code, 
  language, 
  showLineNumbers = true,
  title
}) => {
  return (
    <CodeContainer>
      {title && <CodeTitle>{title}</CodeTitle>}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        wrapLines={true}
        customStyle={{ 
          margin: 0,
          padding: '1rem',
          fontSize: '0.9rem',
          borderRadius: title ? '0 0 8px 8px' : '8px'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </CodeContainer>
  );
};

export default CodeBlock; 
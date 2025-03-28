import React from 'react';
import styled from 'styled-components';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const Card = styled.div`
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

const IconContainer = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  margin: 0 0 0.75rem 0;
  color: #1e293b;
  font-size: 1.25rem;
`;

const Description = styled.p`
  margin: 0;
  color: #64748b;
  line-height: 1.6;
`;

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <Card>
      <IconContainer>
        <span role="img" aria-label={title}>{icon}</span>
      </IconContainer>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Card>
  );
};

export default FeatureCard; 
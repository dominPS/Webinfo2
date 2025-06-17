import styled from '@emotion/styled';

const Container = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const Dashboard = () => {
  return (
    <Container>
      <Title>Dashboard</Title>
      {/* Add dashboard content here */}
    </Container>
  );
};

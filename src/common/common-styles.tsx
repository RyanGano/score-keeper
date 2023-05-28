import styled from "styled-components";

export const GameHeader = styled.div`
  position: absolute;
  left: 56px;
  top: 12px;
`;

export const CenteredTextBox = styled.div`
  display: table;
  text-align: center;
`;

export const CenteredTextBoxWithBorder = styled(CenteredTextBox)`
  border-style: solid;
  border-width: 0.5px;
`;

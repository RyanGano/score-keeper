import styled from "styled-components";
import Nav from "react-bootstrap/Nav";

export const StyledInput = styled.input`
  display: block;
  margin: 20px 0px;
  border: 1px solid lightblue;
`;

export const LightBlueLeftNav = styled(Nav)`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #ccddff;
  min-height: 100vh !important;
  z-index: 100;
  padding: 12px 24px 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
`;

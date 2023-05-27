import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Stack from "react-bootstrap/esm/Stack";

export const hintPopupContent = (
  <Stack>
    <h5>Order of Play</h5>
    <ol>
      <li>Roll dice and collect goods and food</li>
      <li>Fee cities and resolve disasters</li>
      <li>Build citites and/or monuments</li>
      <li>May buy a development</li>
      <li>Discard goods in excess of 6</li>
    </ol>
    <h5>Disasters</h5>
    <Container>
      <Row>
        <Col>
          <i>Cause</i>
        </Col>
        <Col>
          <i>Result</i>
        </Col>
        <Col>
          <i>Effect</i>
        </Col>
      </Row>
      <Row>
        <Col>No food</Col>
        <Col>Famine</Col>
        <Col>-1 pt (per city)</Col>
      </Row>
      <Row>
        <Col>1 Skull</Col>
        <Col>None</Col>
        <Col>No Effect</Col>
      </Row>
      <Row>
        <Col>2 Skulls</Col>
        <Col>Drought</Col>
        <Col>-2 pts</Col>
      </Row>
      <Row>
        <Col>3 Skulls</Col>
        <Col>Pestilence</Col>
        <Col>-3 pts (opponents)</Col>
      </Row>
      <Row>
        <Col>4 Skulls</Col>
        <Col>Invasion</Col>
        <Col>-4 pts</Col>
      </Row>
      <Row>
        <Col>5+ Skulls</Col>
        <Col>Revolt</Col>
        <Col>Lose all goods</Col>
      </Row>
    </Container>
    <p />
    <h5>Game End</h5>
    Game ends at the end of the round when:
    <ul>
      <li>All monuments are collectively built or</li>
      <li>One player has 5 developments</li>
    </ul>
  </Stack>
);

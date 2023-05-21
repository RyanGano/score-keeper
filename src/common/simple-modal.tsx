import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";

export interface SimpleModalProps {
  title: string;
  content: JSX.Element;
  defaultButtonContent: string;
  alternateButtonContent: string;
  onAccept: () => void;
  onCancel: () => void;
  show: boolean;
}

export const SimpleModal = (props: SimpleModalProps) => {
  return (
    <Modal show={props.show} onHide={props.onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.content}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onCancel}>
          {props.alternateButtonContent}
        </Button>
        <Button variant="primary" onClick={props.onAccept}>
          {props.defaultButtonContent}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

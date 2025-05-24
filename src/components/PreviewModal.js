import Tilt from "react-parallax-tilt";
import Modal from "react-modal";
import DigitalCard from "./DigitalCard";
import "../CSS/PreviewModal.css"

const PreviewModal = ({ isOpen, onRequestClose, designindex, designProps, cardid }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Kart Önizleme"
      className="preview-modal"
      overlayClassName="preview-overlay"
    >
      <Tilt tiltMaxAngleX={40} tiltMaxAngleY={40} perspective={1000} scale={1}>
        <DigitalCard cardid={cardid} designindex={designindex} {...designProps} />
      </Tilt>
    </Modal>
  );
};

export default PreviewModal;

import React from 'react';
import Modal from 'react-modal';
import './style.scss';

interface ImageModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  imageUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onRequestClose, imageUrl }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Full Image Modal"
      className="image-modal"
      overlayClassName="image-modal-overlay"
    >
      <img src={imageUrl} alt="Full Image" className="image-modal-img" />
    </Modal>
  );
};

export default ImageModal;
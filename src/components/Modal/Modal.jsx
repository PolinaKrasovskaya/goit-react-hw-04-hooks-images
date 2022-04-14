import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import style from './Modal.module.css';
import propTypes from 'prop-types';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({largeImage, requestName, onClose}) {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  })

  const handleKeyDown = e => {
    if (e.code === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = e => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

    return createPortal(
      <div onClick={handleBackdropClick} className={style.modal_backdrop}>
        <img className={style.modal} src={largeImage} alt={requestName} />
      </div>,
      modalRoot
    );
}

Modal.propTypes = {
  largeImage: propTypes.string.isRequired,
  requestName: propTypes.string,
};
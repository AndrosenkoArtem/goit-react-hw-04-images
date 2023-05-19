import { useEffect } from 'react';
import styles from './Modal.module.css';
import PropTypes from 'prop-types';
export const Modal = ({ url, alt, closeModal }) => {
  const clsoeModalOnEsc = e => {
    if (e.code !== 'Escape') {
      return;
    }
    closeModal(e);
  };
  useEffect(() => {
    window.addEventListener('keydown', clsoeModalOnEsc);
    return () => window.removeEventListener('keydown', clsoeModalOnEsc);
  });

  return (
    <div onClick={e => closeModal(e)} className={styles.Overlay}>
      <img className={styles.Modal} src={url} alt={alt} />
    </div>
  );
};
Modal.prototype = {
  url: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

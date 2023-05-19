import styles from './ImageGalleryItem.module.css';
import PropTypes from 'prop-types';
export const ImageGalleryItem = ({ images, openModal }) => {
  return (
    <>
      {images.map(image => (
        <li className={styles.ImageGalleryItem} key={image.id}>
          <img
            onClick={() => openModal(image.largeImageURL, image.tags)}
            height={260}
            className={styles.ImageGalleryItemImage}
            src={image.webformatURL}
            alt=""
          />
        </li>
      ))}
    </>
  );
};
ImageGalleryItem.prototype = {
  images: PropTypes.array.isRequired,
  openModal: PropTypes.func.isRequired,
};

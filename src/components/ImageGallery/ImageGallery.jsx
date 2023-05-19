import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { toast } from 'react-toastify';
import { Button } from '../Button/Button';
import { fetchPixabayApi } from '../../services/pixabayApi';
import { RotatingLines } from 'react-loader-spinner';
import styles from './ImageGallery.module.css';
import { Modal } from 'components/Modal/Modal';
export const ImageGallery = ({ searchName }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageAlt, setImageAlt] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (searchName.trim() === '') {
      return;
    }
    setStatus('pending');
    // setPage(1);
    setImages([]);
  }, [searchName]);

  const prevSearchNameRef = useRef();

  useEffect(() => {
    if (searchName.trim() === '') {
      return;
    }
    if (prevSearchNameRef.current !== searchName) {
      setPage(1);
    }
    prevSearchNameRef.current = searchName;
    const abortController = new AbortController();
    const fetchImages = async () => {
      try {
        const images = await fetchPixabayApi(searchName, page, abortController);
        setImages(prevState => [...prevState, ...images]);
        setStatus('resolved');

        if (!images.length) {
          return toast.warn('we did not find an image with this name');
        }
        if (page !== 1) {
          setTimeout(scroll);
        }
      } catch (error) {
        setError(error);
        setStatus('rejected');
      }
    };
    fetchImages();
    return () => abortController.abort();
  }, [page, searchName]);

  function scroll() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }
  const setImagesPage = () => {
    setPage(prevState => (prevState += 1));
  };
  const openModal = (url, alt) => {
    setImageAlt(alt);
    setImageUrl(url);
    setIsModalOpen(true);
  };
  const closeModal = e => {
    if (e.target.nodeName === 'IMG') {
      return;
    }
    setIsModalOpen(false);
  };
  return (
    <>
      {images.length !== 0 && status === 'resolved' && (
        <ul className={styles.ImageGallery}>
          <ImageGalleryItem images={images} openModal={openModal} />
        </ul>
      )}
      {status === 'pending' && (
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      )}

      {images.length !== 0 && status !== 'pending' && (
        <Button setImagesPage={setImagesPage} />
      )}
      {isModalOpen && (
        <Modal url={imageUrl} alt={imageAlt} closeModal={closeModal} />
      )}
      {status === 'rejected' && toast.error(error.message)}
    </>
  );
};
ImageGallery.propTypes = {
  searchName: PropTypes.string.isRequired,
};

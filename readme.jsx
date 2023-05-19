import { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { toast } from 'react-toastify';
import { Button } from '../Button/Button';
import { fetchPixabayApi } from '../../services/pixabayApi';
import { RotatingLines } from 'react-loader-spinner';
import styles from './ImageGallery.module.css';
import { Modal } from 'components/Modal/Modal';
export class ImageGallery extends Component {
  state = {
    images: [],
    error: null,
    page: 1,
    status: 'idle',
    isModalOpen: false,
    imageAlt: null,
    imageUrl: null,
  };

  async componentDidUpdate(prevProps, prevState) {
    const { page } = this.state;
    const { searchName } = this.props;
    if (prevProps.searchName === searchName) {
      return;
    }
    this.setState({ page: 1, status: 'pending' });
    try {
      const images = await fetchPixabayApi(searchName, page);
      this.setState({ images, status: 'resolved' });
      if (!images.length) {
        return toast.warn('we did not find an image with this name');
      }
    } catch (error) {
      this.setState({ error, status: 'rejected' });
    }
  }
  setPage = async () => {
    // this.setState({ page: (this.state.page += 1) });
    const { searchName } = this.props;
    try {
      const images = await fetchPixabayApi(searchName, (this.state.page += 1));
      this.setState(
        prevState => ({
          images: [...prevState.images, ...images],
          page: (this.state.page += 1),
        }),
        this.scroll
      );
    } catch (error) {
      this.setState({ error });
    }
  };
  scroll = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };
  openModal = (url, alt) => {
    this.setState({ imageAlt: alt, imageUrl: url, isModalOpen: true });
  };
  closeModal = e => {
    if (e.target.nodeName === 'IMG') {
      return;
    }
    this.setState({ isModalOpen: false });
  };
  render() {
    const { images, error, status, isModalOpen } = this.state;
    return (
      <>
        {images.length !== 0 && status === 'resolved' && (
          <ul className={styles.ImageGallery}>
            <ImageGalleryItem images={images} openModal={this.openModal} />
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
          <Button setPage={this.setPage} />
        )}
        {isModalOpen && (
          <Modal
            url={this.state.imageUrl}
            alt={this.state.imageAlt}
            closeModal={this.closeModal}
          />
        )}
        {status === 'rejected' && toast(error.message)}
      </>
    );
  }
}
ImageGallery.propTypes = {
  searchName: PropTypes.string.isRequired,
};

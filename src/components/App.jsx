import { useState } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import './global-styles.css';
import styles from './App.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImageGallery } from './ImageGallery/ImageGallery';
export const App = () => {
  const [searchName, setSearchName] = useState('');

  const changeSearchName = ({ search }) => {
    setSearchName(search.trim());
  };

  return (
    <div className={styles.App}>
      <ToastContainer autoClose={10000} />
      <Searchbar onSubmit={changeSearchName} />
      <ImageGallery searchName={searchName} />
    </div>
  );
};

import PropTypes from 'prop-types';
import style from './Button.module.css';

export const Button = ({ setImagesPage }) => {
  return (
    <button onClick={() => setImagesPage()} className={style.Button}>
      Load more
    </button>
  );
};
Button.prototype = {
  setPage: PropTypes.func.isRequired,
};
//

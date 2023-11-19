import React from 'react';
import styles from './404.css';

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.number}>404</div>
      <div className={styles.message}>Page not found</div>
    </div>
  );
};

export default NotFoundPage;

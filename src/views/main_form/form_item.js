import React from 'react';

// styles
import styles from './style.scss';

// class
function FormItem({ children, title }) {
  return (
    <div className={styles.formItem}>
      <div className={styles.inputTitle}>
        {title}
      </div>

      <div className={styles.inputItem}>
        {children}
      </div>
    </div>
  );
}

export default FormItem;

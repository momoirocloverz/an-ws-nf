import React from 'react';
import styles from './index.less';

interface ImgProps {
  url: string;
  width: number;
  height: number
}

const ImgView: React.FC<ImgProps> = (props) => {

  const { url, width, height } = props;

  return (
    <div className={styles.main} style={{ width: `${width}px`, height: height ? `${height}px` : 'auto', display: url ? 'block': 'none'}} onClick={ ()=> {
      window.open(url);
    }}>
      <img src={url} alt="图片" style={{ width: `${width}px`}} />
    </div>
  );
};


export default ImgView;

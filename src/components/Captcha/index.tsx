import svgCaptcha from 'svg-captcha-browser';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Input } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import styles from './index.less';
import { loginCode } from '@/services/login';
import { connect } from "umi";
import { ConnectState } from "@/models/connect";

function CaptchaComponent({ update }, ref) {
  const [inited, setInited] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [imgInfo, setImgInfo] = useState<any>({});

  const generate = async () => {
    setInited(false);
    const result = await loginCode({});
    if(result.code === 0) {
      setImgInfo({
        img_url: result.data?.img,
        img_key: result.data?.key
      });
    }
    setInited(true);
  };

  useEffect(() => {
    console.log(update,' update')
    generate()
  }, [update])

  useImperativeHandle(ref, () => ({
    // validate: () => {
    //   if ((inputValue ?? '').toLowerCase() === secret.toLowerCase()) {
    //     return true;
    //   }
    //   generate();
    //   return false;
    // },
    captcha: inputValue,
    key: imgInfo.img_key
  }));
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <Input
          className={styles.input}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        {/* <div
          className={styles.image}
          dangerouslySetInnerHTML={{ __html: img }}
        /> */}
        <img src={imgInfo.img_url} alt="" />
        <button
          type="button"
          className={styles.button}
          onClick={generate}
          disabled={!inited}
          style={{ padding: '0 20px' }}
        >
          <RedoOutlined className={styles.icon} />
          换一张
        </button>
      </div>
      <div />
    </div>
  );
}

const Captcha = forwardRef(CaptchaComponent);
export default Captcha;
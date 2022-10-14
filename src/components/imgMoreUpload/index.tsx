import React, { useState, useEffect } from 'react';
import {
  message,
  Upload,
  Button
} from 'antd';
import _, { fromPairs } from 'lodash';
import { getLocalToken } from '@/utils/utils';
import { UploadOutlined } from '@ant-design/icons';
import OSS from 'ali-oss';
import './form.css';
import { getImgId, getOSS } from '../../services/operationCanter'

interface ImgProps {
  values: any;
  getImgData: any;
  max: number
  disabled?: boolean
}

const ImgMoreUpload: React.FC<ImgProps> = (props) => {
  const { values, getImgData, max=3, disabled } = props;
  const [imgUrl, setImgUrl] = useState<Array<any>>(values);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState({});

  const uploadPath = (path: any, file: any) => {
    return `${path}/${file.name.split(".")[0]}-${file.uid}.${file.type.split("/")[1]}`
  };
  const UploadToOss = (path: any, file: any) => {
    const url = uploadPath(path, file)
    return new Promise((resolve, reject) => {
      client.multipartUpload(url, file).then((data: any) => {
        resolve(data);
      }).catch((error: any) => {
        reject(error)
      })
    })
  };

  // 预览
  const onPreview = async (file:any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow: any = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  // 获取OSS信息
  const getOSSMsg = async () => {
    const data = await getOSS();
    if (data.code === 0) {
      const newOSS: any = new OSS({
        region: data.data.region,
        accessKeyId: data.data.accessKeyId,
        accessKeySecret: data.data.accessKeySecret,
        bucket: data.data.bucket,
        stsToken: data.data.security_token
      });
      newOSS.path = data.data.path;
      setClient(newOSS);
    }
  };


  // img 上传 props
  const imgUploadProps = {
    accept: "image/*",
    listType: 'picture-card',
    className: 'upload-list-inline',
    fileList: imgUrl,
    multiple: true,
    headers: { Authorization: getLocalToken() },
    onPreview,
    beforeUpload: (file: any, fileList: any) => {
      setLoading(true);
      if ([...fileList, ...imgUrl].length > max) {
        // 多次调用beforeUpload，提示只显示一次
        if (file === fileList[0]) {
          message.error(`最多只能上传${max}张图`);
        }
        setLoading(false);
        return false
      }
      const item = file;
      const isJpgOrPng = item.type === 'image/jpeg' || item.type === 'image/png' || item.type === 'image/gif';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG/GIF 格式图片!');
        setLoading(false);
        return false
      }
      const isLt1M = item.size / 1024 / 1024 > 50;
      if (isLt1M) {
        message.error('图片体积不能超过 50MB!');
        setLoading(false);
        return false
      }
      let reader = new FileReader();
      reader.readAsDataURL(item);
      reader.onloadend = () => {
        UploadToOss(client.path, item).then(async (data: any) => {
          setLoading(false);
          const nameArr = data.name.split('.')[0];
          const fileName = nameArr.split('/')[1];
          const arr = item.name.split('.');
          arr.pop();
          const fileTitle = arr.join('.');
          const getId = await getImgId({
            'image_no': fileName,
            'suffix': item.type.split('/')[1],
            'size': data.res.size,
            'width': 0,
            'height': 0,
            title: fileTitle
          });
          if (getId.code === 0) {
            const newImg = {
              uid: getId.data.image_id,
              name: item.name,
              status: item.status,
              type: item.type,
              result: data.name,
              url: 'https://img.wsnf.cn/' + data.name
            };
            setImgUrl((old) => ([...old, newImg]));
            getImgData((old) => ([...old, newImg]));
          }
        })
      }
      return false
    },
    onRemove: (res: any) => {
      const _arr = [...imgUrl];
      _arr.forEach((item: any, index: number) => {
        if (item.uid === res.uid) {
          _arr.splice(index, 1)
        }
      })
      setImgUrl(_arr);
      getImgData(_arr);
      setLoading(false);
    }
  }

  useEffect(() => {
    getOSSMsg();
    setImgUrl(values);
  }, [values])

  return (
    <div>
      <Upload {...imgUploadProps} disabled={loading || disabled}>
        {
          imgUrl.length < max ? (
            <Button type="link" loading={loading} disabled={loading || disabled}>
              <UploadOutlined /> 点击上传
            </Button>
          ) : null
        }
      </Upload>
      <p className="img-remark">{`只能上传1-${max}张jpg/png/gif图片，且大小不超过50M`}</p>
    </div>
  );
};

ImgMoreUpload.defaultProps = {
  disabled: false,
};

export default ImgMoreUpload;

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
}

const ImgUpload: React.FC<ImgProps> = (props) => {
  const { values, getImgData } = props;
  const [imgUrl, setImgUrl] = useState<Array<any>>(values);
  const [uploadBtnShow, setUploadBtnShow] = useState(values.length > 0 ? false : true);
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
  const onPreview = async (file: any) => {
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
        stsToken: data.data.security_token,
      });
      newOSS.path = data.data.path;
      setClient(newOSS);
    }
  };

  // img 上传 props
  const imgUploadProps = {
    accept: "video/*",
    listType: 'picture-card',
    className: 'upload-list-inline',
    fileList: imgUrl,
    headers: { Authorization: getLocalToken() },
    beforeUpload: (file: any) => {
      setLoading(true);
      const isLt1M = file.size / 1024 / 1024 / 1024 / 1024 > 5;
      if (isLt1M) {
        message.error('视频上传大小不能超过5G');
        setLoading(false);
        return false
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        UploadToOss(client.path, file).then(async (data: any) => {
          setLoading(false);
          const nameArr = data.name.split('.')[0];
          const fileName = nameArr.split('/')[1];
          const arr = file.name.split('.');
          arr.pop();
          const fileTitle = arr.join('.');
          const getId = await getImgId({
            'image_no': fileName,
            'suffix': file.type.split('/')[1],
            'size': data.res.size,
            'width': 0,
            'height': 0,
            title: fileTitle
          });
          let _arr: any = []
          if (getId.code === 0) {
            _arr = [{
              uid: getId.data.image_id,
              name: file.name,
              status: file.status,
              type: file.type,
              result: data.name,
              url: 'https://img.wsnf.cn/' + data.name
            }]
          } else {
            message.error('获取图片信息失败')
          }
          setImgUrl(_arr);
          getImgData(_arr);
          setUploadBtnShow(false);
        })
      }
      return false
    },
    onRemove: (res: any) => {
      setImgUrl([]);
      getImgData([]);
      setUploadBtnShow(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    getOSSMsg();
  }, [])

  return (
    <div>
      <Upload  {...imgUploadProps} disabled={loading}>
        {
          uploadBtnShow ? (
            <>
              <Button type="link" loading={loading} disabled={loading}>
                <UploadOutlined /> 点击上传
              </Button>
            </>
          ) : null
        }
      </Upload>
      <p className="img-remark">只能上传1张jpg/png/gif图片，且大小不超过50M</p>
    </div>
  );
};


export default ImgUpload;

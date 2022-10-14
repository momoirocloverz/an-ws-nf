import React, { useRef, useState, useEffect } from 'react';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, DatePicker, message, Modal,  Upload
} from 'antd';
import { getLocalToken } from '@/utils/utils';
import OSS from 'ali-oss';
import { getPdfId, getOSS } from '@/services/operationCanter'
import ProTable from '@ant-design/pro-table';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { tableDataHandle } from '@/utils/utils';
import TableImage from '@/components/ImgView/TableImage';
import AnnouncementModal from '@/components/agricultureSubsidies/announcements/AnnouncementModal';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { deleteAnnouncement, getAnnouncements } from '@/services/agricultureSubsidies';

const { RangePicker } = DatePicker;

function Index() {
  const [ loading, setLoading ] = useState(false);
  const [ urlData, setUrlData ] = useState<Array<any>>([]);
  const [client, setClient] = useState({});

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

  const uploadPath = (path: any, file: any) => {
    return `${path}/${file.name.split(".")[0]}-${file.uid}.${file.type.split("/")[1]}`
  };

  const UploadToOss = (path: any, file: any) => {
    const url = uploadPath(path, file);
    console.log(url, 'url')
    return new Promise((resolve, reject) => {
      client.multipartUpload(url, file).then((data: any) => {
        resolve(data);
      }).catch((error: any) => {
        reject(error)
      })
    })
  };

  const uploadProps = {
    accept: "",
    fileList: urlData,
    headers: { Authorization: getLocalToken() },
    onPreview,
    beforeUpload: (file: any) => {
      console.log(file, 'file');
      setLoading(true);
      // if (!noRestriction) {
      //   console.log(file, 'file')
      //   const isPdf = file.type === 'application/pdf'
      //   if (!isPdf) {
      //     message.error('只能上传 PDF 格式图片!');
      //     setLoading(false);
      //     return false
      //   }
      //   const isLt1M = file.size / 1024 / 1024 > 50;
      //   if (isLt1M) {
      //     message.error('图片体积不能超过 50MB!');
      //     setLoading(false);
      //     return false
      //   }
      // }

      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        UploadToOss(client.path, file).then(async (data: any) => {
          setLoading(false);
          console.log(data, 'data')
          const nameArr = data.name.split('.')[0];
          const fileName = nameArr.split('/')[1];
          const arr = file.name.split('.');
          arr.pop();
          const fileTitle = arr.join('.');
          // const getId = await getPdfId({
          //   'file_no': fileName,
          //   'suffix': file.type.split('/')[1],
          //   'size': data.res.size,
          //   'width': 0,
          //   'height': 0,
          //   title: fileTitle
          // });
          let _arr: any = [];
          // if (getId.code === 0) {
          _arr = [{
            name: file.name,
            status: file.status,
            type: file.type,
            result: data.name,
            url: 'https://img.wsnf.cn/' + data.name
          }]
          // } else {
          //   message.error('获取图片信息失败')
          // }
          setUrlData(_arr);
          // getPdfData(_arr);
          // setUploadBtnShow(false);
        })
      }
      return false
    },
    onRemove: (res: any) => {
      setUrlData([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    getOSSMsg();
  }, []);

  return (
    <div>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} loading={loading} disabled={loading}>Click to Upload</Button>
      </Upload>
    </div>
  );
}

export default Index;

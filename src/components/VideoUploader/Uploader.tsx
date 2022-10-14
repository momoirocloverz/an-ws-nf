import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { getAliYunJudge } from '@/services/train';
// import '@/assets/js/aliyun-upload-sdk-1.5.0.min'
import '@/assets/js/vod-sdk-upload-1.0.6.min';
import '@/assets/js/aliyun-oss-sdk-5.3.1.min';
import { SimpleUploadedFileType } from '@/pages/agricultureSubsidies/types';
import styles from './Uploader.less';

type PropType = {
  initialFileList?: Array<SimpleUploadedFileType>;
  sizeLimit?: number;
  onChange?: (fileList:Array<SimpleUploadedFileType>) => unknown
}

// 单个版本，不支持多个视频
export default function VideoUploader({ initialFileList, sizeLimit, onChange }: PropType) {
  const [fileList, setFileList] = useState<Array<SimpleUploadedFileType>>([]);
  const [isUploading, setIsUploading] = useState(false);
  // const [progress, setProgress] = useState(0)
  const uploaderRef = useRef();

  useEffect(() => {
    setFileList(initialFileList ?? []);
  }, [initialFileList]);

  const uploadVideo = async (file) => {
    if (file.size > sizeLimit * 1024 * 1024) {
      return message.error(`文件大小超过了${sizeLimit}mb!`);
    }
    const uploadMetadata = await getAliYunJudge({
      title: file.name.substr(0, file.name.lastIndexOf('.')),
      file_name: file.name,
    });
    // eslint-disable-next-line no-undef
    uploaderRef.current = new AliyunUpload.Vod({
      userId: '257923421530289796',
      // 开始上传
      onUploadstarted(uploadInfo) {
        // @ts-ignore
        uploaderRef.current.setUploadAuthAndAddress(uploadInfo, uploadMetadata.data.UploadAuth, uploadMetadata.data.UploadAddress, uploadMetadata.data.VideoId);
      },
      // 文件上传成功
      async onUploadSucceed(uploadInfo) {
        message.success('视频上传成功');
        setIsUploading(false);
        setFileList((o) => ([...o, {
          uid: uploadInfo.videoId, // unique identifier, negative is recommend, to prevent interference with internal generated id
          name: file.name, // file name
          url: `${uploadInfo.endpoint.replace('://', `://${uploadInfo.bucket}.`)}/${uploadInfo.object}`,
          status: 'done', // options：uploading, done, error, removed. Intercepted file by beforeUpload don't have status field.
        }]));
      },
      // 文件上传失败
      onUploadFailed(uploadInfo, code, message) {
        message.error('视频上传失败，请重新上传');
      },
      // 文件上传进度，单位：字节
      onUploadProgress(uploadInfo, totalSize, loadedPercent) {
        const num = `${Math.ceil(loadedPercent * 100.00)}%`;
      },
      // 上传凭证超时
      onUploadTokenExpired() {
        // 上传方式1  实现时，从新获取UploadAuth
        uploaderRef.current.resumeUploadWithAuth(uploadMetadata.data.UploadAuth);
      },
    });
    uploaderRef.current.addFile(file);
    setIsUploading(true);
    uploaderRef.current.startUpload();
    return Promise.resolve();
  };

  useEffect(() => () => {
    // 取消还在上传中的文件
    uploaderRef.current?.cancelFile(0);
    uploaderRef.current = null;
  }, []);
  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(fileList);
    }
  }, [fileList]);

  return (
    <Upload
      className={styles.customUploader}
      fileList={fileList}
      accept={'video/*'}
      beforeUpload={(file) => {
        uploadVideo(file);
        return false;
      }}
      listType="picture"
      onRemove={() => {
        // if(uploaderRef.current){
        // uploaderRef.current.deleteFile(0); // state是成功的无法这样删除
        // }
        setFileList([]);
      }}
    >
      {fileList.length > 0 || <Button loading={isUploading} icon={<UploadOutlined />}>{`上传视频(限制${sizeLimit}mb内)`}</Button>}
    </Upload>
  );
}
VideoUploader.defaultProps = {
  initialFileList: [],
  sizeLimit: 100,
  onChange: () => {},
};

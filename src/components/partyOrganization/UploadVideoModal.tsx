import React, { useEffect, useState } from 'react';
import {
  Form, Input, message, Modal, Spin,
} from 'antd';
import { RawUploadedImageType } from '@/pages/agricultureSubsidies/types';
import ImgUpload from '@/components/imgUpload';
import { transformUploadedImageData } from '@/pages/agricultureSubsidies/utils';
import VideoUploader from '@/components/VideoUploader/Uploader';
import { createBannerVideo, getBannerVideo, modifyBannerVideo } from '@/services/partyOrganization';

// type Context = {
//   action: 'create' | 'modify';
//   id: number;
//   title: string;
//   poster: RawUploadedImageType;
//   videoSrc: string;
// }

type PropType = {
  // context: Context | {};
  visible: boolean;
  onCancel: ()=>unknown;
  onSuccess: ()=>unknown;
}

function UploadVideoModal({
  visible, onCancel, onSuccess,
}:PropType) {
  const [form] = Form.useForm();
  const [context, setContext] = useState({});
  const [id, setId] = useState();
  const [initialized, setInitialized] = useState(false);
  const [poster, setPoster] = useState([]);
  const [video, setVideo] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (visible) {
      getBannerVideo().then((result) => {
        if (isMounted) {
          if (result.code === 0) {
            if (!Array.isArray(result.data)) {
              throw new Error('返回的数据格式错误');
            }
            let action = 'modify';
            if (result.data.length === 0) {
              action = 'create';
              setPoster([]);
              setVideo([]);
              setContext({ action, initialVideo: [] });
            } else {
              if (result.data.length > 1) {
                console.warn('读取到多个视频, 将采用第一条数据');
              }
              setPoster(transformUploadedImageData([result.data[0].video_img]));
              setVideo(result.data[0].video_url);
              setContext({
                action, id: result.data[0].id, initialVideo: [{ uid: 1, url: result.data[0].video_url, name: '视频' }], title: result.data[0].title,
              });
            }
          } else {
            throw new Error(result.msg);
          }
        }
      }).catch((e) => {
        message.error(`获取视频信息失败: ${e.message}`);
      }).finally(() => {
        setInitialized(true);
      });
    }
    return () => {
      if (visible) {
        isMounted = false;
        setInitialized(false);
      }
    };
  }, [visible]);

  useEffect(() => {
    form.validateFields(['poster']);
  }, [poster]);
  useEffect(() => {
    form.validateFields(['video']);
  }, [video]);

  const submit = async () => {
    let params;
    try {
      params = await form.validateFields();
    } catch (e) {
      return;
    }
    params.poster = poster?.[0]?.uid;
    params.video = video;
    params.id = context.id;
    try {
      if (context.action === 'create') {
        const result = await createBannerVideo(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyBannerVideo(params);
        if (result.code === 0) {
          message.success('修改成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
    } catch (e) {
      message.error(`提交失败: ${e.message}`);
    }
  };

  return (
    <Modal
      title="编辑"
      visible={visible}
      width={800}
      maskClosable={false}
      onCancel={onCancel}
      onOk={submit}
      destroyOnClose
    >
      <Spin spinning={!initialized} tip="读取中..." style={{ width: '100%' }}>
        { initialized
        && (
        <Form
          form={form}
          initialValues={{
            title: context.title,
          }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          <Form.Item
            label="视频标题"
            name="title"
            rules={[{ required: true, message: '请输入视频标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="视频封面"
            name="poster"
            rules={[{
              validator: () => {
                if (poster.length > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('视频封面为必传项'));
              },
            }]}
            required
          >
            <ImgUpload getImgData={(v) => setPoster(v)} values={poster} />
          </Form.Item>
          <Form.Item
            label="视频"
            name="video"
            rules={[{
              validator: () => {
                if (video) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('视频为必传项'));
              },
            }]}
            required
          >
            <VideoUploader initialFileList={context.initialVideo} sizeLimit={100} onChange={(v) => setVideo(v[0]?.url)} />
          </Form.Item>
        </Form>
        )}
      </Spin>

    </Modal>
  );
}

export default UploadVideoModal;

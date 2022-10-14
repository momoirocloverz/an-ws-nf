import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Select, DatePicker, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { IMG_UPLOAD_URL, VIDEO_UPLOAD_URL } from '@/services/api';
import { FormValueType } from '../data.d';
import Moment from 'moment';
import { getLocalToken } from '@/utils/utils';

import './form.css';

const { Option } = Select;

const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  values: FormValueType;
  isEdit: boolean;
  typeList: any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, values, isEdit, typeList } = props;
  const [imgUrl, setImgUrl] = useState<Array<any>>([]);
  const [videoDetail, setVideoDetail] = useState<Array<any>>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadBtnShow, setUploadBtnShow] = useState(true);
  const [videoUploadBtnShow, setVideoUploadBtnShow] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formValue, setFormValue] = useState({
    title: values.title,
    cover_image_id: values.cover_image_id,
    timed_release: isEdit ? Moment(values.timed_release * 1000) : '',
    video_id: values.video_id,
    category_id: values.category_id,
  });

  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    if (imgUrl && imgUrl.length === 0) {
      message.error('缺少封面图片');
      return false;
    }
    if (videoDetail && videoDetail.length === 0) {
      message.error('缺少播放视频');
      return false;
    }
    fieldsValue.timed_release = Moment(fieldsValue.timed_release).valueOf() / 1000;
    fieldsValue.cover_image_id = imgUrl[0].uid;
    fieldsValue.video_id = videoDetail[0].uid;
    delete fieldsValue.img_url;
    delete fieldsValue.video_url;
    if (isEdit) {
      fieldsValue.train_id = values.train_id;
    }
    form.resetFields();
    handleAdd(fieldsValue);
  };

  // 上传视频
  const beforeUpload = async (file: any) => {
    setVideoLoading(true);
    const isJpgOrPng = file.type === 'video/mp4' || file.type === 'video/3gp' || file.type === 'video/m3u8';
    if (!isJpgOrPng) {
      message.error('请上传mp4、3gp、m3u8格式的视频');
      setVideoLoading(false);
    };
    const isLt500M = file.size / 1024 / 1024 < 500;
    if (!isLt500M) {
      message.error('请将视频控制在500M以内');
      setVideoLoading(false);
    };
    let baseUrl: any = '';
    await new Promise(resolve => {
      resolve(VIDEO_UPLOAD_URL())
    }).then(val => {
      baseUrl = val;
    })
    const _url: any = baseUrl + '&title=' + file.name.split('.')[0] + '&file_name=' + file.name;
    setVideoUrl(_url);
    return isJpgOrPng && isLt500M;
  };

  const VideoUploadProps = {
    action: videoUrl,
    name: 'file',
    listType: 'picture',
    beforeUpload: beforeUpload,
    onSuccess: (res: any) => {
      if (res.code == 0) {
        let _arr = {
          uid: res.data.videoId,
          name: '视频',
          status: 'done',
          url: ''
        }
        setVideoDetail([_arr]);
      } else {
        message.error('上传失败，请重新上传');
        setVideoDetail([]);
      }
      setVideoLoading(false);
      setVideoUploadBtnShow(false);
    },
    onRemove: () => {
      setVideoUploadBtnShow(true);
      setVideoDetail([]);
    },
    fileList: videoDetail,
    headers: { Authorization: getLocalToken() },
  };

  // 上传图片
  const imgUploadProps = {
    action: IMG_UPLOAD_URL(),
    listType: 'picture',
    fileList: imgUrl,
    headers: { Authorization: getLocalToken() },
    beforeUpload: (file: any) => {
      setLoading(true);
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG/GIF 格式图片!');
        setLoading(false);
      }
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        message.error('图片体积不能超过 1MB!');
        setLoading(false);
      }
      return isJpgOrPng && isLt2M;
    },
    onSuccess: (res: any) => {
      setLoading(false);
      let _img = res.data || {};
      let _arr = {
        uid: _img.id,
        name: '图片',
        status: 'done',
        url: _img.url
      }
      setImgUrl([_arr]);
      setUploadBtnShow(false);
    },
    onRemove: () => {
      setImgUrl([]);
      setUploadBtnShow(true);
    }

  };

  useEffect(() => {
    const _url: any = VIDEO_UPLOAD_URL();
    setVideoUrl(_url)
    if (isEdit) {
      setImgUrl([{
        uid: values.cover_image_id,
        name: '图片',
        status: 'done',
        url: values.cover_image_url,
      }]);
      setVideoDetail([{
        uid: values.video_id,
        name: '视频',
        status: 'done',
        url: values.video_play_url,
      }]);
      setUploadBtnShow(false);
      setVideoUploadBtnShow(false);
    } else {
      setUploadBtnShow(true);
      setVideoUploadBtnShow(true);
    }
  }, []);

  return (
    <Modal
      destroyOnClose
      width={800}
      title={isEdit ? '编辑课堂' : '新增课堂'}
      visible={modalVisible}
      maskClosable= {false}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
        setUploadBtnShow(true);
        setImgUrl([]);
      }}
    >
      <Form
        form={form}
        initialValues={formValue}
      >
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="课程标题"
          name="title"
          rules={[{ required: true, message: '请输入30字以内的课程标题', max: 30 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="category_id"
          label="课程类型"
          rules={[{ required: true, message: '请选择课程类型' }]}
          >
          <Select
            placeholder="请选择课程类型"
            allowClear
          >
            {
              Object.keys(typeList).map((item: any) => {
                return <Option key={item} value={parseInt(item, 10)}>{typeList[item].text}</Option>
              })
            }
          </Select>
        </Form.Item>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="定时发布"
          name="timed_release"
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="课程视频"
          name="video_url"
          required
        >
          <Upload {...VideoUploadProps}>
            {
              videoUploadBtnShow ? (
                <>
                  <Button loading={videoLoading}>
                    <UploadOutlined /> 点击上传视频
                  </Button>
                  <p style={{paddingTop: '10px'}}>只能上传1个，建议上传格式为mp4、3gp、m3u8且大小不超过500M的视频</p>
                </>
              ) : null
            }
          </Upload>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="课程封面"
          name="img_url"
          required
        >
          <Upload {...imgUploadProps}>
            {
              uploadBtnShow ? (
                <>
                  <Button loading={loading}>
                    <UploadOutlined /> 点击上传封面图
                  </Button>
                  <p style={{paddingTop: '10px',paddingBottom: '10px;'}}>只能上传1张jpg/png/gif图片，且大小不超过1M</p>
                </>
              ) : null
            }
          </Upload>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;

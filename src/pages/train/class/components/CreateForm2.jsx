import React, { useState, useEffect, Fragment } from 'react';
import { Form, Input, Modal, Select, DatePicker, Upload, Button, message } from 'antd';
import { getAliYunJudge, getVideoInfo } from '@/services/train';
import { UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { IMG_UPLOAD_URL, VIDEO_UPLOAD_URL } from '@/services/api';
import { FormValueType } from '../data.d';
import Moment from 'moment';
import { getLocalToken } from '@/utils/utils';
import _ from 'lodash';

import './form.css';

const { Option } = Select;

const FormItem = Form.Item;
let aLiUpload = {};

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, values, isEdit, typeList } = props;
  const [imgUrl, setImgUrl] = useState([]);
  const [uploadBtnShow, setUploadBtnShow] = useState(true);
  const [loading, setLoading] = useState(false);
  // 视频
  const [videoId, setVideoId] = useState(0);
  const [playUrl, setPlayUrl] = useState('');
  const [videoImg, setVideoImg] = useState('');
  const [progress, setProgress] = useState('0');
  const [isShowCheckBtn, setIsShowCheckBtn] = useState(false);
  const [codingSuccess, setCodingSuccess] = useState(false);

  const [formValue, setFormValue] = useState({
    title: values.title,
    cover_image_id: values.cover_image_id,
    timed_release: isEdit ? Moment(values.timed_release * 1000) : '',
    video_id: values.video_id,
    category_id: values.category_id,
  });

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    if (imgUrl && imgUrl.length === 0) {
      message.error('缺少封面图片');
      return false;
    }
    if (videoId === 0) {
      message.error('缺少课堂视频');
      return false;
    }
    if (!codingSuccess) {
      message.error('视频转码中，请点击查看按钮检查转码状态');
      return false;
    }
    fieldsValue.timed_release = Moment(fieldsValue.timed_release).valueOf() / 1000;
    fieldsValue.cover_image_id = imgUrl[0].uid;
    fieldsValue.video_id = videoId;
    delete fieldsValue.img_url;
    delete fieldsValue.video_url;
    if (isEdit) {
      fieldsValue.train_id = values.train_id;
    }
    form.resetFields();
    handleAdd(fieldsValue);
  };

  // 删除视频
  const delVideo = () => {
    setVideoId(0);
    setPlayUrl('');
    setVideoImg('');
    setProgress('0');
    setIsShowCheckBtn(false);
    setCodingSuccess(false);
  }

  // 播放视频
  const playVideo = () => {
    if (playUrl === '') {
      message.error('请上传视频');
    } else {
      window.open(playUrl);
    }
  }

  // 获取视频详情
  const getVdInfo = async (val) => {
    // console.log(val);
    if (!val.VideoId) {
      return false;
    }
    const _params =  {
      video_id: val.VideoId
    };
    let _data = await getVideoInfo(_params);
    if (_data.code === 0) {
      message.success('转码成功');
      setVideoId(_data.data.VideoBase.VideoId);
      setPlayUrl(_data.data.PlayInfoList.PlayInfo[0].PlayURL);
      setVideoImg(_data.data.VideoBase.CoverURL);
      setCodingSuccess(true);
    } else if (_data.code === 37) {
      message.error('视频上传成功，正在转码中，请耐心等待');
    } else {
      message.error(_data.msg);
    }
  };

  // 更新视频详情

  const updataVideo = async () => {
    await getVdInfo({VideoId: videoId});
  }

  // 视频实例化
  const aliyun = async (obj) => {
    aLiUpload = new AliyunUpload.Vod({
      // 开始上传
      'onUploadstarted': function(uploadInfo) {
        console.log('onUploadstarted----------',uploadInfo)
        aLiUpload.setUploadAuthAndAddress(uploadInfo, obj.UploadAuth, obj.UploadAddress, obj.VideoId);
      },
      // 文件上传成功
      'onUploadSucceed': async function(uploadInfo) {
        setProgress('上传成功！');
        setIsShowCheckBtn(true);
        await getVdInfo(obj);
      },
      // 文件上传失败
      'onUploadFailed': function(uploadInfo, code, message) {
        message.error('视频上传失败，请重新上传');
      },
      // 文件上传进度，单位：字节
      'onUploadProgress': function(uploadInfo, totalSize, loadedPercent) {
        const num = Math.ceil(loadedPercent * 100.00) + '%';
        setProgress(num);
      },
      // 上传凭证超时
      'onUploadTokenExpired': function() {
        // 上传方式1  实现时，从新获取UploadAuth
        aLiUpload.resumeUploadWithAuth(obj.UploadAuth);
      }
    });
  };

  // 获取视频凭证
  const getVideoAuth = async (value) => {
    const result = {
      title: value.name.split('.')[0],
      file_name: value.name
    };
    const _data = await getAliYunJudge(result);
    if (_data.code === 0) {
      const userData = '{"Vod":{"Title":"this is video.","CateId":"234"}}';
      await aliyun(_data.data);
      setVideoId(_data.data.VideoId);
      aLiUpload.addFile(value, null, null, null, userData);
      aLiUpload.startUpload();
    };
  };

  // 上传视频
  const videoChange = async (val) => {
    const file = val.target.files[0];
    const isJpgOrPng = file.type === 'video/mp4' || file.type === 'video/3gp' || file.type === 'video/m3u8';
    if (!isJpgOrPng) {
      message.error('请上传mp4、3gp、m3u8格式的视频');
      return false;
    };
    const isLt500M = file.size / 1024 / 1024 < 500;
    if (!isLt500M) {
      message.error('请将视频控制在500M以内');
      return false;
    };
    await getVideoAuth(file);
  };

  // 上传图片
  const imgUploadProps = {
    action: IMG_UPLOAD_URL(),
    listType: 'picture',
    fileList: imgUrl,
    headers: { Authorization: getLocalToken() },
    beforeUpload: (file) => {
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
    onSuccess: (res) => {
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
    if (isEdit) {
      setImgUrl([{
        uid: values.cover_image_id,
        name: '图片',
        status: 'done',
        url: values.cover_image_url,
      }]);
      setUploadBtnShow(false);
      // 视频
      setVideoId(values.video_id);
      setPlayUrl(values.video_play_url);
      setVideoImg(values.video_image_url);
      setIsShowCheckBtn(true);
      setCodingSuccess(true);
    } else {
      setUploadBtnShow(true);
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
              Object.keys(typeList).map((item) => {
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
          <Fragment>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div className="video-upload">
                {
                  codingSuccess ? (
                    <img src={videoImg} alt="视频封面图" onClick={playVideo} />
                  ) : (
                    <Fragment>
                      <input type="file" name="file" id="files" onChange={videoChange} />
                      <VideoCameraOutlined style={{ position: 'absolute', left: '28px', top: '26px', zIndex: 10, fontSize: '42px', color: '#f1f1f1' }} />
                      {progress !== '0' ? (<span className="progress">{progress}</span>) : null}
                    </Fragment>
                  )
                }
                {
                  isShowCheckBtn ? (
                    <span className="close-btn" onClick={delVideo}>x</span>
                  ) : null
                }
              </div>
              {
                isShowCheckBtn ? (
                  <div className="check-video">
                    <button onClick={updataVideo}>查看</button>
                    <span>请点击查看按钮检查是否转码完成</span>
                  </div>
                ) : null
              }
            </div>
            <p style={{paddingTop: '15px', margin: 0}}>只能上传1个，建议上传格式为mp4、3gp、m3u8且大小不超过500M的视频</p>
          </Fragment>
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
                <Fragment>
                  <Button loading={loading}>
                    <UploadOutlined /> 点击上传封面图
                  </Button>
                  <p style={{paddingTop: '10px'}}>只能上传1张jpg/png/gif图片，且大小不超过1M</p>
                </Fragment>
              ) : null
            }
          </Upload>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;

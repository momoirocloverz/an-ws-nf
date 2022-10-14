import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Select, Switch , message } from 'antd';
import { FormValueType } from '../data.d';
import Moment from 'moment'
import { IMG_UPLOAD_URL } from '@/services/api';
import { getLocalToken } from '@/utils/utils';
import ImgUpload from '@/components/imgUpload';

import './form.css';

const { Option } = Select;
const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  values: FormValueType;
  isEdit: boolean;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit, onCancel, values, isEdit } = props;
  const [bannerLink, setBannerLink] = useState(0);
  const [imgUrl, setImgUrl] = useState<Array<any>>([]);
  const [uploadBtnShow, setUploadBtnShow] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showCount, setShowCount] = useState<number>(0);
  const [formValue, setFormValue] = useState({
    name: values.name,
    icon_image: values.icon_image,
    created_at: isEdit ? Moment(values.created_at) : '',
    jump_value: values.jump_value,
    jump_type: values.jump_type || 0,
    image_id: values.icon || 0,
    sort: values.sort,
    is_show: values.is_show
  });

  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    if(imgUrl.length === 0) {
      message.warning('请上传图片')
      return;
    }
    fieldsValue['icon'] = imgUrl[0].uid;
    if (isEdit) {
      fieldsValue['id'] = values['id']
    }
    if(fieldsValue['jump_type'] === 0) {
      fieldsValue['jump_value'] = '/'
    }
    form.resetFields();
    onSubmit(fieldsValue);
  };

  const onLinkChange = (val: number) => {
    setBannerLink(val)
    form.setFieldsValue({
      jump_value: ''
    })
  }

  const getImgData = (arr=[]) => {
    setImgUrl(arr)
  }

  useEffect(() => {
    if (isEdit) {
      setBannerLink(values.jump_type);
      setImgUrl([{
        uid: values.icon,
        name: '图片',
        status: 'done',
        url: values.icon_image
      }]);
      setUploadBtnShow(false);
    } else {
      setUploadBtnShow(true);
    }
  }, []);

  return (
    <Modal
      destroyOnClose
      maskClosable= {false}
      title={isEdit ? '编辑金刚区' : '新建金刚区'}
      visible={modalVisible}
      width={500}
      confirmLoading={confirmLoading}
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
          label="金刚区名称"
          name="name"
          rules={[{ required: true, message: '请输入30字以内的名称', max: 30 }]}
        >
          <Input placeholder="请输入" allowClear />
        </FormItem>
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="jump_type"
          label="跳转类型"
          rules={[{ required: true, message: '请选择跳转方式' }]}
          >
          <Select
            placeholder="请选择跳转方式"
            onChange={onLinkChange}
            allowClear
          >
            <Option value={0}>不跳转</Option>
            <Option value={1}>原生</Option>
            <Option value={2}>链接</Option>
            <Option value={3}>文章</Option>
            <Option value={4}>课程</Option>
          </Select>
        </Form.Item>
        {
          bannerLink === 1 ? (
            <Form.Item
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="原生路径"
              name="jump_value"
              rules={[{ required: true, message: '请输入原生路径' }]}
            >
              <Input placeholder="请输入原生路径" />
            </Form.Item>
          ) : null
        }
         {
          bannerLink === 2 ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="链接"
              name="jump_value"
              rules={[{ required: true, message: '请输入链接' }]}
            >
              <Input placeholder="请输入链接" />
            </FormItem>
          ) : null
        }
        {
          bannerLink === 3 ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="文章ID"
              name="jump_value"
              rules={[{ required: true, message: '请输文章ID' }]}
            >
              <Input placeholder="请输文章ID" />
            </FormItem>
          ) : null
        }
        {
          bannerLink === 4 ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="课程ID"
              name="jump_value"
              rules={[{ required: true, message: '请输入课程ID' }]}
            >
              <Input placeholder="请输入课程ID" />
            </FormItem>
          ) : null
        }
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="排序"
          name="sort"
          rules={[{ required: true, message: '请输入序号' }]}
        >
          <Input placeholder="请输入序号" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="是否显示"
          name="is_show"
        >
          <Select style={{ width: 120 }}>
            <Option value={1}>是</Option>
            <Option value={0}>否</Option>
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="封面图片"
          name="icon"
          required
        >
          <ImgUpload values={imgUrl} getImgData={getImgData} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;

import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Select, DatePicker, message, Cascader } from 'antd';
import { FormValueType } from '../data.d';
import Moment from 'moment'
import ImgUpload from '@/components/imgUpload';
import { jumpType } from '@/services/operationCanter';
import {
  LINK_TYPE,
  BANNER_TYPE
} from '../../data.js'
import _ from 'lodash';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import './form.css';

const { Option } = Select;
const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  values: any;
  isEdit: boolean;
  accountInfo: any;
  areaList: any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit, onCancel, values, isEdit, accountInfo, areaList } = props;
  const [bannerLink, setBannerLink] = useState<any>('');
  const [imgUrl, setImgUrl] = useState<Array<any>>([]);
  const [uploadBtnShow, setUploadBtnShow] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showCount, setShowCount] = useState<number>(0);
  const [formValue, setFormValue] = useState({
    title: values.title,
    banner_url: values.image_url,
    timed_release: isEdit ? Moment(values.timed_release) : '',
    jump_value: values.jump_value,
    jump_type: values.jump_type ? `${values.jump_type}` : '0',
    image_id: _.get(values, 'image_id', 0),
    // banner_type: _.get(values, 'banner_type', ''),
    area: [values.city_id, values.town_id, values.village_id].filter((e) => e !== undefined),
  });

  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    if(imgUrl.length === 0) {
      message.warning('请上传图片')
      return;
    }
    fieldsValue['image_id'] = imgUrl[0].uid;
    const time = Moment(fieldsValue['timed_release']).valueOf() / 1000;
    fieldsValue['timed_release'] = Math.floor(time);
    if (isEdit) {
      fieldsValue['banner_id'] = values['banner_id']
    }
    if (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) {
      fieldsValue.city_id = fieldsValue.area[0];
      fieldsValue.town_id = fieldsValue.area[1];
      fieldsValue.village_id = fieldsValue.area[2];
      delete fieldsValue.area;
    } else {
      fieldsValue.city_id = accountInfo.city_id
      fieldsValue.town_id = accountInfo.town_id
      fieldsValue.village_id = accountInfo.village_id
    }
    fieldsValue.banner_type = values.bannerType
    form.resetFields();
    onSubmit({
      ...fieldsValue,
      admin_id: accountInfo.admin_id
    });
  };

  const onLinkChange = (val: string) => {
    val = val ? val : "0"
    setBannerLink(LINK_TYPE[val])
    if (isEdit) {
      if(showCount > 0) {
        form.setFieldsValue({
          jump_value: ''
        })
      }
      const num = showCount + 1
      setShowCount(num)
    } else {
      form.setFieldsValue({
        jump_value: ''
      })
    }
  }

  const getImgData = (arr=[]) => {
    setImgUrl(arr)
  }

  useEffect(() => {
    getJumpType()
    if (isEdit) {
      onLinkChange(`${values.jump_type}`)
      setImgUrl([{
        uid: values.image_id,
        name: '图片',
        status: 'done',
        url: values.image_url
      }]);
      setUploadBtnShow(false);
    } else {
      setUploadBtnShow(true);
    }
  }, []);

  // 获取跳转类型
  const [jumpTypeList, setJumpTypeList] = useState({});
  const getJumpType = async () => {
    const res = await jumpType();
    if (res.code === 0) {
      let data = _.get(res, 'data.rows', {})
      const noJump = { "0": '不跳转' }
      data = {...noJump, ...data}
      setJumpTypeList(data)
    }
  }

  return (
    <Modal
      destroyOnClose
      maskClosable= {false}
      title={isEdit ? '编辑' : '新建'}
      visible={modalVisible}
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
        {
          (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="选择属地"
              name="area"
              rules={[{ required: true, message: '请选择属地' }]}
            >
              <Cascader options={areaList} changeOnSelect />
            </FormItem>
          ) : null
        }
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="广告名称"
          name="title"
          rules={[{ required: true, message: '请输入30字以内的名称', max: 30 }]}
        >
          <Input placeholder="请输入" allowClear />
        </FormItem>
        {/* <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="banner_type"
          label="广告类型"
          rules={[{ required: true, message: '请选择广告类型' }]}
          >
          <Select
            placeholder="请选择广告类型"
            allowClear
          >
            {
              BANNER_TYPE.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
            }
          </Select>
        </Form.Item> */}
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="jump_type"
          label="跳转类型"
          rules={[{ required: true, message: '请选择广告跳转类型' }]}
          >
          <Select
            placeholder="请选择广告跳转类型"
            onChange={onLinkChange}
            allowClear
          >
            {Object.keys(jumpTypeList).map((item, index) => {
              return <Option value={item} key={index}>{jumpTypeList[item]}</Option>
            })}
          </Select>
        </Form.Item>
        {
          bannerLink !== '' ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label={bannerLink.label}
              name="jump_value"
              rules={[{ required: true, message: bannerLink.msg }]}
            >
              <Input placeholder={bannerLink.msg} />
            </FormItem>
          ) : null
        }
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="发布时间"
          name="timed_release"
          rules={[{ required: true, message: '请选择发布时间' }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="封面图片"
          name="image_url"
          required
        >
          <ImgUpload values={imgUrl} getImgData={getImgData} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ info, user }: ConnectState) => ({
  areaList: info.areaList,
  accountInfo: user.accountInfo,
}))(CreateForm);

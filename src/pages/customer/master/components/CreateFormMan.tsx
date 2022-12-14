import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Cascader, Select, Upload, Button, DatePicker, message, } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { IMG_UPLOAD_URL } from '@/services/api';
import { getLocalToken } from '@/utils/utils';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';

const FormItem = Form.Item;
const { Option } = Select;

interface CreateFormProps {
  modalVisible: boolean;
  isEdit: boolean;
  values: any;
  masterTypeList: any;
  masterLevel: any;
  areaList: any;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

const CreateFormMan: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, isEdit, values, masterTypeList, masterLevel, areaList, } = props;
  const [imgUrl, setImgUrl] = useState<Array<any>>([]);
  const [uploadBtnShow, setUploadBtnShow] = useState(true);
  const [changeCity, setChangeCity] = useState(values.level && values.level === 1 ? false : true);
  const [loading, setLoading] = useState(false);
  const [formValue] = useState({
    expert_id: values.expert_id,
    expert_type_id: values.expert_type_id,
    avatar_id: values.avatar_id,
    expert_name: values.expert_name,
    identity_number: values.identity_number,
    front_image_id: values.front_image_id,
    back_image_id: values.back_image_id,
    mobile: values.mobile,
    level: values.level,
    job_title: values.job_title,
    pro_title: values.pro_title,
    specialty: values.specialty,
    answers: values.answers,
    status: values.status,
    reason: values.reason,
    area: values.city_id ? [values.city_id, values.town_id, values.village_id] : [],
  });

  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    let _formValue = {
      ...fieldsValue,
      isEdit,
      imgUrl,
      expert_id: formValue.expert_id,
      admin_id: formValue.avatar_id,
    };

    if (!imgUrl.length) {
      message.error('?????????????????????');
      return false;
    }

    handleAdd(_formValue);
  };

  const imgUploadProps = {
    action: IMG_UPLOAD_URL(),
    listType: 'picture',
    className: 'upload-list-inline',
    fileList: imgUrl,
    headers: { Authorization: getLocalToken() },
    beforeUpload: (file: any) => {
      setLoading(true);
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      if (!isJpgOrPng) {
        message.error('???????????? JPG/PNG/GIF ????????????!');
        setLoading(false);
      }
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        message.error('???????????????????????? 1MB!');
        setLoading(false);
      }
      return isJpgOrPng && isLt1M;
    },
    onSuccess: (res: any) => {
      setLoading(false);
      let _img = res.data;
      let _arr = {
        uid: _img.id,
        name: '??????',
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
  }

  useEffect(() => {
    if (isEdit) {
      setImgUrl([{
        uid: formValue.avatar_id,
        name: '??????',
        status: 'done',
        url: values.avatar_url
      }]);
      setUploadBtnShow(false);
    } else {
      setUploadBtnShow(true);
    }
  }, []);

  const levelChange = (val:any) => {
    if (val === 1) {
      setChangeCity(false);
    } else {
      setChangeCity(true);
    }
  }

  return (
    <Modal
      width={800}
      maskClosable={false}
      destroyOnClose
      title={isEdit ? '????????????' : '????????????'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form
        initialValues={formValue}
        form={form}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="????????????"
          name="expert_name"
          rules={[{ required: true, message: '?????????5??????????????????', max: 5 }]}
        >
          <Input placeholder="?????????" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="????????????"
          name="identity_number"
          rules={[{ required: true, message: '?????????30??????????????????', max: 30 }]}
        >
          <Input placeholder="?????????" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="?????????"
          name="mobile"
          rules={[
            { required: true, message: '????????????????????????????????????', pattern: /^1[3456789]\d{9}$/ },
            { required: true, message: '??????????????????11???', max: 11 }
          ]}
        >
          <Input placeholder="?????????" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="????????????"
          name="expert_type_id"
          rules={[{ required: true, message: '?????????????????????' }]}
        >
          <Select>
            {
              masterTypeList.map((item: any) => {
                return (<Option key={item.expert_type_id} value={item.expert_type_id}>{item.expert_type_title}</Option>)
              })
            }
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="????????????"
          name="level"
          rules={[{ required: true, message: '?????????????????????' }]}
        >
          <Select onChange={levelChange} allowClear>
            {
              masterLevel.map((item: any) => {
                return (<Option key={item.id} value={item.id}>{item.title}</Option>)
              })
            }
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="??????"
          name="job_title"
          rules={[{ required: true, message: '?????????10????????????????????????', max: 10 }]}
        >
          <Input placeholder="?????????" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="??????"
          name="pro_title"
          rules={[{ required: true, message: '?????????10????????????????????????', max: 10 }]}
        >
          <Input placeholder="?????????" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="????????????"
          name="specialty"
          rules={[{ required: true, message: '?????????100????????????????????????', max: 100 }]}
        >
          <Input placeholder="?????????" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="????????????"
          name="avatar_url"
          required
        >
          <Upload {...imgUploadProps}>
            {
              uploadBtnShow ? (
                <>
                  <Button loading={loading}>
                    <UploadOutlined /> ????????????
                  </Button>
                  <p className="img-remark">????????????1???jpg/png/gif???????????????????????????1M</p>
                </>
              ) : null
            }
          </Upload>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="????????????"
          name="area"
          rules={[{ required: changeCity ? true : false, message: '?????????????????????' }]}
        >
          {
            changeCity ? (<Cascader options={areaList} />) : (<span>?????????</span>)
          }
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ info, }: ConnectState) => ({
  masterTypeList: info.masterTypeList,
  masterLevel: info.masterLevel,
  areaList: info.areaList,
}))(CreateFormMan)

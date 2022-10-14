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
      message.error('请上传用户头像');
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
        message.error('只能上传 JPG/PNG/GIF 格式图片!');
        setLoading(false);
      }
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        message.error('图片体积不能超过 1MB!');
        setLoading(false);
      }
      return isJpgOrPng && isLt1M;
    },
    onSuccess: (res: any) => {
      setLoading(false);
      let _img = res.data;
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
  }

  useEffect(() => {
    if (isEdit) {
      setImgUrl([{
        uid: formValue.avatar_id,
        name: '图片',
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
      title={isEdit ? '编辑专家' : '新增专家'}
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
          label="专家姓名"
          name="expert_name"
          rules={[{ required: true, message: '请输入5字以内的名称', max: 5 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="身份证号"
          name="identity_number"
          rules={[{ required: true, message: '请输入30字以内的名称', max: 30 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="手机号"
          name="mobile"
          rules={[
            { required: true, message: '请输入格式正确的手机号码', pattern: /^1[3456789]\d{9}$/ },
            { required: true, message: '手机号长度为11位', max: 11 }
          ]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="专家类型"
          name="expert_type_id"
          rules={[{ required: true, message: '请选择所属小组' }]}
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
          label="认证级别"
          name="level"
          rules={[{ required: true, message: '请选择所属小组' }]}
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
          label="职务"
          name="job_title"
          rules={[{ required: true, message: '请输入10个字符以内的内容', max: 10 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="职称"
          name="pro_title"
          rules={[{ required: true, message: '请输入10个字符以内的内容', max: 10 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="专家特长"
          name="specialty"
          rules={[{ required: true, message: '请输入100个字符以内的内容', max: 100 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="专家头像"
          name="avatar_url"
          required
        >
          <Upload {...imgUploadProps}>
            {
              uploadBtnShow ? (
                <>
                  <Button loading={loading}>
                    <UploadOutlined /> 点击上传
                  </Button>
                  <p className="img-remark">只能上传1张jpg/png/gif图片，且大小不超过1M</p>
                </>
              ) : null
            }
          </Upload>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="所属地区"
          name="area"
          rules={[{ required: changeCity ? true : false, message: '请选择所属地区' }]}
        >
          {
            changeCity ? (<Cascader options={areaList} />) : (<span>平湖市</span>)
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

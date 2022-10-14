import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Cascader, Select, Upload, Button, DatePicker, message, } from 'antd';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import ImgView from '@/components/ImgView';

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
  close: any;
}

const CreateFormApproval: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, close, isEdit, values, masterTypeList, masterLevel, areaList, } = props;
  const [imgUrl, setImgUrl] = useState<Array<any>>([]);
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
    avatar_url: values.avatar_url,
    front_image_url: values.front_image_url,
    back_image_url: values.back_image_url,
    area: values.city_id ? [values.city_id, values.town_id, values.village_id] : [],
  });

  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    let _formValue = {
      ...fieldsValue,
      isEdit,
      expert_id: formValue.expert_id,
    };

    handleAdd(_formValue);
  };

  const closeHandle = () => {
    close(false);
  }

  return (
    <Modal
      width={800}
      destroyOnClose
      maskClosable={false}
      title="专家审核"
      visible={modalVisible}
      onCancel={closeHandle} 
      footer={[
        // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
        <Button key="back" type="primary" onClick={okHandle}>通过</Button>,
        <Button key="submit" onClick={onCancel}>拒绝</Button>, ]}
    >
      <Form
        initialValues={formValue}
        form={form}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="专家姓名"
          name="expert_name"
        >
          <Input disabled placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="身份证号"
          name="identity_number"
        >
          <Input disabled placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="手机号"
          name="mobile"
        >
          <Input disabled placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="专家类型"
          name="expert_type_id"
        >
          <Select disabled>
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
        >
          <Select disabled>
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
        >
          <Input disabled placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="职称"
          name="pro_title"
        >
          <Input disabled placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="专家特长"
          name="specialty"
        >
          <Input disabled placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="专家头像"
          name="avatar_url"
          required
        >
           <ImgView url={formValue.avatar_url} width={120} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="身份证正反面"
          name="avatar_url"
          required
        >
          <ImgView url={formValue.front_image_url} width={120} />
          <ImgView url={formValue.back_image_url} width={120} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }} 
          label="所属地区"
          name="area"
        >
          <Cascader disabled options={areaList} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ info, }: ConnectState) => ({
  masterTypeList: info.masterTypeList,
  masterLevel: info.masterLevel,
  areaList: info.areaList,
}))(CreateFormApproval);

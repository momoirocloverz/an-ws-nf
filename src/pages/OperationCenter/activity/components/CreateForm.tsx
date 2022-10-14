import React, { useState, useEffect } from 'react';
import {
  Form,
  Modal,
  InputNumber,
  Input,
  message,
  DatePicker,
  Cascader
} from 'antd';
import _ from 'lodash';
import ImgUpload from '@/components/imgUpload';
import Moment from 'moment';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const dateFormat = 'YYYY/MM/DD HH:mm:ss';

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  isEdit: boolean;
  values: any;
  accountInfo: any;
  areaList: any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, isEdit, values, accountInfo, areaList } = props;
  const [formValue, setFormValue] = useState({
    activity_name: values.activity_name,
    timed_release: [
      (isEdit && values.timed_release) ? Moment(values.timed_release[0], dateFormat) : '',
      (isEdit && values.timed_release) ? Moment(values.timed_release[1], dateFormat) : ''
    ],
    activity_content: values.activity_content,
    activity_rule: values.activity_rule,
    people: values.people,
    area: (values.city_id && values.town_id && values.village_id) ? [values.city_id,values.town_id,values.village_id] : []
  });
  const [imgUrlValue, setImgUrl] = useState<Array<any>>([]);
  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    if (imgUrlValue.length === 0) {
      message.error('请上传活动封面图');
    } else {
      console.log(fieldsValue)
      fieldsValue['begin_time'] = fieldsValue['timed_release'] ? Moment(fieldsValue['timed_release'][0]).valueOf() / 1000 : '';
      fieldsValue['end_time'] = fieldsValue['timed_release'] ? Moment(fieldsValue['timed_release'][1]).valueOf() / 1000 : '';
      fieldsValue.cover = imgUrlValue[0].uid;
      if (isEdit) {
        fieldsValue['activity_id'] = values.id
      }
      delete fieldsValue['timed_release'];
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
      form.resetFields();
      handleAdd({
        ...fieldsValue,
        admin_id: accountInfo.admin_id
      });
    }
  };

  const getImgData = (arr=[]) => {
    setImgUrl(arr)
  }

  useEffect(() => {
    if (isEdit) {
      setImgUrl([{
        uid: values.cover,
        name: '图片',
        status: 'done',
        url: values.image_url
      }]);
    }
  }, [])

  return (
    <Modal
      destroyOnClose
      width={900}
      maskClosable= {false}
      title={isEdit ? '编辑' : '新建'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
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
              <Cascader options={areaList} />
            </FormItem>
          ) : null
        }
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="活动名称"
          name="activity_name"
          rules={[{ required: true, message: '请输入活动名称' }]}
        >
          <Input placeholder="请输入活动名称" maxLength={30} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="活动时间"
          name="timed_release"
          rules={[{ required: true, message: '请选择活动时间' }]}
        >
          <RangePicker showTime format={dateFormat} />
        </FormItem>
        <FormItem
          labelCol={{span:5}}
          wrapperCol={{span:15}}
          label="活动分值"
          name="score"
          rules={[{required:true,message:'请输入活动分值'}]}
        >
         <InputNumber disabled={isEdit} max={99999} min={1}  placeholder="请填写活动分值" style={{width: '50%', marginRight: '20px'}} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="活动描述"
          name="activity_content"
          rules={[{ required: true, message: '请输入活动描述' }]}
        >
          <TextArea rows={4} maxLength={150} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="活动规则"
          name="activity_rule"
          rules={[{ required: true, message: '请输入活动规则' }]}
        >
          <TextArea rows={4} maxLength={100} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="活动名额"
          name="people"
          rules={[{ required: true, message: '请填写活动名额' }]}
        >
          <InputNumber disabled={isEdit} max={99999} min={1}  placeholder="请填写活动名额" style={{width: '50%', marginRight: '20px'}} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="cover"
          label="活动封面图"
        >
          <ImgUpload values={imgUrlValue} getImgData={getImgData} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ info, user }: ConnectState) => ({
  areaList: info.areaList,
  accountInfo: user.accountInfo,
}))(CreateForm);

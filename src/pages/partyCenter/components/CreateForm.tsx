import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, InputNumber, Upload, message, Button, DatePicker, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { IMG_UPLOAD_URL } from '@/services/api';
import { FormValueType } from '../data.d';
import { getLocalToken } from '@/utils/utils';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import Moment from 'moment';


const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface CreateFormProps {
  modalVisible: boolean;
  values: any;
  isEdit: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  accountInfo: any;
  areaList: any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [ form ] = Form.useForm();
  const [imgUrls, setImgUrls] = useState<Array<any>>([]);
  const [uploadBtnShow, setUploadBtnShow] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const {
    modalVisible,
    onSubmit: handleAdd,
    onCancel,
    isEdit,
    values,
    accountInfo,
    areaList
  } = props;
  const dateFormat = 'YYYY/MM/DD';
  const [formValue, setFormValue] = useState({
    id: values.id,
    feast_name: values.feast_name,
    table_number: values.table_number,
    date: values.start_at ? [
      Moment(values.start_at, dateFormat),
      Moment(values.end_at, dateFormat)
    ] : '',
    presentable_time: values.presentable_time ? values.presentable_time.split(',') : [],
    description: values.description,
    feast_status: values.feast_status,
    unit_amount: values.unit_amount,
    percent: values.percent
  });


  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    if (isEdit) {
      fieldsValue.id = formValue.id;
    }
    fieldsValue.city_id = accountInfo.city_id
    fieldsValue.town_id = accountInfo.town_id
    fieldsValue.village_id = accountInfo.village_id
    fieldsValue.start_at = fieldsValue.date[0].format('YYYY/MM/DD');
    fieldsValue.end_at = fieldsValue.date[1].format('YYYY/MM/DD');
    fieldsValue.presentable_time = fieldsValue.presentable_time.join(',');
    delete fieldsValue.date;
    form.resetFields();
    handleAdd({
      ...fieldsValue,
      admin_id: accountInfo.admin_id
    });
  };

  // 上传图片
  const imgUploadProps = {
    action: IMG_UPLOAD_URL(),
    listType: 'picture',
    className: 'upload-list-inline',
    headers: { Authorization: getLocalToken() },
    beforeUpload: (file: any) => {
      setLoading(true);
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 格式图片!');
        setLoading(false);
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片体积不能超过 2MB!');
        setLoading(false);
      }
      const imgNumLimit = imgUrls.length < 5;
      if (!imgNumLimit) {
        message.error('最多上传5张!');
        setLoading(false);
      }
      return isJpgOrPng && isLt2M && imgNumLimit;
    },
    onSuccess: (res: any) => {
      setLoading(false);
      const _img = res.data;
      const _arr = [...imgUrls];
      _arr.push({
        uid: _img.id,
        name: '图片',
        status: 'done',
        url: _img.url
      })
      setImgUrls(_arr);
      if (imgUrls.length === 4) {
        setUploadBtnShow(false);
      } else {
        setUploadBtnShow(true);
      }
    },
    onRemove: (res: any) => {
      const _img = res || {};
      const _arr = [...imgUrls];
      _arr.forEach((item, index) => {
        if (item.uid === _img.uid) {
          _arr.splice(index, 1);
        }
      });
      setImgUrls(_arr);
      setUploadBtnShow(true);
    }
  }

  const plainOptions = [
    { label: '早上', value: '1' },
    { label: '中午', value: '2' },
    { label: '晚上', value: '3' },
  ]

  const disabledDate = (current) => {
    return current && Moment().startOf('day') >= current;
  }

  return (
    <Modal
      width={900}
      destroyOnClose
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
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="家宴厅"
          name="feast_name"
          rules={[{ required: true, message: '超出长度，最多10个字符', max: 10 }]}
        >
          <Input placeholder="请输入商品名称" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="总桌数"
          name="table_number"
          rules={[{ required: true, message: '请输入0~999的正整数', max: 999, min: 0, type: 'number' }]}
        >
          <InputNumber disabled={formValue.feast_status === 1} style={{width: '60%'}} placeholder="请输入总桌数" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="可预订日期"
          name="date"
          rules={[{ type: 'array' as const, required: true, message: '请选择日期' }]}
        >
          <RangePicker disabled={formValue.feast_status === 1} disabledDate={disabledDate} style={{width: '60%'}} format={dateFormat}/>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="可预订时间"
          name="presentable_time"
          rules={[{ type: 'array' as const, required: true, message: '请选择预定时间段' }]}
        >
          <Checkbox.Group disabled={formValue.feast_status === 1} options={plainOptions} />
        </FormItem>

        <FormItem labelCol={{span: 5}}
                  wrapperCol={{span: 5}}
                  label="单价/桌(元)"
                  name="unit_amount"
                  rules={[{required: true, min: 0,max: 10000, type: 'number', message: '请输入正确的单价'}]}>
          <InputNumber disabled={formValue.feast_status === 1}
                       min={0}
                       max={10000}
                       step="1.00"
                       precision={2}
                       style={{width: '80%'}}
                       placeholder="请输入单价/桌" />
        </FormItem>

        <FormItem labelCol={{span: 5}}
                  wrapperCol={{span: 5}}
                  label="定金比例(%)"
                  name="percent"
                  rules={[{required: true, min: 0,max: 100, type: 'number', message: '请输入正确的定金比例'}]}>
            <InputNumber disabled={formValue.feast_status === 1}
                         min={0}
                         max={100}
                         step="1"
                         precision={0}
                         style={{width: '80%'}}
                         placeholder="请输入定金比例" />
          {/*<span style={{marginLeft: '5px'}}>%</span>*/}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="详情描述"
          name="description"
          rules={[{ required: true, message: '请输入100字以内的详情描述', max: 100 }]}
        >
          <TextArea placeholder="请输入详情描述" rows={4} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(CreateForm);

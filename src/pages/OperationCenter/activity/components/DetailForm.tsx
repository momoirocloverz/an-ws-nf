import React, { useState, useEffect } from 'react';
import {
  Form,
  Modal,
  InputNumber,
  Input,
  DatePicker,
  Table,
  Cascader
} from 'antd';
import _ from 'lodash';
import Moment from 'moment';
import { getFamilyList } from '@/services/operationCanter';
import '../index.css';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
const dateFormat = 'YYYY/MM/DD HH:mm:ss';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  values: any;
  areaList: any;
  accountInfo: any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, values, accountInfo, areaList } = props;
  const [form] = Form.useForm();
  const [ familyList, setFamilyList ] = useState([]);
  const [formValue, setFormValue] = useState<any>({
    activity_name: values.activity_name,
    timed_release: [
      values.timed_release ? Moment(values.timed_release[0], dateFormat) : '',
      values.timed_release ? Moment(values.timed_release[1], dateFormat) : ''
    ],
    activity_content: values.activity_content,
    activity_rule: values.activity_rule,
    people: values.people,
    area: (values.city_id && values.town_id && values.village_id) ? [values.city_id,values.town_id,values.village_id] : []
  });

  const columns = [
    {
      key: 'owner_name',
      title: '家庭户主姓名',
      dataIndex: 'owner_name',
    },
    {
      title: '门牌号',
      dataIndex: 'doorplate',
      key: 'doorplate',
    },
    {
      title: '所属小组',
      dataIndex: 'group_title',
      key: 'group_title'
    }
  ];

  // 预览
  const onPreview = async () => {
    window.open(values.image_url)
  };

  // 获取活动家庭
  const getActFamilyList = async () => {
    const data = await getFamilyList({
      activity_id: values.id
    });
    if (data.code === 0) {
      setFamilyList(data.data.apply_list || [])
    }
  }
  useEffect(() => {
    getActFamilyList();
  }, [])

  return (
    <Modal
      destroyOnClose
      width={900}
      maskClosable= {false}
      title={'查看详情'}
      visible={modalVisible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
    >
      <Form initialValues={formValue}>
        {
          (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="选择属地"
              name="area"
              rules={[{ required: true, message: '请选择属地' }]}
            >
              <Cascader disabled={true} options={areaList} />
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
          <Input disabled={true} placeholder="请输入活动名称" maxLength={30} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="活动时间"
          name="timed_release"
          rules={[{ required: true, message: '请选择活动时间' }]}
        >
          <RangePicker disabled={true} showTime format={dateFormat} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="活动描述"
          name="activity_content"
          rules={[{ required: true, message: '请输入活动描述' }]}
        >
          <TextArea disabled={true} rows={4} maxLength={150} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="活动规则"
          name="activity_rule"
          rules={[{ required: true, message: '请输入活动规则' }]}
        >
          <TextArea disabled={true} rows={4} maxLength={100} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="活动名额"
          name="people"
          rules={[{ required: true, message: '请填写活动名额' }]}
        >
          <InputNumber disabled={true} max={99999} min={1}  placeholder="请填写活动名额" style={{width: '50%', marginRight: '20px'}} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="cover"
          label="活动封面图"
        >
          <img
            style={{width: '100px', cursor: 'pointer'}}
            src={values.image_url}
            onClick={onPreview}
          />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name=""
          label="报名家庭"
        >
          <Table columns={columns} dataSource={familyList} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ info, user }: ConnectState) => ({
  areaList: info.areaList,
  accountInfo: user.accountInfo,
}))(CreateForm);

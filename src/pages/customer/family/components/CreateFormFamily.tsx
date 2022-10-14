import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Cascader, Select, Upload, Button, message } from 'antd';
import { FamilyTableListItem } from '../data.d';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { getGroupChange } from '@/services/customer'

const FormItem = Form.Item;
const { Option } = Select;

interface CreateFormProps {
  modalVisible: boolean;
  isEdit: boolean;
  values: any;
  chooseGroupList: any;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  accountInfo: any;
  areaList: any;
}

const CreateFormFamily: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, isEdit, values, chooseGroupList, accountInfo, areaList } = props;
  const [areaResult, setAreaList] = useState([])
  const [getGroupList, setGroupList] = useState([])

  const [formValue] = useState({
    family_id: values.family_id,
    admin_id: values.admin_id,
    integral: values.integral,
    updated_at: values.updated_at,
    area: (values.city_id && values.town_id && values.village_id) ? [values.city_id, values.town_id, values.village_id] : [],
    group_id: values.group_id,
    owner_name: values.owner_name,
    identity: values.identity,
    mobile: values.mobile,
    doorplate: values.doorplate,
    grid: values.grid,
  });

  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
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
    if (fieldsValue.identity) {
      if (!(fieldsValue.identity.length === 15 || fieldsValue.identity.length === 18)) {
        message.error('请输入正确的身份证号')
        return
      }
    }
    handleAdd({
      ...fieldsValue,
      isEdit,
      family_id: formValue.family_id,
      admin_id: accountInfo.admin_id
    });
  };

  // 获取属地列表
  const getAreaList = async () => {
    let _result: any = [...areaList];
    console.log(_result, 'result')
    if (accountInfo.role_type === 4) {
      _result[0].children.forEach((item: any) => {
        if (item.town_id === accountInfo.town_id) {
          _result[0].children = [item];
        }
      })
    }
    setAreaList(_result);
    if (accountInfo.role_type === 3) {
      setGroupList(chooseGroupList)
    } else {
      if (values.village_id) {
        getGroup([values.city_id, values.town_id, values.village_id])
      }
    }
  }

  // 切换属地获取小组数据
  const areaChange = async (e: any) => {
    form.setFieldsValue({
      'group_id': ''
    })
    // getGroup(e)
    let user = JSON.parse(localStorage.getItem('userInfo'));
    if (user.role_type === 4 && e.length > 1) {
      getGroup(e)
    } else if (user.role_type !== 4) {
      getGroup(e)
    }
  }
  // 小组数据调用
  const getGroup = async (area: any[]) => {
    let user=JSON.parse(localStorage.getItem('userInfo'));
    const _data = await getGroupChange({
      city_id: user.role_type===4?user.city_id:area[0],
      town_id: user.role_type===4?area[0]:area[1],
      village_id: user.role_type===4?area[1]:area[2]
    })
    if (_data.code === 0) {
      const _arr = _data.data || []
      setGroupList(_arr)
    }
  }

  useEffect(() => {
    getAreaList();
  }, [])

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title={isEdit ? '编辑家庭' : '新建家庭'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form
        initialValues={formValue}
        form={form}>
        {
          (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="选择属地"
              name="area"
              rules={[{ required: true, message: '请选择属地' }]}
            >
              <Cascader disabled={isEdit ? true : false} options={areaResult} onChange={areaChange} />
            </FormItem>
          ) : null
        }
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="所属小组"
          name="group_id"
          rules={[{ required: true, message: '请选择所属小组' }]}
        >
          <Select>
            {
              getGroupList.map((item: any) => {
                return (<Option key={item.group_id} value={item.group_id}>{item.title}</Option>)
              })
            }
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="家庭户主"
          name="owner_name"
          rules={[{ required: true, message: '请输入用户名, 最大长度为10位', max: 10 }]}
        >
          <Input placeholder="请输入用户名" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="户主身份证"
          name="identity"
        // rules={[{ required: true, message: '请输入户主身份证号'}]}
        >
          <Input placeholder="请输入身份证号" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="手机号"
          name="mobile"
          rules={[{ required: true, message: '请输入手机号, 最大长度为11位', max: 11 }]}
        >
          <Input placeholder="请输入手机号" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="门牌号"
          name="doorplate"
          rules={[{ required: true, message: '请输入门牌号' }]}
        >
          <Input placeholder="请输入门牌号" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="网格"
          name="grid"
          rules={[{ required: true, message: '请输入网格' }]}
        >
          <Input placeholder="请输入用户名" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ info, user }: ConnectState) => ({
  chooseGroupList: info.chooseGroupList,
  areaList: info.areaList,
  accountInfo: user.accountInfo,
}))(CreateFormFamily);

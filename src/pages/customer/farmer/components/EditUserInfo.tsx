import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Cascader, Select, Upload, Button } from 'antd';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { getGroupChange, getDoorplateChange } from '@/services/customer';
import e from 'express';

const FormItem = Form.Item;
const { Option } = Select;

interface CreateFormProps {
  modalVisible: boolean;
  isEdit: boolean;
  values: any;
  familyList: any;
  dispatch: Dispatch;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  areaList: any;
  accountInfo: any;
}

const EditUserInfo: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, values, accountInfo, areaList } = props;

  const [formValue, setFormValue] = useState({
    user_id: values.user_id,
    real_name: values.real_name,
    nickname: values.nickname,
    identity: values.identity,
    mobile: values.mobile,
    avatar: values.avatar,
    group_id: values.family.group_id,
    doorplate: values.family.doorplate,
    area: values.village_id ? [values.city_id, values.town_id, values.village_id] : [],
  });
  const [getGroupList, setGroupList] = useState([]);
  const [getFamilyList, setFamilyList] = useState([]);
  // const [getAreaList, setAreaList] = useState([])

  // 提交表单
  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    if (accountInfo.role_type == '3') {
      fieldsValue.area = formValue.area;
    }
    handleAdd({
      ...fieldsValue,
      user_id: formValue.user_id,
    });
  };

  // 写入此条被编辑用户的归属地
  const getArea = async () => {
    // var area = []
    // if(!formValue.area.length) {
    //   area = [accountInfo.city_id, accountInfo.town_id, accountInfo.village_id]
    // } else {
    //   area = formValue.area
    // }
    // getGroup(area)
    // if(formValue.group_id) {
    //   getDoorplate(area, formValue.group_id)
    // }

    // let _result: any = [...areaList];
    // if (accountInfo.role_type === 4) {
    //   _result[0].children.forEach((item: any) => {
    //     if (item.town_id === accountInfo.town_id) {
    //       _result[0].children = [item];
    //     }
    //   })
    // }
    // setAreaResult(_result);
    getGroup([values.city_id, values.town_id, values.village_id]);
    if (values.family.group_id) {
      getDoorplate([values.city_id, values.town_id, values.village_id], values.family.group_id);
    }
  };

  // 归属地联动
  const selectArea = async (e: any) => {
    form.setFieldsValue({
      group_id: '',
      doorplate: '',
    });
    let user = JSON.parse(localStorage.getItem('userInfo'));
    if (e.length > 0) {
      getGroup(e);
    }
  };

  // 小组数据联动
  const selectDoorplate = async (e: any) => {
    var area = form.getFieldValue('area');
    form.setFieldsValue({
      doorplate: '',
    });
    getDoorplate(area, e);
  };

  // 小组数据调用
  const getGroup = async (area: any[]) => {
    let user = JSON.parse(localStorage.getItem('userInfo'));
    const _data = await getGroupChange({
      city_id: user.role_type === 4 ? user.city_id : area[0],
      town_id: area[1],
      village_id: area[2],
    });
    if (_data.code === 0) {
      const _arr = _data.data || [];
      setGroupList(_arr);
    }
  };
  // 家庭门牌号数据调用
  const getDoorplate = async (area: any[], group_id: String) => {
    const _data = await getDoorplateChange({
      city_id: area[0],
      town_id: area[1],
      village_id: area[2],
      group_id: group_id,
    });
    if (_data.code === 0) {
      const _arr = _data.data || [];
      setFamilyList(_arr);
    }
  };

  useEffect(() => {
    getArea();
  }, []);

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title="编辑"
      width="50%"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form initialValues={formValue} form={form}>
        {
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="农户id" name="user_id">
            <div>{formValue.user_id}</div>
          </FormItem>
        }
        {
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="农户姓名"
            name="real_name"
            rules={[{ required: true, message: '请填写农户姓名' }]}
          >
            <Input placeholder="请填写农户姓名"></Input>
          </FormItem>
        }
        {
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="农户昵称"
            name="nickname"
          >
            <div>{formValue.nickname}</div>
          </FormItem>
        }
        {
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="身份证号"
            name="identity"
            rules={[
              { required: true, message: '请填写农户身份证号' },
              {
                validator: (_, value) =>
                  value.length === 15 || value.length === 18
                    ? Promise.resolve()
                    : Promise.reject('请输入正确的身份证号'),
              },
            ]}
          >
            <Input placeholder="请填写农户身份证号"></Input>
          </FormItem>
        }
        {
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="手机号"
            name="mobile"
            rules={[{ required: true, message: '请填写农户手机号' }, { min: 11 }, { max: 11 }]}
          >
            <Input placeholder="请填写农户手机号"></Input>
          </FormItem>
        }
        {
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="头像" name="avatar">
            <img src={values.avatar} alt="" width="100px" height="100px" />
          </FormItem>
        }
        {[1, 2, 4].includes(accountInfo.role_type) ? (
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="选择属地"
            name="area"
            rules={[{ required: true, message: '请选择属地' }]}
          >
            <Cascader options={areaList} placeholder="请选择属地" onChange={selectArea} />
          </FormItem>
        ) : null}
        {
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="选择小组"
            name="group_id"
            rules={[{ required: true, message: '请选择小组' }]}
          >
            <Select onChange={selectDoorplate}>
              {getGroupList.map((item: any) => {
                return (
                  <Option key={item.group_id} value={item.group_id}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        }
        {
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="选择家庭门牌号"
            name="doorplate"
            rules={[{ required: true, message: '请选择家庭门牌号' }]}
          >
            <Select>
              {getFamilyList.map((item: any) => {
                return (
                  <Option key={item.family_id} value={item.doorplate}>
                    {item.doorplate_id}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        }
      </Form>
    </Modal>
  );
};

export default connect(({ info, user }: ConnectState) => ({
  familyList: info.familyList,
  areaList: info.areaList,
  accountInfo: user.accountInfo,
}))(EditUserInfo);

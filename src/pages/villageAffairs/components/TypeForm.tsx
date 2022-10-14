import React, { useState, useEffect } from 'react';
import { Form, Modal, Input, message, Cascader, Select } from 'antd';
import _ from 'lodash';
import Moment from 'moment';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { getHaveFamilyUsersInfo } from '@/services/home';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

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
  const { modalVisible, onSubmit: handleAdd, onCancel, isEdit, values, accountInfo } = props;
  const [formValue, setFormValue] = useState({});
  const [userList, setUserList] = useState<Array<any>>([]);
  // 应参与人的列表
  const [partakePeople, setPartakePeople] = useState<Array<any>>([]);
  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    if (isEdit) {
      fieldsValue.id = values.id;
    }
    // console.log(fieldsValue);
    // 应参与人 users_str 应参与人-用户id,拼接字符串
    let users_str = '';
    console.log(partakePeople);
    partakePeople.map((item) => {
      // console.log(item);
      // users_str += `${item},`;
      userList.some((item1, index1) => {
        if (item.indexOf(item1.mobile) !== -1) {
          users_str += `${item1.user_id},`;
          return true;
        }
      });
    });
    console.log(users_str);
    fieldsValue.users_str = users_str.substring(0, users_str.length - 1);
    fieldsValue.type_nums = partakePeople.length || '0'; // 应参与人数
    form.resetFields();
    // return;
    handleAdd(fieldsValue);
  };

  // 如果是编辑状态，这里处理当前的人员问题
  const dealEdit = (list: any) => {
    const users_str = values.users_str.split(',');
    const newArr = [];
    // console.log(users_str);
    // console.log(list);
    users_str?.length > 0 &&
      users_str.map((item, index) => {
        list.map((item1, index1) => {
          if (parseInt(item) == item1.user_id) {
            newArr.push(item1.real_name + item1.mobile);
          }
        });
        // newArr.push(parseInt(item));
      });
    console.log(newArr);
    setFormValue({
      ...values,
      partakePeople: newArr,
    });
    setPartakePeople(newArr);
    form.setFieldsValue({
      ...values,
      partakePeople: newArr,
    });
  };

  const getHaveFamilyUsersInfoDun = () => {
    getHaveFamilyUsersInfo({
      city_id: accountInfo.city_id || '',
      town_id: accountInfo.town_id || '',
      village_id: accountInfo.village_id || '',
    })
      .then((res) => {
        if (res.code === 0) {
          setUserList(res.data);
          // 初始化
          if (isEdit) {
            dealEdit(res.data);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    // form.resetFields();
    getHaveFamilyUsersInfoDun();
  }, [values]);
  const selectChange = (value) => {
    console.log(value);
    setPartakePeople(value);
  };

  // 自定义校验规则
  const handleConfirmSkuId = (rule, value, callback) => {
    if (partakePeople.length === 0) {
      callback('请选择应参与人');
    } else {
      callback();
    }
  };
  return (
    <Modal
      destroyOnClose
      width={900}
      maskClosable={false}
      title={isEdit ? '编辑' : '新建'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form form={form} initialValues={formValue}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 30 }}
          label="类别名称"
          name="type_name"
          rules={[{ required: true, message: '请输入类别名称，不超过10个字' }]}
        >
          <Input placeholder="请输入类别名称，不超过10个字" maxLength={10} />
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="具体人员"
          name="partakePeople"
          rules={[
            {
              required: true,
              validator: (rule, value, callback) => handleConfirmSkuId(rule, value, callback),
            },
          ]}
        >
          <div>
            <Select
              placeholder="按名字搜索"
              mode="multiple"
              allowClear
              key={partakePeople}
              defaultValue={partakePeople}
              onChange={selectChange}
              optionLabelProp="label"
            >
              {userList.map((item) => {
                return (
                  <Option
                    key={`${item.real_name}${item.mobile}`}
                    value={`${item.real_name}${item.mobile}`}
                    label={`${item.real_name}${item.mobile}`}
                  >
                    <span>{item.real_name}</span>
                    <span>{item.mobile}</span>
                  </Option>
                );
              })}
            </Select>
            <span>{partakePeople.length || 0}人</span>
          </div>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ info, user }: ConnectState) => ({
  areaList: info.areaList,
  accountInfo: user.accountInfo,
}))(CreateForm);

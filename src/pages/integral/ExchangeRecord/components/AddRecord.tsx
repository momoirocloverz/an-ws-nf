import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Cascader, Select, Upload, InputNumber, message } from 'antd';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { canExchangeGoods } from '@/services/product'
import { getFamilyMemberList } from '@/services/family'
import { getFamilyList } from '@/services/customer'
// import { integralGoodsList } from '@/services/integral'
// import { CodeOutlined } from '@ant-design/icons';
// import { getFileInfo } from 'prettier';
// import message from 'mock/message';

const FormItem = Form.Item;
const { Option } = Select;

interface CreateFormProps {
  modalVisible: boolean;
  isEdit: boolean;
  values: any;
  familyList:any;
  dispatch: Dispatch;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  accountInfo: any;
  areaList: any;
}

const AddRecord: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const {
    modalVisible,
    onSubmit,
    onCancel,
    isEdit,
    values,
    accountInfo,
    familyList,
    areaList
  } = props;

  const [formValue, setFormValue] = useState({
    family_id: values.family_id,
    integral: values.integral,
    product_id: '',
    user_id: '',
    need_count: 0,
    over_rage: 0,
    quantity: 1,
    user_name: '',
    user_info: {}
  });
  const [familylist, setFamilyList] = useState([]);
  const [goodsList, setGoodsList] = useState([]);
  const [userList, setUserList] = useState([])
  // const [familyItem, setFamilyItem] = useState()

  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    fieldsValue['user_id'] = fieldsValue['user_info'].key
    fieldsValue['user_name'] = fieldsValue['user_info'].label
    fieldsValue['quantity'] = Number(fieldsValue['quantity'])
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
    onSubmit({
      ...fieldsValue,
      admin_id: accountInfo.admin_id
    })
  }

  // ??????????????????
  const getInfo = async () => {
    if(accountInfo.role_type === 3) {
      setFamilyList(familyList)
    } else {
      setFamilyList([])
    }
  }
  // ??????????????????
  const changeArea = async (e: any) => {
    const _data = await getFamilyList({
      city_id: e[0],
      town_id: e[1],
      village_id: e[2]
    })
    console.log(_data)
    if(_data.code === 0) {
      setFamilyList(_data.data)
      form.setFieldsValue({
        'family_id': '',
        'user_info': '',
        'product_id': '',
        'integral': ''
      })
    }
  }
  // ???????????????????????????????????????
  const selectFamily = async (id:number) => {
    let familyInfo:any = ''
    familyList.map( (item:any) => {
      if(item.family_id === id) {
        familyInfo = item
      }
    })
    getFamilyMember(id)
    // console.log(form.getFieldValue('area'), 'area')
    let area:any = []
    if(accountInfo.role_type === 3) {
      area[0] = accountInfo.city_id
      area[1] = accountInfo.town_id
      area[2] = accountInfo.village_id
    } else {
      area = form.getFieldValue('area')
    }
    getGoodsList({
      city_id: area[0],
      town_id: area[1],
      village_id: area[2],
      integral: familyInfo.account_integral
    })

    form.setFieldsValue({
      'user_info': '',
      'product_id': '',
      'integral': familyInfo.account_integral
    })
  }

  // ????????????????????????
  const getFamilyMember = async (id:number) => {
    let data = await getFamilyMemberList({family_id: id})
    if(data.code === 0) {
      setUserList(data.data)
    }else{
      message.error(data.msg)
    }
  }
  // ????????????????????????
  const getGoodsList = async (value: object) => {
    let data = await canExchangeGoods(value)
    if(data.code === 0) {
      setGoodsList(data.data)
    }else{
      message.error(data.msg)
    }
  }
  // ????????????
  const selectDoorplate = async (value: number) => {
    goodsList.map((item:any) => {
      if(item.product_id === value) {
        form.setFieldsValue({
          over_rage: item.quantity,
          need_count: item.integral
        })
      }
    })
  }

  // ???????????????
  const getUserName = async (value: any) => {
    form.setFieldsValue({
      user_name: value.label
    })
  }

  useEffect(() => {
    getInfo()
  }, [])

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title={isEdit?'??????????????????':'??????????????????'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form
        initialValues={formValue}
        form={form}
      >
        {
          (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) ? (
            <FormItem
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 15 }}
              label="????????????"
              name="area"
              rules={[{ required: true, message: '???????????????' }]}
            >
              <Cascader options={areaList} onChange={changeArea}/>
            </FormItem>
          ) : null
        }
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 15 }}
          label="????????????"
          name="family_id"
          rules={[{ required: true, message: '???????????????' }]}
        >
          <Select onChange={selectFamily} placeholder="???????????????">
            {
              familylist.map((item: any) => {
                return (<Option key={item.family_id} value={item.family_id}>{item.owner_name}</Option>)
              })
            }
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 15 }}
          label="??????????????????"
          name="user_info"
          rules={[{ required: true, message: '?????????????????????' }]}
        >
          <Select placeholder="?????????????????????" labelInValue  onChange={getUserName}>
            {
              userList.map((item: any) => {
                return (<Option key={item.user_id} value={item.user_id}>{item.real_name}</Option>)
              })
            }
          </Select>
        </FormItem>

        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 15 }}
          label="????????????"
          name="product_id"
          rules={[{ required: true, message: '?????????????????????' }]}
        >
          <Select onChange={selectDoorplate} placeholder="?????????????????????">
            {
              goodsList.map((item: any) => {
                return (<Option key={item.product_id} value={item.product_id}>{item.product_name}</Option>)
              })
            }
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 15 }}
          label="??????????????????"
          name="quantity"
        >
          <InputNumber min={1}/>
        </FormItem>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 15 }}
          label="??????????????????"
          name="integral"
        >
          <Input disabled></Input>
        </FormItem>
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 15 }}
          label="????????????????????????"
          name="need_count"
        >
          <Input disabled></Input>
        </FormItem>

        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 15 }}
          label="????????????????????????"
          name="over_rage"
        >
          <Input disabled></Input>
        </FormItem>
      </Form>
    </Modal>
  )
}

export default connect(({ info, user }: ConnectState) => ({
  familyList: info.familyList,
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(AddRecord);

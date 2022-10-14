import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Cascader, Select, Upload, Button } from 'antd';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { getGroupChange, getDoorplateChange } from '@/services/customer';

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
  areaList: any;
  accountInfo: any;
}

const CreateFormAssigned: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const {
    modalVisible,
    onSubmit: handleAdd,
    onCancel,
    isEdit,
    values,
    areaList,
    accountInfo,
    familyList,
    dispatch
  } = props;

  const [formValue, setFormValue] = useState({
    user_id: values.user_id,
    doorplate: values.family.doorplate,
    family_id: values.family_id === 0 ? '' : values.family_id,
    group_id: values.family.group_id === 0 ? '' : values.family.group_id,
    area: (values.city_id && values.town_id && values.village_id) ? [values.city_id, values.town_id, values.village_id] : []
  });
  const [areaResult, setAreaResult] = useState([]);
  const [getGroupList, setGroupList] = useState([]);
  const [getFamilyList, setFamilyList] = useState(familyList);

  // 提交表单
  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    console.log(fieldsValue, 'fieldsValue')
    if (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) {
      fieldsValue.city_id = fieldsValue.area[0];
      fieldsValue.town_id = fieldsValue.area[1];
      fieldsValue.village_id = fieldsValue.area[2];
      delete fieldsValue.area;
    }
    handleAdd({
      ...fieldsValue,
      user_id: formValue.user_id,
      family_id: formValue.family_id,
    });
  };

  // 获取地址、小组、门牌号等信息
  const getAreaList = async () => {
    let _result: any = [...areaList];
    if (accountInfo.role_type === 4) {
      _result[0].children.forEach((item: any) => {
        if (item.town_id === accountInfo.town_id) {
          _result[0].children = [item];
        }
      })
    }
    setAreaResult(_result);
    getGroup([values.city_id, values.town_id, values.village_id])
    if(values.family.group_id) {
      getDoorplate([values.city_id, values.town_id, values.village_id], values.family.group_id)
    }
  }

  // 获取家庭分组列表
  const areaChange = async (e: any) => {
    form.setFieldsValue({
      'group_id': '',
      'doorplate': ''
    })
    let user=JSON.parse(localStorage.getItem('userInfo'));
    if(e.length>0){
      if(user.role_type===4&&e.length===2){
        getGroup(e)
      }else if(user.role_type!==4&&e.length===3){
        getGroup(e)
      }
    }
  }

  // 获取家庭门牌号
  const selectDoorplate = async (e: any) => {
    var area = form.getFieldValue('area')
    form.setFieldsValue({
      'doorplate': ''
    })
    getDoorplate(area, e)
  }

  // 小组数据调用
  const getGroup = async (area: any[]) => {
    let user=JSON.parse(localStorage.getItem('userInfo'));
    const _data = await getGroupChange({
      city_id: user.role_type===4?user.city_id:area[0],
      town_id: user.role_type===4?area[0]:area[1],
      village_id: user.role_type===4?area[1]:area[2]
    })
    if(_data.code === 0) {
      const _arr = _data.data || []
      setGroupList(_arr)
    }
  }
  // 家庭门牌号数据调用
  const getDoorplate = async (area: any[], group_id: String) => {
    const _data = await getDoorplateChange({
      city_id: area[0],
      town_id: area[1],
      village_id: area[2],
      group_id: group_id
    })
    if(_data.code === 0) {
      const _arr = _data.data || []
      setFamilyList(_arr)
    }
  }

  useEffect(() => {
    getAreaList();
    dispatch({
      type: 'info/queryFamilyList',
    });
  }, [])

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title={isEdit?'修改农户所属地':'新建家庭'}
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
              label="选择属地"
              name="area"
              rules={[{ required: true, message: '请选择属地' }]}
            >
              <Cascader options={areaResult} onChange={areaChange} />
            </FormItem>
          ) : null
        }
        {
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="选择小组"
            name="group_id"
            rules={[{ required: true, message: '请选择小组' }]}
          >
            <Select onChange={selectDoorplate}>
              {
                getGroupList.map((item: any) => {
                  return (<Option key={item.group_id} value={item.group_id}>{item.title}</Option>)
                })
              }
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
              {
                getFamilyList.map((item: any) => {
                  return (<Option key={item.doorplate} value={item.doorplate}>{item.doorplate_id}</Option>)
                })
              }
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
}))(CreateFormAssigned);

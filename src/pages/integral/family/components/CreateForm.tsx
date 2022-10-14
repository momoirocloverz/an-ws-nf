import React, { useState, useEffect } from 'react';
import { Form, Modal, Select, InputNumber, Input, Radio, DatePicker, Cascader } from 'antd';
import { getScoreList, getFamilyDefaultValue } from '@/services/integral';
import { getFamilyList } from '@/services/customer';
import _ from 'lodash';
import Moment from 'moment';
import ImgMoreUpload from '@/components/imgMoreUpload';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
// import { getFileInfo } from 'prettier';

const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  isEdit: boolean;
  isEditRecord?: boolean;
  values: any;
  accountInfo: any;
  areaList: any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, isEdit, isEditRecord, values, accountInfo, areaList } = props;
  const [scoreList, setScoreList] = useState([]);
  const [disabledIntegral, setDisabledIntegral] = useState(true);
  const [imgDataList, setImgDataList] = useState([]);
  const [picId, setPicId] = useState('');
  const [familyList, setFamilyList] = useState([]);
  const [maxIntegral, setMaxIntegral] = useState(99999);
  const [minIntegral, setMinIntegral] = useState(1);
  const [directionDisabled, setDirectionDisabled] = useState(false);
  const [valueType, setValueType] = useState()

  const okHandle = async () => {
    // form.validateFields().then(fieldsValue => {
      const fieldsValue:any = await form.validateFields()
      if (isEdit) {
        fieldsValue.family_id = fieldsValue.family_ids[0]
        fieldsValue.pic_id = picId
      } else {
        fieldsValue.family_ids = fieldsValue.family_ids.join(',')
      }
      if(isEditRecord) {
        fieldsValue.record_id = values.id
      }
      fieldsValue.checked_at = fieldsValue.checked_at ? Moment(fieldsValue.checked_at).valueOf() / 1000 : ''
      fieldsValue.image_ids = imgDataList.map((item:any) => {
        return item.uid;
      }).join(',');
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
      // if(maxIntegral||minIntegral){
      //   if(fieldsValue.integral > maxIntegral || fieldsValue.integral < minIntegral){
      //     message.error(`加/减善治分的值应在${minIntegral}~${maxIntegral}之间`)
      //   }
      // }
      form.resetFields();
      handleAdd({
        ...fieldsValue,
        p_type: valueType,
        admin_id: accountInfo.admin_id
      });
    // }).catch(er=> {
    //   console.log(er);
    // })
  };

  // 获取家庭数据
  const areaChange = async (e: any) => {
    form.setFieldsValue({
      'family_ids': []
    })
    getFamily({
      city_id: e[0],
      town_id: e[1],
      village_id: e[2],
    })
    getScore({
      city_id: e[0],
      town_id: e[1],
      village_id: e[2],
    })
  }

  // 获取打分项
  const getScore = async (params: any) => {
    let data = {}
    if(params && params.village_id) {
      data = {
        city_id: params.city_id,
        town_id: params.town_id,
        village_id: params.village_id,
      }
    }
    const _data:any = await getScoreList(data);
    if (_data.code === 0) {
      setScoreList(_data.data || []);
    }
  }

  // 获取家庭名称
  const getFamily = async (params: any) => {
    let data = {}
    if(params && params.village_id) {
      data = {
        city_id: params.city_id,
        town_id: params.town_id,
        village_id: params.village_id
      }
    }
    const _data:any = await getFamilyList(data);
    if (_data.code === 0) {
      setFamilyList(_data.data || []);
    }
  }

  // 更新打分名称
  const changeName = async (e: any) => {
    const scoreItem:any = scoreList.filter( (item:any) => item.item_id === e).pop();
    if(scoreItem.use_p_type === 1) {
      setDisabledIntegral(true)
    } else {
      setMinIntegral(Number(scoreItem.point.split("~")[0]))
      setMaxIntegral(Number(scoreItem.point.split("~")[1]))
      setDisabledIntegral(false)
    }
    if(scoreItem.direction) {
      setDirectionDisabled(true)
    }
    setValueType(scoreItem.use_p_type)
    form.setFieldsValue({
      'direction': scoreItem.direction,
      'integral': scoreItem.use_p_type === 1? scoreItem.point :  scoreItem.point.split("~")[0],
    })
    if (isEdit) {
      const data = await getFamilyDefaultValue({
        family_id: values.family_id,
        item_id: e
      });
      if (data.code === 0) {
        form.setFieldsValue({
          'checked_at': Moment(data.data.created_at),
        })
        const result = (data.data && data.data.image_arr) || [];
        const arr = result.map((item: any) => {
          return {
            uid: item.id,
            name: '图片',
            status: 'done',
            url: item.url
          }
        });
        setPicId(data.data.pic_id);
        setImgDataList(arr);
      }
    }
  }

  const getImgData = (arr=[]) => {
    setImgDataList(arr)
  }

  const middleNumber = () => {
    const { getFieldValue } = form;
    const integralValue = getFieldValue('integral')
    if(integralValue !== null && integralValue !== '' && valueType === 2) {
      if(maxIntegral < integralValue || minIntegral > integralValue) {
        return Promise.reject(`请输入${minIntegral}~${maxIntegral}之间的数字`)
      }
    }
    return Promise.resolve()
  }

  useEffect(() => {
    let obj = {
      city_id: values.city_id,
      town_id: values.town_id,
      village_id: values.village_id
    }
    // if(accountInfo === 3) {
    //   getFamily({});
    //   getScore({});
    // } else {
    //   setFamilyList([])
    //   setScoreList([])
    // }
    getFamily(obj)
    getScore(obj)
  }, [])

  return (
    <Modal
      destroyOnClose
      width={900}
      maskClosable= {false}
      title={isEdit ? '更新积分' : '批量更新家庭积分'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form form={form}>
        {
          (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="选择属地"
              name="area"
              rules={[{ required: true, message: '请选择属地' }]}
              initialValue={(values.city_id && values.town_id && values.village_id) ? [values.city_id,values.town_id,values.village_id] : []}
            >
              <Cascader disabled={isEdit ? true : false} options={areaList} onChange={areaChange} />
            </FormItem>
          ) : null
        }
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="家庭名称"
          name="family_ids"
          rules={[{ required: true, message: '请选择家庭名称' }]}
          initialValue={!_.isEmpty(values) ? [values.family_id] : []}
        >
          <Select
            placeholder="请选择"
            allowClear
            mode="multiple"
            disabled={isEdit ? true : false}
          >
            {familyList.length > 0 && familyList.map((item:any, index:number) => {
              return <Option key={index} value={item.family_id}>{item.owner_name}</Option>
            })}
          </Select>
        </FormItem>
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="打分项名称"
          name="item_id"
          rules={[{ required: true, message: '请选择打分项名称' }]}
          initialValue={!_.isEmpty(values) && isEditRecord? values.item_id : ""}
          >
          <Select
            placeholder="请选择"
            allowClear
            onChange={changeName}
            disabled={isEditRecord ? true : false}
          >
            {scoreList.map((item:any, index:number) => {
              return <Option key={index} value={item.item_id}>{item.item_name}</Option>
            })}
          </Select>
        </Form.Item>
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="善治分加/减"
          name="direction"
          rules={[{ required: true, message: '请选择分数更改方式' }]}
          initialValue={!_.isEmpty(values) && isEditRecord? values.direction : ""}
        >
          <RadioGroup disabled={directionDisabled || isEditRecord? true : false}>
            <Radio value='INCREASE'>加分</Radio>
            <Radio value='DECREASE'>扣分</Radio>
          </RadioGroup>
        </Form.Item>
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="检查时间"
          name="checked_at"
          rules={[{ required: true, message: '请选择检查时间' }]}
          initialValue={!_.isEmpty(values) && isEditRecord? Moment(values.checked_at) : null}
        >
          <DatePicker  disabled={isEditRecord ? true : false}/>
        </Form.Item>
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="加/减善治分"
          name="integral"
          rules={[
            { required: true, message: '请填写善治分' },
            {validator: middleNumber},
          ]}
          initialValue={!_.isEmpty(values) && isEditRecord? values.integral : ""}
        >
          <InputNumber disabled={disabledIntegral} style={{width: '100%'}}  placeholder="请输入善治分" />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="证明图片"
          name="image_ids"
        >
          <ImgMoreUpload values={imgDataList} getImgData={getImgData} max={3} />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="备注"
          name="remark"
          initialValue={!_.isEmpty(values) && isEditRecord? values.remark : ""}
        >
          <TextArea rows={4} maxLength={30} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ info, user }: ConnectState) => ({
  areaList: info.areaList,
  accountInfo: user.accountInfo,
}))(CreateForm);

import React, {useState} from 'react';
import { Form, Input, Modal, Radio, InputNumber, message, Cascader } from 'antd';
import styles from './creatForm.less'
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';

const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  accountInfo: any;
  areaList: any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, accountInfo, areaList } = props;
  const [countType, setCountType] = useState(1)
  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    console.log(fieldsValue);
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
    if(fieldsValue.integral_start && fieldsValue.integral_end){
      let {integral_start,integral_end} = fieldsValue
      if(integral_start < 0 || integral_end > 99999 || integral_end < integral_start){
        message.error('分值最小值不得小于0，最大值不得大于99999，且最大值不得小于最小值')
        return
      }
    }

    fieldsValue.point = fieldsValue.type === 1 ? fieldsValue.integral_start : `${fieldsValue.integral_start}~${fieldsValue.integral_end}`
    const res = await handleAdd({
      ...fieldsValue,
      admin_id: accountInfo.admin_id
    });
    if(res){
      form.resetFields();
    }

  };
  const onCountTypeChange = (e: any) => {
    setCountType(e.target.value)
  }

  return (
    <Modal
      getContainer={window.document.body}
      destroyOnClose
      maskClosable= {false}
      title="新建打分项"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form
        form={form}
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
          label="打分项名称"
          name="item_name"
          rules={[{ required: true, message: '请输入15字以内的打分项名称', max: 15 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="打分类型"
          name="direction"
          rules={[{ required: true, message: '请选择打分类型'}]}
        >
          <Radio.Group>
            <Radio value="INCREASE">加分</Radio>
            <Radio value="DECREASE">扣分</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="巡查员"
          name="inspect"
          initialValue={1}
          rules={[{ required: true, message: '请选择巡查员是否可见'}]}
        >
          <Radio.Group>
            <Radio value={1}>可见</Radio>
            <Radio value={0}>不可见</Radio>
          </Radio.Group>
        </FormItem>

        <FormItem label="分值" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} className={styles.addLabelIcon}>
          <FormItem
            name="type"
            rules={[{ required: true, message: '请选择分值类型'}]}
          >
            <Radio.Group  onChange={onCountTypeChange} style={{padding: "6px 0 20px"}} value={countType}>
              <Radio value={1}>固定分值</Radio>
              <Radio value={2}>范围分值</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            noStyle
            name="integral_start"
            rules={[{ required: true, message: '请填写分值'}]}
          >
            <InputNumber precision={0} min={0} max={99999} placeholder="0"/>
          </FormItem>
          {
            countType === 2
            ?
              <FormItem
                noStyle
                name="integral_end"
                rules={[{ required: true, message: '请填写分值'}]}
              >
                <InputNumber precision={0} className={styles.countEnd} placeholder="99999"/>
              </FormItem>
            :
              ""
          }
        </FormItem>
        {
          countType === 2?<div style={{color:'red'}}>分值最小值不得小于0，最大值不得大于99999，且最大值不得小于最小值</div>:""
        }
      </Form>
    </Modal>
  );
};

export default connect(({ info, user }: ConnectState) => ({
  // chooseGroupList: info.chooseGroupList,
  areaList: info.areaList,
  accountInfo: user.accountInfo,
}))(CreateForm);

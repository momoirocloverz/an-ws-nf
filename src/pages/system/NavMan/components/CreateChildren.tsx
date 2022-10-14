import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Select, } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
export interface chidrenValueType {
  name?: string;
  path?: string;
  icon?: string;
  orderid?: number;
  title: string;
  pid: number | string;
  menu_id: number | string;
  type: number | string;
}

interface CreateFormProps {
  value: chidrenValueType;
  title: string; 
  isEdit: boolean;
  modalVisible: boolean;
  level: number | string;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

const CreateChildren: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const [formType, setFormType] = useState<number | string>(1);
  const [menuType, setMenuType] = useState(1);

  const { modalVisible, onSubmit: handleAdd, onCancel, value, title, isEdit, level } = props;
  const [formValue] = useState<chidrenValueType>({
    name: value.name,
    path: value.path,
    icon: value.icon,
    orderid: value.orderid,
    type: value.type,
    title: value.title,
    pid: value.pid,
    menu_id: value.menu_id,
  });

  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    handleAdd({
      ...fieldsValue,
      isEdit,
      level,
      formType,
      pid: formValue.pid,
      menu_id: formValue.menu_id,
    });
  };

  const cancleForm = () => {
    form.resetFields();
    onCancel();
  }

  const onMenuTypeChange = (val: any) => {
    setMenuType(val);
    if (val === 1) {
      // 创建二级页面
      setFormType(2);
    }
  }

  useEffect(() => {
    if (!isEdit) {
      if (level === 1) {
        setFormType(2);
        setMenuType(1);
      }
    } else {
      setFormType(level);
    }
  }, [])

  return (
    <Modal
      width={800}
      destroyOnClose
      title={title}
      visible={modalVisible}
      maskClosable= {false}
      onOk={okHandle}
      onCancel={cancleForm}
    >
      <Form 
        form={form}
        initialValues={formValue}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="菜单名称"
          name="name"
          rules={[{ required: true, message: '请输入至少10个字符的菜单名称！', max: 10 }]}
        >
          <Input placeholder="请输入菜单名称" />
        </FormItem>
        {
          (!isEdit && level !== 3) ? (
            <div style={{display: 'none'}}>
              <Form.Item
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="菜单类型"
                required
                rules={[{ required: true, message: '请选择菜单类型' }]}
                >
                <Select 
                  placeholder="请选择"
                  onChange={onMenuTypeChange}
                  value={menuType}
                  disabled={true}
                >
                  <Option key="1" value={1}>二级页面</Option>
                </Select>
              </Form.Item>
            </div>
          ) : null
        }
        { formType !== 3 ?
          (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="菜单路由"
              name="path"
              rules={[{ required: true, message: '请输入页面的路由', }]}
            >
              <Input placeholder="请输入" />
            </FormItem>
          ) : null
        }
        {
          (level === 1 && isEdit) ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="图标编码"
              name="icon"
              rules={[
                { required: true, message: '请输入图标编码', type: 'string' },
              ]}
            >
              <Input placeholder="请输入" />
            </FormItem> 
          ) : null
        }
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="排序"
          name="orderid"
        >
          <Input placeholder="请输入排序数字" />
        </FormItem>  
      </Form>
    </Modal>
  );
};

export default CreateChildren;


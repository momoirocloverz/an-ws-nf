import React from "react";
import { Form, InputNumber, message, Modal } from "antd";
import Input from "antd/es/input/Input";
import { editFormulaFertilizerDeclare } from "@/services/formulaFertilizerManageTown";
import { useEffect } from "react";

type PropType = {
  context: any,
  natureEnum: {},
  visible: boolean,
  onCancel?: () => unknown,
  onSuccess?: () => unknown,
}

function editInfo({ visible, context, onCancel, onSuccess, natureEnum }: PropType) {
  const [form] = Form.useForm();

  useEffect(() => {
    !visible && form.resetFields();
  }, [visible]);

  const onSubmit = async () => {
    const fieldValues = await form.validateFields();
    try {
      const result = await editFormulaFertilizerDeclare({
        id: context.id,
        billing_ton: fieldValues.billing_ton,
        delivery_ton: fieldValues.delivery_ton
      });
      if (result.code === 0) {
        message.success("编辑成功");
        onSuccess&&onSuccess();
      } else {
        message.error(result.msg);
      }
    } catch (err) {
      message.error(err.message);
    }

  };
  return (
    <Modal
      title="编辑"
      visible={visible}
      onCancel={onCancel}
      onOk={onSubmit}
      destroyOnClose
    >
      <Form
        form={form}
        initialValues={{
          ...context,
          subsidy_type: natureEnum[context.subsidy_type]
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="承包人"
          name="real_name"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="性质"
          name="subsidy_type"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="所属地区"
          name="area_name"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="核实总面积"
          name="verify_area"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="作物"
          name="crops_name"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="年份"
          name="year"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="限额购肥量/吨"
          name="quota_ton"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="实名制购肥量/吨"
          name="real_ton"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="开票数量/吨"
          name="billing_ton"
          rules={[
            { required: true, message: "" },
            {
              validator: (rule, value) => {
                if (Object.prototype.toString.call(value) !== "[object Null]") {
                  if (Number(value) <= 0) {
                    return Promise.reject("请输入大于零的数字");
                  } else {
                    return Promise.resolve();
                  }
                } else {
                  return Promise.reject("请输入开票数量");
                }
              }
            }
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="送货数量/吨"
          name="delivery_ton"
          rules={[{ required: true, message: "" },{
            validator: (rule, value) => {
              if (Object.prototype.toString.call(value) !== "[object Null]") {
                if (Number(value) <= 0) {
                  return Promise.reject("请输入大于零的数字");
                } else {
                  return Promise.resolve();
                }
              } else {
                return Promise.reject("请输入送货数量");
              }
            }
          }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="最终可补量/吨"
          name="fertilizer_ton"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="补贴金额"
          name="subsidy_amount"
        >
          <Input disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default editInfo;

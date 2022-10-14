import { Form, Modal, Input, DatePicker, Select, message, Cascader } from "antd";
import React, { useEffect, useState } from "react";
import Moment from "moment";
import {
  addSubsidyMachineCapital,
  getSubsidyMachineCate,
  editSubsidyMachineCapital
} from "@/services/agricultureSubsidies";
// import { ExclamationCircleOutlined } from "_@ant-design_icons@4.0.0@@ant-design/icons";

function createForm({ visible, onCancel, onSuccess, context, areaLists }) {
  const [val, setVal] = useState(-1);
  const [subsidyMachineCate, setSubsidyMachineCate] = useState([]);
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    visible && form.resetFields();
    if (context.id) {
      if (context.town_id) {
        form.setFieldsValue({
          area: [context.city_id, context.town_id]
        });
      }
      setVal(context.subsidy_type);
      console.log("是编辑", context); // 2022-07-05 编辑状态全置灰
      setDisabled(true);
      // if (context.zj_declare_id || context.zy_declare_id) {
      //   setDisabled(true);
      // }
      form.setFieldsValue({
        code: context.identity
      });
    }else{
      setDisabled(false);
    }
    // 获取类别
    // eslint-disable-next-line no-unused-expressions
    subsidyMachineCate.length === 0 &&
    getSubsidyMachineCate().then((e) => {
      if (e.code === 0) {
        console.log(e);
        const temp: any = (e.data.map(item => {
          return { label: item.machine_name, value: item.id };
        }));
        setSubsidyMachineCate(temp);
      }
    });
  }, [visible]);
  const [form] = Form.useForm();
  const subsidyTypeList = [
    { label: "个人", value: 1 },
    { label: "企业/合作社", value: 2 }
  ];
  const onSubmit = async () => {
    const params = await form.validateFields();
    params.year = Moment(params.year).format("YYYY");
    if (params.area && params.area.length > 0) {
      params.city_id = params.area[0];
      params.town_id = params.area[1];
      delete params.area;
    }
    console.log(params);
    // 编辑时如果有申报记录增加弹窗提醒
    // if (context.id && (context.zj_declare_id || context.zy_declare_id)) {
    //   Modal.confirm({
    //     content: "您当前有申报记录，暂时不支持编辑，如需修改，请退回或取消申报记录后再进行修改",
    //     icon: <ExclamationCircleOutlined />,
    //     onOk: () => {
    //     }
    //   });
    //   return;
    // }
    // return
    const result = context.id ? await editSubsidyMachineCapital({
      ...params,
      id: context.id
    }) : await addSubsidyMachineCapital(params);
    if (result.code === 0) {
      message.success(context.id ? "编辑成功" : "创建成功");
      onSuccess();
    } else {
      message.error(result.msg);
    }
  };

  return (
    <Modal
      width={600}
      visible={visible}
      title={context.id ? "编辑" : "新建"}
      onCancel={onCancel}
      onOk={onSubmit}
    >
      <Form
        form={form}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 24 }}
        initialValues={{
          ...context,
          year: context.year ? Moment(context.year, "YYYY") : ""
        }}
      >
        <Form.Item
          label="补贴对象"
          name="real_name"
          rules={[{ required: true, message: "请输入补贴对象" }]}
        >
          <Input disabled={disabled} />
        </Form.Item>
        <Form.Item
          label="性质"
          name="subsidy_type"
          rules={[{ required: true, message: "请选择" }]}
        >
          <Select
            disabled={disabled}
            options={subsidyTypeList}
            onChange={(val) => {
              console.log(val);
              setVal(val);
              form.setFieldsValue({
                code: ""
              });
            }}
          />
        </Form.Item>
        {
          val !== -1 && (
            <Form.Item
              label={val == 1 ? "身份证" : "社会信用代码"}
              name="code"
              rules={[{ required: true, message: "请输入" }]}
            >
              <Input disabled={disabled} />
            </Form.Item>
          )
        }
        <Form.Item
          label="机具类型"
          name="terminal_type"
          rules={[{ required: true, message: "请选择机具类型" }]}
        >
          <Select disabled={disabled} options={subsidyMachineCate} />
        </Form.Item>
        <Form.Item
          label="数量"
          name="terminal_count"
          rules={[{ required: true, message: "请输入数量" }]}
        >
          <Input disabled={disabled} />
        </Form.Item>
        <Form.Item
          label="年份"
          name="year"
          rules={[{ required: true, message: "请选择" }]}
        >
          <DatePicker disabled={disabled} picker="year" />
        </Form.Item>
        <Form.Item
          label="所属地区"
          name="area"
          rules={[{ required: true, message: "请选择" }]}
        >
          <Cascader disabled={disabled} options={areaLists} placeholder="请选择地区" />
        </Form.Item>
        <Form.Item
          label="省级配套"
          name="province_matching"
          rules={[{ required: true, message: "请选择" }]}
        >
          <Input disabled={disabled} />
        </Form.Item>
        <Form.Item
          label="市级配套"
          name="market_matching"
          rules={[{ required: true, message: "请选择" }]}
        >
          <Input disabled={disabled} />
        </Form.Item>
        <Form.Item
          label="中央补贴"
          name="center_subsidy"
          rules={[{ required: true, message: "请选择" }]}
        >
          <Input disabled={disabled} />
        </Form.Item>
        <Form.Item label="终端编号" name="terminal_number" rules={[{ required: true, message: "请输入" }]}>
          <Input disabled={disabled} />
        </Form.Item>
        <Form.Item
          label="购置总价"
          name="purchase_price"
          rules={[{ required: true, message: "请选择" }]}
        >
          <Input disabled={disabled} />
        </Form.Item>
        <Form.Item label="购置单价" name="purchase_price_unit">
          <Input />
        </Form.Item>
        <Form.Item label="机具品目" name="implement_item">
          <Input />
        </Form.Item>
        <Form.Item label="机具型号" name="implement_model">
          <Input />
        </Form.Item>
        <Form.Item label="生产企业" name="production_enterprise">
          <Input />
        </Form.Item>
        <Form.Item label="现居住地址" name="liberty_address">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default createForm;

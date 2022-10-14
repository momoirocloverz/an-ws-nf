/* eslint-disable-next-line no-nested-ternary */
import React, { useEffect, useState } from 'react';
import {
  Modal, Form, Radio, Select, Input, message, InputNumber,
} from 'antd';
import { getMainCodeList, addItemList, editItemList } from '@/services/ItemManage';
import _ from 'lodash';
import { modifyGradeItem } from '@/services/integral';
import styles from './index.less';

type PropType = {
  context: object | {};
  visible: boolean;
  onCancel: ()=>unknown;
  onSuccess: ()=>unknown;
}

function ModifyActiveGradeItem({
  context, visible, onCancel, onSuccess,
} : PropType) {
  const [form] = Form.useForm();
  const [valueType, setValueType] = useState(1);
  const [minimum, setMinimum] = useState();
  const [maximum, setMaximum] = useState();

  useEffect(() => {
    const [min, max] = context.use_point?.split('~') ?? [undefined, undefined];
    setValueType(context.use_p_type);
    setMinimum(!Number.isNaN(parseFloat(min)) ? parseFloat(min) : undefined);
    setMaximum(!Number.isNaN(parseFloat(max)) ? parseFloat(max) : undefined);
    form.resetFields();
  }, [visible]);

  const submit = async () => {
    try {
      await form.validateFields();
    } catch (e) {
      return;
    }
    try {
      const values = form.getFieldsValue();
      const result = await modifyGradeItem({
        api_name: 'edit_apply',
        itemId: context.item_id,
        active: context.inspect,
        valueType: values.valueType,
        value: valueType === 1 ? values.fixedValue : valueType === 2 ? `${minimum}~${maximum}` : undefined,
        manual: values.manual,
      });
      if (result.code === 0) {
        message.success('编辑成功!');
        onSuccess();
      } else {
        throw new Error(result.msg);
      }
    } catch (e) {
      message.error(`编辑失败: ${e.message}!`);
    }
  };

  useEffect(() => {
    form.validateFields(['variableValue']);
  }, [minimum, maximum]);

  return (
    <Modal
      getContainer={window.document.body}
      visible={visible}
      title="编辑"
      onCancel={onCancel}
      onOk={submit}
      destroyOnClose
    >
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        form={form}
        initialValues={{
          primaryGroupId: context.p_code,
          primaryGroupName: context.p_name,
          id: context.s_code,
          name: context.s_name,
          type: context.direction === 'INCREASE' ? 1 : context.direction === 'DECREASE' ? 2 : undefined,
          referenceValue: context.point,
          valueType: context.use_p_type,
          fixedValue: context.use_p_type === 1 ? parseFloat(context.use_point) : undefined,
          isRequired: context.is_all,
          manual: context.use_comment,
        }}
        colon
      >
        <Form.Item
          label="主编码"
          name="primaryGroupId"
          rules={[{ required: true, message: '请选择主编码' }]}
        >
          <Input
            placeholder="请选择主编码"
            className={styles.selectInfo}
            disabled
          />
        </Form.Item>
        <Form.Item
          label="主项名称"
          name="primaryGroupName"
          rules={[{ required: true, message: '请选择主项名称' }]}
        >
          <Input
            type="text"
            placeholder="请输入主项名称"
            disabled
            className={styles.selectInfo}
          />
        </Form.Item>

        <Form.Item
          label="子编号"
          className={styles.childCode}
          name="id"
          rules={[{ required: true, message: '请输入子编号' }]}
        >
          <Input type="text" placeholder="请输入子编号" disabled />
        </Form.Item>
        <Form.Item
          label="子项名称"
          name="name"
          rules={[{ required: true, message: '请输入子项名称' }]}
        >
          <Input type="text" placeholder="请输入子项名称" disabled />
        </Form.Item>
        <Form.Item
          label="打分类型"
          name="type"
          rules={[{ required: true, message: '请选择打分类型' }]}
        >
          <Radio.Group disabled>
            <Radio value={1}>加分</Radio>
            <Radio value={2}>扣分</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="参考分值"
          name="referenceValue"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="分值类型"
          name="valueType"
          rules={[
            {
              validator: (r, v) => {
                if (!v) {
                  return Promise.reject(new Error('请选择参考分值'));
                }
                // if (form.getFieldValue('isRequired') === 1 && v === '2') {
                //   return Promise.reject(new Error('必选情况下只能选择固定分值'));
                // }
                return Promise.resolve();
              },
            }]}
          required
        >
          <Radio.Group
            className={styles.radioGroup}
            value={valueType}
            disabled={context.p_type === 1}
            onChange={(e) => setValueType(e.target.value)}
          >
            <Radio value={1}>固定分值</Radio>
            <Radio value={2}>范围分值</Radio>
          </Radio.Group>
        </Form.Item>

        {valueType === 1 ? (
          <Form.Item
            label="固定分值"
            name="fixedValue"
            rules={[{
              validator: (r, v) => {
                if (v === undefined || Number.isNaN(v)) {
                  return Promise.reject(new Error('请输入固定分值'));
                }
                const [lowerBound, upperBound] = context.point?.split('~').map((e) => parseFloat(e));
                if (v < lowerBound || v > upperBound) {
                  return Promise.reject(new Error('请输入参考范围内的分值'));
                }
                return Promise.resolve();
              },
            }]}
            required
          >
            <InputNumber
              type="text"
              placeholder="请输入固定分值"
              className={styles.scoreInfo}
              disabled={context.p_type === 1}
            />
          </Form.Item>
        ) : null}
        {valueType === 2 ? (
          <Form.Item
            label="范围分值"
            name="variableValue"
            rules={[{
              validator: () => {
                if (minimum !== undefined && !Number.isNaN(minimum) && maximum !== undefined && !Number.isNaN(maximum)) {
                  const min = minimum;
                  const max = maximum;
                  const [lowerBound, upperBound] = context.point?.split('~').map((e) => parseFloat(e));
                  if (min >= max) {
                    return Promise.reject(new Error('起始值必须小于结束值'));
                  }
                  if (min < lowerBound || min > upperBound) {
                    return Promise.reject(new Error('起始值必须大于等于参考的起始值,并小于参考的结束值'));
                  }
                  if (max < lowerBound || max > upperBound) {
                    return Promise.reject(new Error('结束值必须大于等于参考的起始值,并小于参考的结束值'));
                  }
                  return Promise.resolve();
                }
                return Promise.reject(new Error('请输入起始值和结束值'));
              },
            }]}
          >
            <div className={styles.inputContainer}>
              <div className={styles.scoreInput}>
                <InputNumber
                  placeholder="起始值"
                  width="80px"
                  value={minimum}
                  onChange={(v) => setMinimum(v)}
                />
              </div>
              &nbsp;~&nbsp;
              <div className={styles.scoreInput}>
                <InputNumber
                  placeholder="结束值"
                  width="80px"
                  value={maximum}
                  onChange={(v) => setMaximum(v)}
                />
              </div>
            </div>
          </Form.Item>
        ) : null }

        <Form.Item
          label="是否必选"
          name="isRequired"
          rules={[{ required: true, message: '请选择是否必选' }]}
        >
          <Radio.Group
            className={styles.radioGroup}
            disabled
          >
            <Radio value={0}>否</Radio>
            <Radio value={1}>是</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="使用说明"
          name="manual"
          className={styles.useIntro}
          rules={[{ required: true, message: '请输入使用说明' }]}
        >
          <Input type="text" placeholder="请输入使用说明" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ModifyActiveGradeItem;

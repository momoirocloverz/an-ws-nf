import React, { memo, useState } from 'react';
import {
  Form, Modal, message, InputNumber
} from 'antd';
import {
  _editSubsidyDisposable
} from '@/services/agricultureSubsidies';
import { CascaderOptionType } from 'antd/es/cascader';
import _ from 'lodash';

type ContextObject = {
  id: number;
  contractor: string,
  identity: string,
  cumulativeSize: number,
  subsidy_area: number
}

type ClaimModificationFormModalProps = {
  context: ContextObject;
  regionTree: CascaderOptionType[];
  categoryTree: CascaderOptionType[];
  visible: boolean;
  cancelCb?: () => unknown;
  successCb?: () => unknown;
}

function ClaimModificationFormModal({
  context, visible, cancelCb, successCb, regionTree, categoryTree,
}: ClaimModificationFormModalProps) {
  const [formRef] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [contractedArea, setContractedArea] = useState(0.1);
  const [defaultValues, ] = useState({
    subsidy_area: context.subsidy_area
  })

  const handleSubmit = async () => {
    try {
      await formRef.validateFields();
    } catch (e) {
      return;
    }
    try {
      const values = formRef.getFieldsValue();
      setSubmitting(true);
      const result = await _editSubsidyDisposable({
        ...values,
        id: context.id,
      });
      if (result.code === 0) {
        message.success('编辑成功');
        if (typeof successCb === 'function') {
          successCb();
        }
      } else {
        throw new Error(result.msg);
      }
    } catch (e) {
      message.error(`编辑失败:${e.message}!`);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Modal
      visible={visible}
      onCancel={cancelCb}
      title="编辑申报信息"
      destroyOnClose
      confirmLoading={submitting}
      width={800}
      // forceRender
      onOk={handleSubmit}
    >
      <Form
        form={formRef}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        initialValues={defaultValues}
      >
        <Form.Item
          label="一次性补贴面积（亩）"
          name="subsidy_area"
          required
          rules={[{ required: true, message: '申报面积为必填' }]}
        >
          <InputNumber type="number" value={contractedArea} onChange={(v) => setContractedArea(v)} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

ClaimModificationFormModal.defaultProps = {
  cancelCb: () => {},
  successCb: () => {},
};
export default memo(ClaimModificationFormModal);

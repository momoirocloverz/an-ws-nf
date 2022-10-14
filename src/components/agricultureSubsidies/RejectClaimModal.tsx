import React, { useEffect, useState } from 'react';
import {
  Form, Modal, message, Input,
} from 'antd';
import { rejectClaimByTownOfficials, rejectClaimByVillageOfficials } from '@/services/agricultureSubsidies';

type ClaimRejectionFormProps = {
  visible: boolean,
  context: object,
  type: 'village' | 'town' | null,
  cancelCb?: ()=>unknown,
  successCb?: ()=>unknown
}

function ClaimRejectionModal({
  context, type, visible, cancelCb, successCb,
}: ClaimRejectionFormProps) {
  const [formRef] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      formRef.resetFields();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      getContainer={false}
      onCancel={cancelCb}
      title="驳回理由"
      confirmLoading={submitting}
      forceRender
      onOk={async () => {
        try {
          await formRef.validateFields();
        } catch (e) {
          return;
        }
        try {
          const response = formRef.getFieldValue('response');
          if (context.id === undefined) {
            throw new Error('缺少记录ID');
          }
          // 村级驳回因会产生驳回记录而需要额外参数, 方便后端搜索
          const params = { id: context.id };
          if (type === 'village') {
            params.crops = context.crops;
            params.program = context.category;
            params.region = context.regionString;
            params.household_type = context.household_type;
            await rejectClaimByVillageOfficials(params, response);
          } else if (type === 'town') {
            await rejectClaimByTownOfficials(context.id, response);
          } else {
            throw new Error('未知操作等级!');
          }
          setSubmitting(true);
          message.success('驳回成功!');
          if (typeof successCb === 'function') {
            successCb();
          }
        } catch (e) {
          message.error(`驳回失败:${e.message}!`);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Form
        form={formRef}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="理由"
          name="response"
          rules={[{ required: true, message: '请输入驳回理由' }, {
            validator: (r, value) => {
              if (!value || (value.length >= 5 && value.length <= 500)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('长度为5-500字符'));
            },
          }]}
          required
        >
          <Input.TextArea maxLength={500} minLength={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

ClaimRejectionModal.defaultProps = {
  cancelCb: () => {},
  successCb: () => {},
};
export default React.memo(ClaimRejectionModal);

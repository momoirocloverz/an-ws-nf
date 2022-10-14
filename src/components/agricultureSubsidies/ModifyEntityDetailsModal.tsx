import React, {
  useEffect, useMemo, useState,
} from 'react';
import {
  Form, Modal, message,
} from 'antd';
import { modifyEntity } from '@/services/agricultureSubsidies';
import { EntityInformation } from '@/components/agricultureSubsidies/EntityInformation';
import styles from './LandClaimFilingForm.less';

type ContextObject = {
  id: string | undefined;
  ownershipType: number;
  hasResidenceCard: number;
  phoneNumber: string;
  name: string;
  idNumber: string;
}

type ClaimDetailsModalProps = {
  context: ContextObject;
  visible: boolean;
  cancelCb?: () => unknown;
  successCb?: () => unknown;
}

function ModifyEntityDetailsModal({
  context, visible, cancelCb, successCb,
}: ClaimDetailsModalProps) {
  const [formRef] = Form.useForm();
  const [controlledFieldsValues, setControlledFieldsValues] = useState({});

  useEffect(() => {
    if (visible && context.id) {
      formRef.resetFields();
    }
  }, [visible, context]);

  const handleSubmit = async () => {
    try {
      await formRef.validateFields();
    } catch (e) {
      return;
    }
    const values: any = { ...(formRef.getFieldsValue()), ...controlledFieldsValues };
    try {
      const requestResult = await modifyEntity({
        id: context.id,
        ownershipType: values.ownershipType,
        contractor: values.contractor,
        idNumber: values.idNumber,
        legalRep: values.legalRep,
        phoneNumber: values.phoneNumber,
        accountNumber: values.accountNumber,
        idFront: values.idFront?.[0]?.uid,
        idBack: values.idBack?.[0]?.uid,
        licenses: values.licenses?.map((e) => e.uid).join(', ') ?? '',
        creditUnionCode: values.creditUnionCode,
        bankName: values.bankName,
        hasResidenceCard: context.hasResidenceCard,
      });
      if (requestResult.code === 0 || requestResult.code === 31) {
        message.success('修改成功!');
        if (typeof successCb === 'function') {
          successCb();
        }
      } else if (requestResult.code) {
        message.error(`修改失败: ${requestResult.msg}`);
      }
    } catch (e) {
    //  ....
    }
  };

  const disabledFields = useMemo(() => {
    switch (context.ownershipType) {
      case 1: {
        return ['idNumber', 'ownershipType', 'contractor'];
      }
      case 2: {
        /**
         * 2022-08-10
         * 来自小程序的数据，以下字段不可编辑：性质、法人姓名、法人身份证、承包商、信用社代码
         * 来自导入的数据，除了“性质、社会信用代码”，其他字段可编辑，更新该条数据
         * **/
        console.log('context----',context)

        let defaultArray = [ 'ownershipType','creditUnionCode'];
        if(context.admin_id ===0){
          defaultArray = ['ownershipType','creditUnionCode','legalRep','idNumber','contractor']
        }
        return defaultArray;
      }
      default: {
        return [ 'ownershipType','creditUnionCode'];
      }
    }
  }, [context]);

  return (
    <Modal
      visible={visible}
      onCancel={cancelCb}
      title="编辑"
      width={800}
      // wrapClassName={styles.detailsModalWrapper}
      onOk={handleSubmit}

    >

      <Form
        form={formRef}
        initialValues={
          context
        }
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12, offset: -4 }}
        className={styles.filingForm}
      >
        <EntityInformation
          initialValues={context}
          onControlledFieldsChange={(v) => setControlledFieldsValues(v)}
          disabledFields={disabledFields}
          requireVerificationCode={false}
        />
      </Form>
    </Modal>
  );
}

ModifyEntityDetailsModal.defaultProps = {
  cancelCb: () => {},
  successCb: () => {},
};
export default React.memo(ModifyEntityDetailsModal);

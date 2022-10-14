/* eslint-disable no-unused-vars */
import {
  Button, Form, message, Modal, Steps, Spin,
} from 'antd';
import React, {
  memo, useEffect, useMemo, useState, useRef,
} from 'react';
import { CascaderOptionType } from 'antd/es/cascader';
import { Moment } from 'moment';
import BasicUserInfo from '@/components/agricultureSubsidies/BasicUserInfo';
import FacialRecognition from '@/components/agricultureSubsidies/FacialRecognition';
import LandClaimFilingForm from '@/components/agricultureSubsidies/LandClaimFilingForm';
import {
  checkResidency, findEntity, getProspects, submitClaim, verifyBusiness,
} from '@/services/agricultureSubsidies';
import { CheckCircleOutlined, LoadingOutlined, StopOutlined } from '@ant-design/icons';
import { transformUploadedImageData } from '@/pages/agricultureSubsidies/utils';
import { BasicSubsidyUser, LandObjectType, SubsidyUser } from '@/pages/agricultureSubsidies/types';
import styles from './LandClaimFilingModal.less';

type ContextObject = {
  categoryTree: CascaderOptionType[];
  selectedLands: LandObjectType[];
  loadingData?: boolean;
  year: Moment;
  season: string;
  region: string[];
  regionNamePath: string[];
  regionTree: CascaderOptionType[];
}
type LandClaimFilingModalProps = {
  context: ContextObject;
  visible: boolean;
  accountInfo: any;
  cancelCb?: () => unknown;
  successCb?: () => unknown;
  onFinish?: () => unknown;
}
const { Step } = Steps;

function LandClaimFilingModal({
  context, visible, accountInfo, cancelCb, successCb, onFinish,
}: LandClaimFilingModalProps) {
  // progress
  const expirationTimer = useRef<number | null>(null);
  const [stage, setStage] = useState(0);
  const [status, setStatus] = useState<'wait' | 'error' | 'process' | 'finish' | undefined>('process');
  // user verification
  const [hasVerified, setHasVerified] = useState(false);
  // form data
  const [user, setUser] = useState<BasicSubsidyUser>({ name: undefined, idNumber: undefined, ownershipType: undefined });
  const [subsidyUser, setSubsidyUser] = useState<SubsidyUser>({ ownershipType: -1, idNumber: '', hasResidenceCard: 0 });
  // const [[claimFormRef], [userFormRef]] = [Form.useForm(), Form.useForm()];
  const [claimFormRef] = Form.useForm();
  const [controlledFieldsValues, setControlledFieldsValues] = useState({});
  // submission
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const businessVerificationChannel = useRef(new BroadcastChannel('verification-channel'));
  const [businessVerificationToken, setBusinessVerificationToken] = useState('');
  const [submissionParams, setSubmissionParams] = useState({});
  // submission result
  const [submissionStatusString, setSubmissionStatusString] = useState('等待提交');

  useEffect(() => {
    if (readyToSubmit) {
      if(Object.prototype.toString.call( submissionParams.season ).indexOf('Array')>-1){
        submissionParams.season = submissionParams.season[0]
      }
      submitClaim({ ...submissionParams, businessVerificationToken }).then((res) => {
        if (res.code === 0) {
          setSubmissionStatusString('提交成功');
          setStatus('finish');
          if (typeof successCb === 'function') {
            successCb();
          }
          // setTimeout(() => history.replace('/agriculture-subsidies/farmland-map'), 2000);
        } else {
          message.error(`申报失败: ${res.msg}`);
          setSubmissionStatusString(`申报失败: ${res.msg}`);
          setStatus('error');
        }
        setStage(3);
      }).catch((e) => {
        setSubmissionStatusString(`提交失败: ${e.message}`);
        // setStatus('error');
      }).finally(() => setIsSubmitting(false));
    }
  }, [readyToSubmit]);

  useEffect(() => {
    businessVerificationChannel.current.onmessage = (e) => {
      switch (e.data.type) {
        case 'verified': {
          setBusinessVerificationToken(e.data.token);
          setReadyToSubmit(true);
          break;
        }
        default:
      }
    };
    return () => {
      if (expirationTimer.current) {
        clearTimeout(expirationTimer.current);
      }
      businessVerificationChannel.current.onmessage = null;
    };
  }, []);
  const restart = () => {
    if (expirationTimer.current) {
      clearTimeout(expirationTimer.current);
    }
    setStage(0);
    setStatus('process');
    setHasVerified(false);
    setReadyToSubmit(false);
    setBusinessVerificationToken('');
    setSubmissionStatusString('等待提交');
    setIsSubmitting(false);
  };
  const afterUserVerified = () => {
    // @ts-ignore
    expirationTimer.current = setTimeout(() => {
      restart();
    }, 1000 * 60 * 30);
    setHasVerified(true);
  };
  const handleNextStep = async () => {
    switch (stage) {
      case 0: {
        try {
          const result = await getProspects({
            region: context.region, name: user.name, idNumber: user.idNumber, page: 1, pageSize: 10,
          });
          if (result.code === 0) {
            if (result.data.total > 1) {
              setStage(1);
              console.log('临时解开限制')
              throw new Error('发现重复人员, 请检查确保的唯一性');
            } else if (result.data.total === 1) {
              setStage(1);
            } else {
              throw new Error('当前申报人员不在可申报人员列表中');
            }
          } else {
            throw new Error(result.msg);
          }
        } catch (e) {
          message.error(`身份认证失败: ${e.message}`);
        }
        break;
      }
      case 1: {
        try {
          const [residency, savedUser] = await Promise.all([checkResidency(user?.idNumber, user.name, user.ownershipType), findEntity(user)]);
          if (savedUser.data.id !== undefined) {
            setSubsidyUser({
              ownershipType: savedUser.data.subsidy_type,
              idNumber: savedUser.data.identity,
              contractor: savedUser.data.real_name,
              legalRep: savedUser.data.legal_name,
              bankName: savedUser.data.bank_name,
              accountNumber: savedUser.data.bank_card_number,
              creditUnionCode: savedUser.data.credit_num,
              hasResidenceCard: savedUser.data.is_citizen_card,
              phoneNumber: savedUser.data.mobile,
              idFront: transformUploadedImageData([savedUser.data.identity_card_front]),
              idBack: transformUploadedImageData([savedUser.data.identity_card_back]),
              licenses: transformUploadedImageData(savedUser.data.business_license ?? []),
            });
          } else {
            const newUser: SubsidyUser = {
              ownershipType: user.ownershipType ?? 1,
              idNumber: user.idNumber ?? '',
              hasResidenceCard: 0,
            };
            if (user.ownershipType === 1) {
              newUser.contractor = user.name;
            }
            if (user.ownershipType === 2) {
              newUser.legalRep = user.name;
            }
            if (residency.data.bank_card) {
              newUser.bankName = residency.data.bank_name;
              newUser.accountNumber = residency.data.bank_card;
              newUser.hasResidenceCard = 1;
            }
            setSubsidyUser(newUser);
          }
          setStage(2);
        } catch (e) {
          message.error(e.message);
        }
        break;
      }
      case 2: {
        try {
          await claimFormRef.validateFields();
        } catch (e) {
          return;
        }
        try {
          const values = { ...(claimFormRef.getFieldsValue()), ...controlledFieldsValues, hasResidenceCard: subsidyUser.hasResidenceCard };
          setIsSubmitting(true);
          setSubmissionParams(values);
          if (user?.ownershipType === 1) {
            setReadyToSubmit(true);
          }
          if (user?.ownershipType === 2) {
            await verifyBusiness();
          }
        } catch (e) {
          // ...
        } finally {
          // ...
        }
        break;
      }
      case 3: {
        if (typeof onFinish === 'function') {
          onFinish();
        }
        restart();
        break;
      }
      default:
    }
  };
  const content = useMemo(() => {
    let frag: JSX.Element | null = null;
    switch (stage) {
      case 0: {
        frag = (
          <div className={styles.userInfoBox}>
            <BasicUserInfo onChange={(u) => setUser(u)} />
          </div>
        );
        break;
      }
      case 1: {
        frag = (
          <div className={styles.verificationBox}>
            <div className={styles.userInfoBox}>
              <BasicUserInfo user={user} disabled />
            </div>
            <FacialRecognition user={user} successCb={afterUserVerified} />
          </div>
        );
        break;
      }
      case 2: {
        frag = (
          <div className={styles.formBox}>
            <LandClaimFilingForm user={subsidyUser} accountInfo={accountInfo} context={context} claimFormRef={claimFormRef} onControlledFieldsChange={(v) => setControlledFieldsValues(v)} />
          </div>
        );
        break;
      }
      case 3: {
        frag = (
          <div className={styles.resultBox}>
            {
              // eslint-disable-next-line no-nested-ternary
              status === 'finish'
                ? (
                  <>
                    <CheckCircleOutlined style={{ color: 'green' }} />
                    {`   ${submissionStatusString}!`}
                  </>
                )
                : status === 'error'
                  ? (
                    <>
                      <StopOutlined style={{ color: 'red' }} />
                      {`   ${submissionStatusString}!`}
                    </>
                  )
                  : (
                    <>
                      <StopOutlined style={{ color: 'red' }} />
                      {'  系统错误!'}
                    </>
                  )
            }
          </div>
        );
        break;
      }
      default: {
        frag = <span>未知阶段</span>;
      }
    }
    return frag;
  }, [stage, visible]);
  const nextText = useMemo(() => {
    let text = '下一步';
    if (stage === 2) {
      text = '提交';
    }
    if (stage === 3) {
      text = '完成';
    }
    return text;
  }, [stage]);
  const isNextDisabled = (() => {
    let isDisabled = true;
    switch (stage) {
      case 0: {
        if (user?.idNumber && user.ownershipType && user.name) {
          isDisabled = false;
        }
        break;
      }
      case 1: {
        if (hasVerified) {
          isDisabled = false;
        }
        break;
      }
      case 2:
      case 3: {
        isDisabled = false;
        break;
      }
      default:
    }
    return isDisabled;
  })();
  return (
    <Modal
      visible={visible}
      onCancel={cancelCb}
      getContainer={false}
      title="申报"
      width={800}
      wrapClassName={styles.modalWrapper}
      // forceRender
      footer={[
        <Button key="restart" onClick={restart} disabled={stage === 0}>重新开始</Button>,
        <Button
          key="next"
          onClick={handleNextStep}
          disabled={isNextDisabled}
          loading={isSubmitting}
        >
          {nextText}
        </Button>,
      ]}
    >
      <Steps current={stage} status={status}>
        <Step title="填写申报人基本信息" />
        <Step title="申报人身份验证" />
        <Step title="填写申报信息" />
        <Step title="提交结果" />
      </Steps>
      <div className={styles.content}>
        <Spin spinning={isSubmitting} tip="处理中..." indicator={<LoadingOutlined />}>
          {content}
        </Spin>
      </div>
    </Modal>
  );
}

LandClaimFilingModal.defaultProps = {
  cancelCb: () => {},
  successCb: () => {},
  onFinish: () => {},
};

export default memo(LandClaimFilingModal);

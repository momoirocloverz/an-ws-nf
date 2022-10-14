import React, {
  useEffect, useRef, useState,
} from 'react';
import { Spin } from 'antd';
import { modifyClaim, submitClaim, verifyIndividual } from '@/services/agricultureSubsidies';
import { StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { history } from '@@/core/history';
import { CLAIM_FORM_ACTION } from '@/pages/agricultureSubsidies/consts';
import styles from './IdentityVerified.less';

function IdentityVerified() {
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const savedForm = useRef<any>(JSON.parse(localStorage.getItem('wsnf_pending_subsidy_claim_form') ?? '{}'));
  const [status, setStatus] = useState(0);
  const [statusText, setStatusText] = useState<JSX.Element>(<span>{'  校验信息中...'}</span>);
  const businessVerificationChannel = useRef(new BroadcastChannel('verification-channel'));

  const moveToErrorState = (actionText, message) => {
    setStatus(3);
    const errorText = (
      <>
        <StopOutlined style={{ color: 'red' }} />
        {`  ${actionText}失败: ${message}`}
      </>
    );
    setStatusText(errorText);
    console.error(`${actionText}失败原因: ${message}`);
  };

  useEffect(() => {
    switch (status) {
      // validate url
      case 0: {
        const query = new URLSearchParams(window.location.search);
        try {
          if (query.get('code') === '0' && query.has('param')) {
            const verificationToken = (new URLSearchParams(window.location.search)).get('param');
            localStorage.setItem('wsnf_pending_subsidy_claim_form', JSON.stringify({ ...(savedForm.current), businessVerificationToken: verificationToken }));
            setIsUrlValid(true);
            setStatus(2);
            // verifyIndividual();
          } else {
            throw new Error('Invalid URL');
          }
        } catch (e) {
          setStatus(1);
          setIsUrlValid(false);
        }
        break;
      }
      // validation failed
      case 1: {
        const text = (
          <>
            <StopOutlined style={{ color: 'red' }} />
            {'  校验失败!'}
          </>
        );
        setStatusText(text);
        break;
      }
      // submitting
      case 2: {
        businessVerificationChannel.current.postMessage({ type: 'verified', token: (new URLSearchParams(window.location.search)).get('param') });
        const text = (
          <div>
            <CheckCircleOutlined style={{ color: 'green' }} />
            {'   验证成功, 本页面即将自动关闭!'}
          </div>
        );
        setStatusText(text);
        setTimeout(() => { window.close(); }, 5000);
        // setIsSubmitting(true);
        // const text = (<span>{'  提交中...'}</span>);
        // setStatusText(text);
        // if (savedForm.current.action === CLAIM_FORM_ACTION.CREATE) {
        //   submitClaim({
        //     ...(savedForm.current),
        //     selectedLandIds: savedForm.current.selected.map((l) => l.id),
        //     documentIds: savedForm.current.documents?.map((d) => d.uid).join(', ') ?? '',
        //     businessVerificationToken: (new URLSearchParams(window.location.search)).get('param'),
        //   }).then((r) => {
        //     setIsSubmitting(false);
        //     if (r.code === 0) {
        //       setStatus(4);
        //     } else {
        //       moveToErrorState('提交', r.msg || r.message);
        //     }
        //   });
        // } else if (savedForm.current.action === CLAIM_FORM_ACTION.MODIFY) {
        //   modifyClaim({
        //     ...(savedForm.current),
        //     selectedLandIds: savedForm.current.selected.map((l) => l.id),
        //     documentIds: savedForm.current.documents?.map((d) => d.uid).join(', ') ?? '',
        //     businessVerificationToken: (new URLSearchParams(window.location.search)).get('param'),
        //   }).then((r) => {
        //     setIsSubmitting(false);
        //     if (r.code === 0) {
        //       setStatus(4);
        //     } else {
        //       moveToErrorState('提交修改', r.msg || r.message);
        //     }
        //   });
        // } else {
        //   moveToErrorState('操作', '未知操作类型');
        // }
        break;
      }
      case 3: {
        break;
      }
      case 4: {
        const text = (
          <div>
            <CheckCircleOutlined style={{ color: 'green' }} />
            {'   提交成功!'}
          </div>
        );
        setStatusText(text);
        setTimeout(() => history.replace('/agriculture-subsidies/farmland-map'), 2000);
        break;
      }
      default:
    }
  }, [status]);

  useEffect(() => () => {
    businessVerificationChannel.current.close();
  }, []);

  return (
    <div className={styles.verifiedLayout}>
      <div className={styles.messageBox}>
        <Spin spinning={isUrlValid === null || (isUrlValid && isSubmitting)} />
        {statusText}
      </div>
    </div>
  );
}

export default IdentityVerified;

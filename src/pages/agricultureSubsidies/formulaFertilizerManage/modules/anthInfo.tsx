import {Avatar, message, Modal, Image} from "antd";
import styles from './../index.less'
import {viewEntityDetails} from "@/services/agricultureSubsidies";
import React, {useEffect, useState} from "react";
import {UserOutlined} from "@ant-design/icons";

type PropType = {
  context: {},
  natureEnum: {},
  visible: boolean,
  onCancel?: () => unknown,
}

function anthInfo({ visible, context, onCancel, natureEnum }: PropType) {
  useEffect(() => {
    visible && getDetail();
    !visible && setUserInfo({});
  }, [visible]);

  const [userInfo, setUserInfo] = useState({});

  const getDetail = async () => {
    try {
      if (!context.subsidy_id) return;
      const result = await viewEntityDetails(context.subsidy_id);
      setUserInfo(result.data[0]);
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <Modal
      visible={visible}
      title="认证信息"
      onCancel={onCancel}
      onOk={onCancel}
    >
      <div className={styles.auth_info}>
        <div className={styles.items}>
          <p>补贴对象性质</p>
          <p>{ natureEnum[userInfo.subsidy_type] || '-' }</p>
        </div>
        <div className={styles.items}>
          <p>承包人</p>
          <p>{ userInfo.real_name || '-' }</p>
        </div>
        {
          userInfo.subsidy_type === 2 ? (
            <div className={styles.items}>
              <p>法人姓名</p>
              <p>{ userInfo.legal_name || '-' }</p>
            </div>
          ) : null
        }
        <div className={styles.items}>
          <p>身份证</p>
          <p>{ userInfo.identity || '-' }</p>
        </div>
        <div className={styles.items}>
          <p>开户行</p>
          <p>{ userInfo.bank_name || '-' }</p>
        </div>
        <div className={styles.items}>
          <p>{ userInfo.subsidy_type === 1 ? '银行卡号' : '对公账户' }</p>
          <p>{ userInfo.bank_card_number || '-' }</p>
        </div>
        <div className={styles.items}>
          <p>电话</p>
          <p>{ userInfo.mobile || '-' }</p>
        </div>
        {
          userInfo.subsidy_type === 2 ? (
            <div className={styles.items}>
              <p>信用社代码</p>
              <p>{ userInfo.credit_num || '-' }</p>
            </div>
          ) : null
        }
        {
          userInfo.subsidy_type === 1 ? (
            <div className={styles.items}>
              <p>身份证</p>
              <Image.PreviewGroup>
                <Image width={140} height={100} src={userInfo.identity_card_front?.url} />
                <Image width={140} height={100} src={userInfo.identity_card_back?.url} />
              </Image.PreviewGroup>
            </div>
          ) : (
            <div className={styles.items}>
              <p>营业执照</p>
              {
                userInfo?.business_license?.length ? (
                  <Image.PreviewGroup>
                    {
                      userInfo.business_license.map(item => (<Image width={140} height={100} src={item.url} key={item.id} />))
                    }
                  </Image.PreviewGroup>
                ) : null
              }
            </div>
          )
        }
      </div>
    </Modal>
  )
}
export default anthInfo;

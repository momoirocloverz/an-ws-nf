import { Button, Form, message, Input, Card, Row, Col } from 'antd';
import React, { useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import { passwordEncrypt, validatePassword, passwordEncryption } from '@/utils/utils';
import { changePassWord } from '@/services/system';
import { Link, connect } from 'umi';
import { ConnectState } from "@/models/connect";

const FormItem = Form.Item;

const PasswordInfo: React.FC<any> = (props) => {
  const { pubKey } = props;
  const [form] = Form.useForm();
  const subForm = async () => {
    const fieldsValue: any = await form.validateFields();
    const _params = {
      password: passwordEncrypt(fieldsValue.oldPassword),
      new_password: passwordEncrypt(fieldsValue.newPassword),
      sign_password: passwordEncryption(
        fieldsValue.oldPassword,
        pubKey
      ),
      new_sign_password: passwordEncryption(
        fieldsValue.newPassword,
        pubKey
      )
    }
    const _data: any = await changePassWord(_params)
    if (_data.code === 0) {
      message.success('密码更新成功！')
      form.resetFields();
    } else {
      message.error('更新失败，请重新提交')
    }
  }

  return (
    <PageHeaderWrapper title="修改密码">
      <Card style={{ width: '100%', minHeight: '100%', paddingBottom: '50px' }}>
        <Form
          style={{ paddingBottom: '30px', paddingTop: '100px'}}
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
        >
            
          <FormItem
            name="oldPassword"
            label="原密码"
            rules={[{ required: true, message: '请输入原密码'}]}
          >
            <Input.Password />
          </FormItem>
          <FormItem
            name="newPassword"
            label="新密码"
            rules={[{validator: (r, v) => {
              return validatePassword(v);
            }}]}
          >
            <Input.Password />
          </FormItem>
          <FormItem
            name="confirm"
            label="再次输入新密码"
            dependencies={['newPassword']}
            required
            rules={[
              // {
              //   required: true,
              //   message: '请再次输入密码',
              //   max: 20
              // },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (getFieldValue('newPassword') !== value && value !== '') {
                    return Promise.reject('您两次输入的新密码不匹配');
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password />
          </FormItem>
        </Form>
        <div className={styles.main}>
          <Row gutter={10}>
            <Col className="gutter-row" span={2}>
            <Button type="primary" onClick={ subForm }>
              确定
            </Button>
            </Col>
            <Col className="gutter-row" span={2}>
              <Link to="/index">
                <Button>
                  取消
                </Button>
              </Link>
            </Col>
          </Row>
        </div>
      </Card>
    </PageHeaderWrapper>
  );
};


export default connect(({ login }: ConnectState) => ({
  pubKey: login.pubKey
}))(PasswordInfo)
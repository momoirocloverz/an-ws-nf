import { Checkbox, Form, Input, message, Modal, Button } from "antd";
import { MobileOutlined, CommentOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import { connect, Dispatch, history } from "umi";
import { StateType } from "@/models/login";
import { LoginParamsType } from "@/services/login";
import { sendSms, smsLogin, afterCodeLogin, getPublicKey } from "@/services/secretLogin";
import { ConnectState } from "@/models/connect";
import LoginFrom from "./components/Login";
import CryptoJS from "crypto-js";
import { PUBLIC_KEY } from '@/services/api';
import Cookies from 'js-cookie';
import styles from './style.less';
import e from 'express';
import Captcha from "@/components/Captcha/index";
import { passwordEncryption } from '@/utils/utils';

const { UserName, Password, Submit } = LoginFrom;

interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
  loginRes?: StateType;
}

const Login: React.FC<LoginProps> = (props) => {
  const { submitting, dispatch, loginRes } = props;
  const [autoLogin, setAutoLogin] = useState(true);
  const [activeIndex, setActiveIndex] = useState("1");
  const [timerText, setTimerText] = useState("获取验证码");
  const [timerBtnDisabled, setTimerBtnDisabled] = useState(false);
  const [smsBtnDisabled, setSmsBtnDisabled] = useState(false);
  const [bindCodeBtnDisabled, setBindCodeBtnDisabled] = useState(false);
  const [pubKey, setPubKey] = useState('');
  let [updateCaptcha, setUpdateCaptcha] = useState(0);
  const captchaRef = useRef();

  let [counter, setCounter] = useState(60);
  const [qrSource, setQrSource] = useState("");
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  let [afterCodeObj, setAfterCodeObj] = useState({});
  // 加密
  // const encrypt = (word: any) => {
  //   var key = CryptoJS.enc.Utf8.parse(PUBLIC_KEY);
  //   var srcs = CryptoJS.enc.Utf8.parse(word);
  //   var encrypted = CryptoJS.AES.encrypt(srcs, key, {
  //     mode: CryptoJS.mode.ECB,
  //     padding: CryptoJS.pad.Pkcs7
  //   });
  //   return encrypted.toString();
  // };

  // 解密
  const decrypt = (word: any) => {
    var key = CryptoJS.enc.Utf8.parse(PUBLIC_KEY);
    var decrypt = CryptoJS.AES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  };

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    const loginInfo = {
      account: values.user_name,
      password: values.password,
      sign_password: passwordEncryption(
        values.password,
        pubKey,
      )
    };
    if (autoLogin) {
      Cookies.set("loginInfo", JSON.stringify(loginInfo));
    } else {
      Cookies.remove("loginInfo");
    }
    dispatch({
      type: "login/login",
      payload: { 
        ...values,
        captcha: captchaRef.current?.captcha ?? '',
        key: captchaRef.current?.key ?? '',
        sign_password: passwordEncryption(
          values.password,
          pubKey,
        )
      }
    });
  };

  const setPassWord = (e: any) => {
    setAutoLogin(e.target.checked);
  };

  const getAccount = (val: string) => {
    let _data = "";
    if (Cookies.get("loginInfo")) {
      if (val === "password") {
        let datas = JSON.parse(Cookies.get("loginInfo") || "{}");
        if (datas[val]) {
          _data = datas[val];
        }
      } else {
        _data = JSON.parse(Cookies.get("loginInfo") || "{}")[val];
      }
    } else {
      _data = "";
    }
    return _data;
  };
  
  const changeActive = (index: string) => {
    setActiveIndex(index);
    if (index == "1") {
      window.timer1 = setInterval(() => {
        let qrResponseCode = sessionStorage.getItem("qrResponseCode")
          ? sessionStorage.getItem("qrResponseCode")
          : "";
        if (qrResponseCode) {
          if (qrResponseCode != "undefined" || qrResponseCode != undefined) {
            clearInterval(window.timer1);
            fetch(`${qrSource}/admin/zhezd/get_access_token`, {
              method: "POST"
            })
              .then((response) => response.json())
              .catch((err) => {
                console.log("err", err);
              })
              .then((res) => {
                if (res.code == 0) {
                  if (res.data.success) {
                    if (res.data.content.success) {
                      const formData = new FormData();
                      formData.append('access_token', res.data.content.data.accessToken);
                      formData.append('code', qrResponseCode);
                      fetch(`${qrSource}/admin/zhezd/get_userinfo_by_bode`, {
                        method: 'POST',
                        body: formData,
                      })
                        .then((response1) => response1.json())
                        .catch((err1) => {
                          console.log(err1);
                        })
                        .then((res1) => {
                          console.log(res1);
                          if (res1.code === 0) {
                            if (res1.data.success) {
                              if (res1.data.content.success) {
                                afterCodeLogin({
                                  login_type: '3',
                                  tenantUserId: res1.data.content.data.tenantUserId,
                                  accountId: res1.data.content.data.accountId,
                                  account: res1.data.content.data.account,
                                  realmId: res1.data.content.data.realmId,
                                  nickname: res1.data.content.data.nickNameCn
                                })
                                  .then((res2) => {
                                    console.log(res2);
                                    if (res2.code === 0) {
                                      if (res2.data.accountType == 2) {
                                        setAfterCodeObj({
                                          login_type: "3",
                                          tenantUserId: res1.data.content.data.tenantUserId,
                                          accountId: res1.data.content.data.accountId,
                                          account: res1.data.content.data.account,
                                          realmId: res1.data.content.data.realmId,
                                          nickname: res1.data.content.data.nickNameCn
                                        });
                                        setModalVisible(true);
                                        message.info("需要绑定账号");
                                      } else {
                                        localStorage.setItem(
                                          "userInfo",
                                          JSON.stringify(res2.data.adminInfo)
                                        );
                                        sessionStorage.removeItem("qrResponseCode");
                                        dispatch({
                                          type: "userLogin/saveAccountInfo",
                                          payload: res2.data
                                        });
                                        setTimeout(() => {
                                          history.push("/index");
                                        }, 100);
                                        if (!!res2.data.tokeInfo.token) {
                                          localStorage.setItem(
                                            "WSNF_TOKEN",
                                            res2.data.tokeInfo.token
                                          );
                                        }
                                      }
                                    } else {
                                      message.error(res2.msg);
                                    }
                                  })
                                  .catch((err2) => {
                                    console.log(err2);
                                  });
                              } else {
                                message.error(res1.data.content.responseMessage);
                                sessionStorage.removeItem("qrResponseCode");
                                changeActive("1");
                              }
                            } else {
                              message.error(res1.msg);
                            }
                          } else {
                            message.error(res1.msg);
                          }
                        });
                    } else {
                      message.error(res.data.content.responseMessage);
                    }
                  } else {
                    message.error(res.msg);
                  }
                } else {
                  message.error(res.msg);
                }
              });
          }
        }
      }, 900);
    } else {
      sessionStorage.removeItem("qrResponseCode");
      clearInterval(window.timer1);
    }
  };
  const checkMobile = (_: any, value: { number: number }) => {
    const phoneReg = /^1[3-9]\d{9}$/;
    const result = phoneReg.test(value);
    if (value) {
      if (result) {
        return Promise.resolve();
      } else {
        return Promise.reject(new Error("请输入正确手机号"));
      }
    } else {
      return Promise.reject(new Error("手机号不能为空"));
    }
  };
  const timerAction = (e) => {
    e.preventDefault();
    let mobileValue = form.getFieldValue("mobile");
    if (mobileValue) {
      const phoneReg = /^1[3-9]\d{9}$/;
      const result = phoneReg.test(mobileValue);
      if (result) {
        if (!timerBtnDisabled) {
          let data = {
            mobile: mobileValue
          };
          setTimerBtnDisabled(true);
          sendSms(data)
            .then((res: any) => {
              if (res && res.code === 0) {
                message.success("短信验证码发送成功");
                window.timer2 = setInterval(() => {
                  setCounter(counter--);
                  setTimerText(`${counter}s后重新发送`);
                  if (counter == 0) {
                    setTimerBtnDisabled(false);
                    setCounter(60);
                    setTimerText("获取验证码");
                    clearInterval(window.timer2);
                  }
                }, 1000);
              } else {
                message.error(res.msg);
                setTimerBtnDisabled(false);
              }
            })
            .catch((err) => {
              console.log(err);
              setTimerBtnDisabled(false);
            });
        }
      } else {
        message.error("请输入正确手机号");
      }
    } else {
      message.error("手机号不能为空");
    }
  };
  const smsLoginAction = (e) => {
    e.preventDefault();
    if (!smsBtnDisabled) {
      form
        .validateFields()
        .then((res) => {
          setSmsBtnDisabled(true);
          smsLogin({
            mobile: res.mobile,
            code: res.sms,
            login_type: '2',
          })
            .then((res1) => {
              if (res1.code === 0) {
                localStorage.setItem("userInfo", JSON.stringify(res1.data.adminInfo));
                dispatch({
                  type: "userLogin/saveAccountInfo",
                  payload: res1.data
                });
                clearInterval(window.timer2);
                setTimeout(() => {
                  history.push("/index");
                }, 100);
                if (!!res1.data.tokeInfo.token) {
                  localStorage.setItem("WSNF_TOKEN", res1.data.tokeInfo.token);
                }
              } else {
                message.error(res1.msg);
              }
            })
            .catch((err1) => {
              console.log(err1);
            })
            .finally(() => {
              setSmsBtnDisabled(false);
            });
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };
  let loginArea = <div></div>;
  if (activeIndex == "2") {
    loginArea = (
      <div className={styles.formContainer}>
        <LoginFrom onSubmit={handleSubmit}>
          <UserName
            name="user_name"
            placeholder="请输入登录账号"
            defaultValue={getAccount("account")}
            rules={[
              {
                required: true,
                message: "请输入账号!"
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  var reg = /^[\u4e00-\u9fa5a-zA-Z0-9_-]{0,}$/;
                  if (!reg.exec(value)) {
                    return Promise.reject("您输入的账号中含有非法字符，请重新输入");
                  } else {
                    return Promise.resolve();
                  }
                }
              })
            ]}
          />
          <Password
            name="password"
            placeholder="请输入密码"
            defaultValue={getAccount("password")}
            rules={[
              {
                required: true,
                message: "请输入密码！"
              }
            ]}
          />
          <Form.Item
            name="password"
            // rules={[
            //   {
            //     validateTrigger: 'submit',
            //     validator: () => {
            //       if(!captchaRef.current.validate()) {
            //         return Promise.reject(new Error('请输入正确的验证码'))
            //       }
            //       return Promise.resolve()
            //     }
            //   },
            // ]}
          >
            <Captcha ref={captchaRef} update={updateCaptcha}/>
          </Form.Item>
          <div>
            <Checkbox checked={autoLogin} onChange={setPassWord}>
              记住密码
            </Checkbox>
          </div>
          <Submit loading={submitting}>登录</Submit>
        </LoginFrom>
      </div>
    );
  } else if (activeIndex == "1") {
    loginArea = (
      <div>
        <iframe
          className={styles.loginIFrame}
          src="https://login-pro.ding.zj.gov.cn/oauth2/auth.htm?response_type=code&client_id=phdsjzx_dingoa&redirect_uri=http://pinghu-szgzt-admini.hzanchu.com&scope=get_user_info&authType=QRCODE&embedMode=true"
        ></iframe>
      </div>
    );
  } else {
    loginArea = (
      <div>
        <Form form={form}>
          <Form.Item label="" name="mobile" trigger="onChange" rules={[{ validator: checkMobile }]}>
            <Input
              prefix={
                <MobileOutlined
                  style={{
                    color: "#1890ff"
                  }}
                />
              }
              size="large"
              placeholder="请输入手机号"
              bordered={false}
              maxLength={11}
            />
          </Form.Item>
          <Form.Item
            label=""
            name="sms"
            trigger="onChange"
            rules={[{ required: true, message: "请输入验证码!" }]}
          >
            <div className={styles.smsMasterCon}>
              <div>
                <Input
                  prefix={
                    <CommentOutlined
                      style={{
                        color: "#1890ff"
                      }}
                    />
                  }
                  size="large"
                  className={styles.smsInput}
                  placeholder="请输入验证码"
                  bordered={false}
                  maxLength={6}
                />
              </div>
              <div>
                <button
                  className={styles.getSms}
                  disabled={timerBtnDisabled}
                  onClick={(e) => timerAction(e)}
                >
                  {timerText}
                </button>
              </div>
            </div>
          </Form.Item>

          <Form.Item>
            <button
              className={styles.smsLoginBtn}
              disabled={smsBtnDisabled}
              onClick={(e) => smsLoginAction(e)}
            >
              登 录
            </button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  useEffect(() => {
    if (REACT_APP_ENV) {
      if (REACT_APP_ENV == "dev") {
        setQrSource("http://pinghu-szgzt-apiadmini.hzanchu.com");
      } else if (REACT_APP_ENV == "pre") {
        setQrSource("http://pre-pinghu-szgzt-apiadmini.hzanchu.com");
      }
    } else {
      setQrSource("https://pinghu-szgzt-apiadmini.zjsszxc.com");
    }
    // 获取公钥
    getPublicKey({}).then((res) => {
      if (res.code === 0) {
        setPubKey(res?.data?.content);
      }
    });
    // dispatch({
    //   type: 'login/pubKey'
    // })
  }, []);

  useEffect(() => {
    sessionStorage.removeItem("qrResponseCode");
    clearInterval(window.timer1);
    changeActive("1");
  }, [qrSource]);

  useEffect(() => {
    if(loginRes?.code !== 0) {
      setUpdateCaptcha(updateCaptcha += 1);
    }
  }, [loginRes])

  const resetBindCodeContent = () => {
    modalForm.resetFields();
  };
  const handleOk = () => {
    if (!bindCodeBtnDisabled) {
      modalForm
        .validateFields()
        .then((res) => {
          setBindCodeBtnDisabled(true);
          afterCodeObj.password = res.password;
          afterCodeObj.user_name = res.userName;
          afterCodeObj.sign_password = passwordEncryption(
            res.password,
            pubKey,
          );
          afterCodeLogin(afterCodeObj)
            .then((res2) => {
              if (res2.code === 0) {
                localStorage.setItem("userInfo", JSON.stringify(res2.data.adminInfo));
                sessionStorage.removeItem("qrResponseCode");
                dispatch({
                  type: "userLogin/saveAccountInfo",
                  payload: res2.data
                });
                setTimeout(() => {
                  history.push("/index");
                }, 100);
                if (!!res2.data.tokeInfo.token) {
                  localStorage.setItem("WSNF_TOKEN", res2.data.tokeInfo.token);
                }
              } else {
                message.error(res2.msg);
              }
            })
            .catch((err2) => {
              console.log(err2);
            })
            .finally(() => {
              setBindCodeBtnDisabled(false);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleCancel = async () => {
    setModalVisible(false);
    await modalForm.resetFields();
  };
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 }
  };

  return (
    <div className={styles.loginBox}>
      <div className={styles.titleImg}>
        <img
          src="https://img.hzanchu.com/acimg/36e398f0e2d22495f2c79bb88caf4da0.png?x-oss-process=image/resize,l_300"
          alt="善治宝运营管理平台"
        />
      </div>
      <div className={styles.main}>
        <div className={styles.activeTypeCon}>
          <div
            onClick={() => changeActive("1")}
            className={`${styles.hover} ${activeIndex == "1" ? styles.activeItem : ""}`}
          >
            浙政钉扫码
          </div>
          <div
            onClick={() => changeActive("2")}
            className={`${styles.hover} ${activeIndex == "2" ? styles.activeItem : ""}`}
          >
            账号登录
          </div>
          <div
            onClick={() => changeActive("3")}
            className={`${styles.hover} ${activeIndex == "3" ? styles.activeItem : ""}`}
          >
            手机号登录
          </div>
        </div>
        {loginArea}
      </div>
      <Modal
        destroyOnClose
        centered
        className={styles.cusModal}
        maskClosable={false}
        visible={modalVisible}
        confirmLoading={loading}
        title="浙政钉账号绑定"
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={modalForm} name="nest-messages">
          <Form.Item
            name="userName"
            label=""
            rules={[
              { required: true, message: "请输入绑定用户名" },
              {
                min: 1,
                max: 30,
                message: "用户名少于30个字符"
              }
            ]}
          >
            <Input
              className={styles.specialInput}
              size="large"
              placeholder="请输入绑定用户名"
              bordered={false}
              maxLength={30}
            />
          </Form.Item>
          <Form.Item
            name="password"
            autoComplete="new-password"
            label=""
            rules={[{ required: true, message: "请输入绑定用户密码" }]}
          >
            <Input.Password
              autoComplete="new-password"
              size="large"
              placeholder="请输入绑定用户密码"
              bordered={false}
              maxLength={20}
            />
          </Form.Item>
          <Form.Item>
            <div className={styles.twinBtn}>
              <button
                className={styles.bindCodeBtn}
                disabled={bindCodeBtnDisabled}
                onClick={() => handleOk()}
              >
                使用绑定浙政钉
              </button>
              <button onClick={() => resetBindCodeContent()} className={styles.resetBindCodeBtn}>
                重置
              </button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects["login/login"],
  loginRes: login.userInfo,
}))(Login);

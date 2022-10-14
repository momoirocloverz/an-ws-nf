import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, Radio, message } from 'antd';
import { getMainCodeList } from '@/services/ItemManage';
import {addCollectList} from '@/services/ItemCollect';
import styles from './index.less';

const { Option } = Select;
const AddCollect: React.FC<any> = (props: any) => {
    console.log(props.addModalVisible);
    const addModalVisible = props.addModalVisible;
    const [radioScore, setRadioScore] = useState(undefined);
    const [regularVal, setRegularVal] = useState('');
    const [startVal, setStartVal] = useState('');
    const [downList, setDownList] = useState([]);
    const [endVal, setEndVal] = useState('');
    const [controlScore, setControlScore] = useState({
        visible: false,
        message: '请输入固定分值'
    });
    const FinishForm = () => {
        if (radioScore == '1' && regularVal == '') {
            setControlScore({ visible: true, message: '请输入固定分值' });
        }
        if (radioScore == '2') {
            if (startVal == '' && endVal == '') {
                setControlScore({ visible: true, message: '请输入起始值和结束值' })
            } else if (startVal == '') {
                setControlScore({ visible: true, message: '请输入起始值' })
            } else if (endVal == '') {
                setControlScore({ visible: true, message: '请输入结束值' })
            }
        }
        form.validateFields().then(res => {
            if(controlScore.visible){
                return;
            }
            let data={
                p_code:res.mainCode,
                p_name: downList[downList.map((e) => e.code).indexOf(res.mainCode)].name,
                s_code:res.childCode,
                is_all: 0,
                name:res.scoreName,
                direction:res.scoreType==1?'INCREASE':'DECREASE',
                p_type:radioScore,
                point:radioScore==1?regularVal:`${startVal}~${endVal}`,
                comment:res.useIntro
            };
            addCollectList(data).then(response=>{
                if(response.code==0){
                    message.success('新建成功');
                    props.handleAddSuccess();
                }
            })
        })
    }
    const [form] = Form.useForm();
    const layout = {
        labelCol: {
            span: 5
        },
        wrapperCol: {
            span: 19
        }
    }
    useEffect(() => {
        handleGetDownList()
    }, []);
    const handleGetDownList = () => {
        getMainCodeList().then(res => {
            if (res.code == 0) {
                setDownList(res.data);
            }
        })
    }
    const handleChangeRegular = (e) => {
        setRegularVal(e.target.value);
        if (regularVal) {
            setControlScore({ ...controlScore, visible: false });
        }
    }
    const handleChangeStart = (e) => {
        setStartVal(e.target.value);
        if (startVal && endVal == '') {
            setControlScore({ visible: true, message: '请输入结束值' })
        } else if (startVal && endVal) {
            setControlScore({ ...controlScore, visible: false });
        }
    }
    const handleChangeEnd = (e) => {
        setEndVal(e.target.value)
        if (endVal && startVal == '') {
            setControlScore({ visible: true, message: '请输入起始值' })
        } else if (startVal && endVal) {
            setControlScore({ ...controlScore, visible: false });
        }
    }
    const handleCancel=()=>{
        props.handleCancel();
    }
    return (
        <Modal getContainer={window.document.body} visible={addModalVisible} title="新建" onOk={FinishForm} onCancel={handleCancel}>
            <Form
                {...layout}
                form={form}
                onFinish={FinishForm}>
                <Form.Item
                    label="主编号："
                    name="mainCode"
                    rules={[{ required: true, message: '请选择主编号' }]}>
                    <Select placeholder="请选择主编号">
                        {
                            downList.map((item: any) => {
                                return (
                                    <Option value={item.code}>{item.code}</Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="子编号：" name="childCode" rules={[{ required: true, message: '请输入子编号' }]}>
                    <Input type="text" placeholder="请输入子编号" />
                </Form.Item>
                <Form.Item label="打分项名称：" name="scoreName" rules={[{ required: true, message: '请输入打分项名称' }]}>
                    <Input type="text" placeholder="请输入打分项名称" />
                </Form.Item>
                <Form.Item label="打分类型：" name="scoreType" rules={[{ required: true, message: '请选择打分类型' }]}>
                    <Radio.Group>
                        <Radio value="1">加分</Radio>
                        <Radio value="2">扣分</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="参考分值：" name="scoreInfo" rules={[{ required: true, message: '请选择参考分值' }]}>
                    <Radio.Group className={styles.radioGroup} value={radioScore} onChange={e => setRadioScore(e.target.value)}>
                        <Radio value="1">固定分值</Radio>
                        <Radio value="2">范围分值</Radio>
                    </Radio.Group>
                </Form.Item>
                {
                    radioScore != '' ? <div className={styles.score}>
                        {
                            radioScore == '1' ?
                                <Input type="text" placeholder="请输入固定分值" className={styles.scoreInfo} value={regularVal} onChange={e => handleChangeRegular(e)} /> :
                                radioScore == '2' ?
                                    <>
                                        <Input type="text" placeholder="起始值" className={styles.scoreStart} value={startVal} onChange={e => handleChangeStart(e)} />
                &nbsp;~&nbsp;
                    <Input type="text" placeholder="结束值" className={styles.scoreStart} value={endVal} onChange={e => handleChangeEnd(e)} />
                                    </> : ''
                        }
                    </div> : null
                }
                 {
                    controlScore.visible ? <div className={styles.codeError}>{controlScore.message}</div> : null
                }

                <Form.Item label="使用说明：" name="useIntro" className={radioScore != '' ? styles.useIntro : ''} rules={[{ required: true, message: '请输入使用说明' }]}>
                    <Input type="text" placeholder="请输入使用说明" />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default AddCollect;

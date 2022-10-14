import React, { useRef, useState } from 'react';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { Button, DatePicker, Modal, Form, Input, Select, Radio } from 'antd';
import styles from './index.less';

const CollectionRecord: React.FC<any> = (props) => {
    const columns = [
        {
            title: '主编码',
            dataIndex: 'main-code',
            hideInSearch: true
        },
        {
            title: '子编码',
            dataIndex: 'child-code',
            hideInSearch: true
        },
        {
            title: '打分项名称',
            dataIndex: 'score-name'
        },
        {
            title: '打分类型',
            dataIndex: 'score-type',
            hideInSearch: true
        },
        {
            title: '参考分值',
            dataIndex: 'score',
            hideInSearch: true
        },
        {
            title: '使用说明',
            dataIndex: 'intro',
            hideInSearch: true
        },
        {
            title: '提交时间',
            dataIndex: 'submit-time',
            renderFormItem: () => {
                return (
                    <RangePicker />
                )
            }
        }
    ];
    const [collapsed, setCollapsed] = useState(false);
    const [visible, setVisible] = useState(false);
    const [startVal, setStartVal] = useState(0);
    const [endVal, setEndVal] = useState(0);
    const [regularVal, setRegularVal] = useState(0);
    const [radioScore, setRadioScore] = useState('');
    const actionRef = useRef<ActionType>();
    const { RangePicker } = DatePicker;
    const [form] = Form.useForm();
    const layout = {
        labelCol: {
            span: 5
        },
        wrapperCol: {
            span: 19
        }
    };
    const FinishForm =async () => {
        form.validateFields().then(res=>{
            // console.log(res); 此处做提交
        })
    }
    return (
        <>
            <ProTable
                actionRef={actionRef}
                tableAlertRender={false}
                options={false}
                columns={columns}
                search={{
                    collapsed: collapsed,
                    onCollapse: () => setCollapsed(!collapsed)
                }}
                pagination={{
                    position: ['bottomCenter'],
                    showQuickJumper: true,
                    defaultCurrent: 1,
                    pageSize: 10,
                    size: 'default'
                }}
                toolBarRender={() => [
                    <Button type="primary" onClick={() => setVisible(true)}>新建</Button>
                ]}
            />
            <Modal getContainer={window.document.body} visible={visible} title="新建" onOk={FinishForm} onCancel={() => setVisible(false)}>
                <Form
                    {...layout}
                    form={form}
                    onFinish={FinishForm}>
                    <Form.Item
                        label="主编号："
                        name="main-code"
                        rules={[{ required: true, message: '请选择主编号' }]}>
                        <Select placeholder="请选择主编号"></Select>
                    </Form.Item>
                    <Form.Item label="子编号：" name="child-code" rules={[{ required: true, message: '请输入子编号' }]}>
                        <Input type="text" placeholder="请输入子编号" />
                    </Form.Item>
                    <Form.Item label="打分项名称：" name="score-name" rules={[{ required: true, message: '请输入打分项名称' }]}>
                        <Input type="text" placeholder="请输入打分项名称" />
                    </Form.Item>
                    <Form.Item label="打分类型：" name="score-type" rules={[{ required: true, message: '请选择打分类型' }]}>
                        <Radio.Group>
                            <Radio value="1">加分</Radio>
                            <Radio value="2">扣分</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="参考分值：" name="score-info" rules={[{ required: true, message: '请选择参考分值' }]}>
                        <Radio.Group className={styles.radioGroup} value={radioScore} onChange={e => setRadioScore(e.target.value)}>
                            <Radio value="1">固定分值</Radio>
                            <Radio value="2">范围分值</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {
                        radioScore != '' ? <div className={styles.score}>
                            {
                                radioScore == '1' ?
                                    <Input type="text" placeholder="请输入固定分值" className={styles.scoreInfo} value={regularVal} onChange={e => setRegularVal(e.target.value)} /> :
                                    radioScore == '2' ?
                                        <>
                                            <Input type="text" placeholder="起始值" className={styles.scoreStart} value={startVal} onChange={e => setStartVal(e.target.value)} />
                        &nbsp;~&nbsp;
                            <Input type="text" placeholder="结束值" className={styles.scoreStart} value={endVal} onChange={e => setEndVal(e.target.value)} />
                                        </> : ''
                            }
                        </div> : null
                    }

                    <Form.Item label="使用说明：" name="use-intro" className={radioScore!=''?styles.useIntro:''} rules={[{ required: true, message: '请输入使用说明' }]}>
                        <Input type="text" placeholder="请输入使用说明" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
export default CollectionRecord;

import React, { useState, useRef } from 'react';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { Cascader, DatePicker, message, Modal } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { paginationHandle, tableDataHandle } from '@/utils/utils';
import { getApplyList, auditInfo } from '@/services/ItemCollect';
import ButtonAuth from '@/components/ButtonAuth';
import styles from './index.less';
import moment from 'moment';

const ApprovalScore: React.FC<any> = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [lookVisible, setLookVisible] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const actionRef = useRef<ActionType>();
    const { RangePicker } = DatePicker;
    const columns = [
        {
            title: '主编码',
            dataIndex: 'p_code',
            hideInSearch: true
        },
        {
            title: '子编码',
            dataIndex: 's_code',
            hideInSearch: true
        },
        {
            title: '打分项名称',
            dataIndex: 'item_name',
            hideInSearch: true
        },
        {
            title: '所属地区',
            dataIndex: 'area_name',
            renderFormItem: () => {
                return (
                    <Cascader options={props.areaList} />
                )
            }
        },
        {
            title: '打分类型',
            dataIndex: 'direction',
            hideInSearch: true,
            render: val => val == 'INCREASE' ? '加分' : '扣分'
        },
        {
            title: '参考分数',
            dataIndex: 'point',
            hideInSearch: true
        },
        {
            title: '申请时间',
            dataIndex: 'created_at',
            renderFormItem: () => {
                return (
                    <RangePicker />
                )
            }
        },
        {
            title: '实际分值',
            dataIndex: 'use_point',
            hideInSearch: true
        },
        {
            title: '代表大会文件',
            dataIndex: 'image',
            hideInSearch: true,
            render: val => <img src={val} style={{ width: "80px" }} className={styles.imgFile} onClick={() => handleLookFilePrev(val)} />
        },
        {
            title: '状态',
            dataIndex: 'status',
            hideInSearch: true,
            render: val => val == 0 ? '未申请' : val == 1 ? '待审批' : val == 2 ? '使用中' : '已拒绝'
        },
        {
            title: '操作时间',
            dataIndex: 'operate_at',
            hideInSearch: true
        },
        {
            title: '操作',
            dataIndex: 'option',
            hideInSearch: true,
            render: (val, record) => {
                return (
                    record.status == 1 ?
                        (
                            <div className={styles.changeColor}>
                                <ButtonAuth type="APPROVAL_PASS">
                                    <a type="text" onClick={() => handleAuditInfo(record, 1)}>通过</a></ButtonAuth><br />
                                <ButtonAuth type="APPROVAL_FAIL">
                                    <a type="text" onClick={() => handleAuditInfo(record, 2)}>拒绝</a></ButtonAuth>
                            </div>
                        )
                        :
                        null
                )
            }
        }
    ];
    const handleLookFilePrev=(val)=>{
        console.log(val);
        setLookVisible(true);
        setImageSrc(val);
    }
    const handleAuditInfo = (record, audit_status) => {
        Modal.confirm({
            title: '确认',
            content: `您确定将该条信息${audit_status == 1 ? '审核通过' : '审核拒绝'}?`,
            onOk: () => {
                let data = {
                    item_id: record.item_id,
                    village_id: record.village_id,
                    audit_status
                };
                auditInfo(data).then(res => {
                    if (res.code == 0) {
                        message.success(audit_status == 1 ? '审核通过' : '审核拒绝');
                        actionRef.current?.reload();
                    }
                })
            }
        })
    }
    const getApplyListInfo = async (params: any) => {
        const _params = paginationHandle(params);
        // delete _params.city_id;
        // delete _params.village_id;
        // delete _params.town_id;
        if (params.area_name && params.area_name.length != 0) {
            _params.village_id = params.area_name[2];
        }
        if (params.created_at && params.created_at.length > 0) {
            _params.start_time = moment(params.created_at[0]).format('YYYY-MM-DD');
            _params.end_time = moment(params.created_at[1]).format('YYYY-MM-DD');
        }
        delete _params.created_at;
        delete _params.area_name;
        delete _params._timestamp;
        const _data = await getApplyList(_params);
        return tableDataHandle(_data)
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
                rowKey={'item_id'}
                request={(params) => getApplyListInfo(params)}
                pagination={{
                    position: ['bottomCenter'],
                    showQuickJumper: true,
                    defaultCurrent: 1,
                    pageSize: 10,
                    size: 'default'
                }}
                toolBarRender={() => []}
            />
            {/* 查看大图 */}
            <Modal getContainer={window.document.body} visible={lookVisible} title="查看大图" footer={null} onCancel={() => setLookVisible(false)}>
                    <img src={imageSrc} className={styles.lookPrev}/>
                </Modal>

        </>
    )
}
export default connect(({ info }: ConnectState) => ({
    areaList: info.areaList,
}))(ApprovalScore);

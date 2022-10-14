import ProTable, { ActionType } from '@ant-design/pro-table';
import { Button, Cascader } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import React, { useState, useRef } from 'react';
import LookStatistics from '../lookStatistics';
import { paginationHandle, tableDataHandle } from '@/utils/utils';
import { getStatList } from '@/services/ItemCollect';
import ButtonAuth from '@/components/ButtonAuth';
import styles from './index.less';

const StatisticsItem: React.FC<any> = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [params, setParams] = useState({});
    const actionRef = useRef<ActionType>();
    const [lookModal, setLookModal] = useState({
        visible: false,
        title: '参与家庭列表',
        width: 1000,
        record: ''
    });
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
            dataIndex: 'item_name'
        },
        {
            title: '所属地区',
            dataIndex: 'area_name',
            renderFormItem: () => {
                return (
                    <Cascader options={props.areaList} changeOnSelect />
                )
            }
        },
        {
            title: '实际分值',
            dataIndex: 'use_point',
            hideInSearch: true
        },
        {
            title: '打分类型',
            dataIndex: 'direction',
            hideInSearch: true,
            render: val => val == 'INCREASE' ? '加分' : '扣分'
        },
        {
            title: '参与家庭',
            dataIndex: 'join_num',
            hideInSearch: true
        },
        {
            title: '打分次数',
            dataIndex: 'set_num',
            hideInSearch: true
        },
        {
            title: '操作',
            dataIndex: 'option',
            hideInSearch: true,
            render: (val, record) => {
                return (
                    <ButtonAuth type="STATISTICS_LOOK">
                        <a className={styles.changeColor} onClick={() => handleLook(record)}>查看</a>
                    </ButtonAuth>
                )
            }
        }
    ];
    const getStatisticList = async (params) => {
        const _params = paginationHandle(params);
        delete _params.city_id;
        delete _params.village_id;
        delete _params.town_id;
        if (params.area_name && params.area_name.length != 0) {
            if (params.area_name.length == 1) {
                _params.city_id = params.area_name[0];
            } else if (params.area_name.length == 2) {
                _params.city_id = params.area_name[0];
                _params.town_id = params.area_name[1];
            } else {
                _params.city_id = params.area_name[0];
                _params.town_id = params.area_name[1];
                _params.village_id = params.area_name[2];
            }
        }
        setParams(_params);
        const data = await getStatList(_params);
        return tableDataHandle(data);
    }
    const handleLook = (record) => {
        setLookModal({ ...lookModal, visible: true, record: record });
    }
    const exportExcel = () => {
        window.open('/farmapi/gateway?api_name=export_stat&version=1.2.0&os=h5&sign'
            + (params.item_name ? '&item_name=' + params.item_name : '')
            + (params.city_id ? '&city_id=' + params.city_id : '')
            + (params.town_id ? '&city_id=' + params.town_id : '')
            + (params.village_id ? '&village_id=' + params.village_id : '')
        )
    }
    return (
        <>
            <ProTable
                tableAlertRender={false}
                columns={columns}
                actionRef={actionRef}
                options={false}
                search={{
                    collapsed: collapsed,
                    onCollapse: () => setCollapsed(!collapsed)
                }}
                rowKey={'item_id'}
                pagination={{
                    position: ['bottomCenter'],
                    showQuickJumper: true,
                    defaultCurrent: 1,
                    pageSize: 10,
                    size: 'default'
                }}
                request={(params) => getStatisticList(params)}
                toolBarRender={() => [
                    <ButtonAuth type="STATISTICS_EXPORT">
                        <Button type="primary" onClick={() => exportExcel()}>导出</Button>
                    </ButtonAuth>
                ]}
            />
            {
                lookModal.visible ? <LookStatistics lookModal={lookModal} handleModalCancel={() => setLookModal({ ...lookModal, visible: false })} /> : null
            }
        </>
    )
}

export default connect(({ info }: ConnectState) => ({
    areaList: info.areaList
}))(StatisticsItem);

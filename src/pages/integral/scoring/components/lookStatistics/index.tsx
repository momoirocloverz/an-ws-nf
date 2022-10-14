import React,{useState} from 'react';
import {Button, Modal} from 'antd';
import styles from './index.less';
import ProTable from '@ant-design/pro-table';
import {paginationHandle,tableDataHandle} from '@/utils/utils';
import {integralDetail} from '@/services/integral';
import ShowRecord from '../../../family/components/ShowRecord';

const LookStatistics:React.FC<any> = (props) => {
    const [ lookModal, setLookModal ] = useState(props.lookModal);
    const [ sec_modalVisible, handleModalVisibleSec ] = useState(false);
    const [ formValues, setFormValues ] = useState<any>({});
    console.log(lookModal, 'lookModal');
    const columns = [
        {
            title:'家庭ID',
            dataIndex:'family_id',
            align:'center',
            hideInSearch:true
        },
        {
            title:'户主姓名',
            dataIndex:'owner_name',
            align:'center',
        },
        {
            title:'手机号',
            dataIndex:'mobile',
            align:'center',
        },
        {
            title:'身份证号',
            dataIndex:'identity',
            align:'center',
        },
        {
            title:'所属地区',
            dataIndex:'area',
            align:'center',
            hideInSearch:true
        },
        {
            title:'累计打分次数',
            dataIndex:'times',
            align:'center',
            hideInSearch:true
        },
        {
            title:'累计打分值',
            dataIndex:'score',
            align:'center',
            hideInSearch:true
        },
        {
            title:'操作',
            dataIndex:'option',
            align:'center',
            hideInSearch:true,
            render:(val,record)=>{
                return(
                    <Button type="text" className={styles.record} onClick={()=>{
                        handleModalVisibleSec(true)
                        setFormValues({...record, integralTypeId: lookModal.record.item_id.toString() })
                    }}>积分记录</Button>
                )
            }
        }
    ];
    const getIntegralDetail = async (params:any) => {
        const valObj = { ...params, item_id: lookModal.record.item_id, village_id: lookModal.record.village_id };
        const _params = paginationHandle(valObj);
        const data = await integralDetail(_params);
        return tableDataHandle(data);
    }
    const onRecordRef = async () => {

    }
    return(
        <>
        <Modal getContainer={window.document.body} visible={lookModal.visible} title={lookModal.title} footer={null} width={lookModal.width} onCancel={props.handleModalCancel}>
            <div className={styles.lookTop}>
                <span>参与家庭数：{lookModal.record.join_num}</span>
                <span>所属地区：{lookModal.record.area_name}</span>
                <span>打分项：{lookModal.record.item_name}</span>
                <span>打分类型：{lookModal.record.direction=='INCREASE'?'加分':'扣分'}</span>
                <span>实际分值：{lookModal.record.use_point}</span>
            </div>
            <ProTable
                columns={columns}
                tableAlertOptionRender={false}
                options={false}
                toolBarRender={false}
                request={(params)=>getIntegralDetail(params)}
                pagination={{
                    position: ['bottomCenter'],
                    showQuickJumper: true,
                    defaultCurrent: 1,
                    pageSize: 10,
                    size: 'default'
                }}
            />
        </Modal>
        {
            sec_modalVisible ? (
              <ShowRecord
                onRef={onRecordRef}
                values={formValues}
                onCancel={() => {
                  handleModalVisibleSec(false);
                  setFormValues({});
                }}
                modalVisible={sec_modalVisible}
              />
            ) : null
          }
        </>
    )
}

export default LookStatistics;

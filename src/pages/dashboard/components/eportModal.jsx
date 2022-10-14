import React from 'react';
import { Modal, DatePicker } from 'antd';
import { exportStatistics } from '@/services/dataCenter';
import moment from 'moment';
import { downloadAs } from '@/pages/agricultureSubsidies/utils';

export default class ExportModal extends React.Component {
  constructor(props) {
    super(props)
    const { showModal } = props
    this.state = {
      showModal,
      monthFormat: 'YYYY-MM',
      defaultValue: new Date().getFullYear() + '-' + (new Date().getMonth() + 1).toString().padStart(2, '0'),
      selectMonth: new Date().getFullYear() + '-' + (new Date().getMonth() + 1).toString().padStart(2, '0'),
    }
  }

  handleChangeMonth(date, dateString) {
    this.setState({
      selectMonth: dateString
    })
  }
  handleOk() {
    let params = {
      api_name: 'export_statistics',
      id: '1',
      month: this.state.selectMonth
    }
    exportStatistics(params).then(result => {
      this.props.hideModal();
      downloadAs(result, '每日更新数据统计.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    })
  }
  handleCancel() {
    this.props.hideModal();
  }

  render() {
    const { showModal, monthFormat, defaultValue } = this.state;
    return (
      <Modal title="增长数据导出" visible={showModal} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}>
        <DatePicker defaultValue={moment(defaultValue, monthFormat)} format={monthFormat} picker="month" onChange={this.handleChangeMonth.bind(this)} />
      </Modal>
    )
  }
}

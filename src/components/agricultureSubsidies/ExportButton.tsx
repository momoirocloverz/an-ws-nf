import React, { useState } from 'react';
import { Button, message } from 'antd';
import {
  getClaimRecordsForVillageOfficials, getClaimsForCityOfficials,
  getClaimsForTownOfficials, getPendingClaimsForTownOfficials,
  getRejectedClaimRecordsForVillageOfficials, getTransactionHistoryForVillageOfficials,
} from '@/services/agricultureSubsidies';
import { downloadAs } from '@/pages/agricultureSubsidies/utils';
import { CLAIM_RECORD_TABLES } from '@/pages/agricultureSubsidies/consts';

type DownloadObject = {
  name: string;
  mimeType: string;
}
type ExportBtnProps = {
  tableType?: string;
  params: object;
  func?: (params: object) => Promise<unknown>;
  customDownloadObject?: DownloadObject;
  exportType?:string;
  isLoading?:any;
}

function ExportButton({
  tableType, params, func, customDownloadObject,exportType,isLoading
}: ExportBtnProps) {
  const [isExporting, setIsExporting] = useState(false);
  const handleClick = async () => {
    // 2021-12-17  add:数据是否加载完成逻辑 为了不影响其他页面 只给 浙农补/申报列表 添加
    if(exportType === 'claim-management' && isLoading){
      console.error('数据未加载完全');
      message.error('数据未加载完全');
      return
    }
    try {
      setIsExporting(true);
      let result;
      if (typeof func === 'function') {
        result = await func({ ...params, asFile: 1 });
      } else {
        // 不用管分页
        switch (tableType) {
          case CLAIM_RECORD_TABLES.PENDING_VALIDATION:
          case CLAIM_RECORD_TABLES.POSTED:
          case CLAIM_RECORD_TABLES.SUBMITTED:
            result = await getClaimRecordsForVillageOfficials({ ...params, asFile: 1 });
            break;
          case CLAIM_RECORD_TABLES.REJECTED:
            result = await getRejectedClaimRecordsForVillageOfficials({ ...params, asFile: 1 });
            break;
          case CLAIM_RECORD_TABLES.TRANSACTION_HISTORY:
            result = await getTransactionHistoryForVillageOfficials({ ...params, asFile: 1 });
            break;
          // 镇级
          case CLAIM_RECORD_TABLES.PENDING_VALIDATION_VIEW_ONLY: {
            result = await getPendingClaimsForTownOfficials({ ...params, asFile: 1 });
            break;
          }
          case CLAIM_RECORD_TABLES.PENDING_APPROVAL:
          case CLAIM_RECORD_TABLES.APPROVED:
            console.log('当前类型为 审核通过');
          case CLAIM_RECORD_TABLES.FINANCIAL_BACK: {
            result = await getClaimsForTownOfficials({ ...params, asFile: 1 });
            break;
          }
          // 市级
          case CLAIM_RECORD_TABLES.PENDING_VIEW_ONLY:
          case CLAIM_RECORD_TABLES.PENDING_APPROVAL_VIEW_ONLY:
          case CLAIM_RECORD_TABLES.APPROVED_VIEW_ONLY:
          case CLAIM_RECORD_TABLES.FINANCIAL_BACK_CITY: {
            result = await getClaimsForCityOfficials({ ...params, asFile: 1 });
            break;
          }
          default:
            break;
        }
      }
      downloadAs(result, customDownloadObject?.name ?? `${new Date().toLocaleString()}导出记录.xls`, customDownloadObject?.mimeType ?? 'application/vnd.ms-excel');
    } catch (e) {
      message.error(`导出失败: ${e.message}`);
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <Button type="primary" onClick={handleClick} loading={isExporting}>
      导出
    </Button>
  );
}
ExportButton.defaultProps = {
  tableType: '',
  func: undefined,
  customDownloadObject: undefined,
};

export default React.memo(ExportButton);

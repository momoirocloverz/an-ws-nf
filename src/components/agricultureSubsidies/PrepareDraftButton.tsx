/* eslint-disable no-unused-vars */
import React, {
  useEffect, useMemo, useRef, useState
} from "react";
import {
  Button, Cascader, DatePicker, message, Modal, Select, Upload, notification, Popover
} from "antd";
import _ from "lodash";
import ProTable, { ActionType } from "@ant-design/pro-table";
import { ownershipTypes, seasons } from "@/pages/agricultureSubsidies/consts";
import moment from "moment";
import { prepareDraft, submitDraft } from "@/services/agricultureSubsidies";
import { tableDataHandle, getLocalToken, getApiParams } from "@/utils/utils";
import { downloadDocumentsAsZipFile, getCurrentSeason } from "@/pages/agricultureSubsidies/utils";
import { FormInstance } from "antd/es/form";
import DocumentPreviewModal from "@/components/agricultureSubsidies/DocumentPreviewModal";
import { CascaderOptionType } from "antd/es/cascader";
import styles from "./PrepareDraft.less";
import { StatsType } from "@/pages/agricultureSubsidies/types";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { PUBLIC_KEY } from "@/services/api";
import ImportBtn from "@/components/buttons/ImportBtn";
import { startPublicityToTownAll, townFinanceRejectDeclaresAll } from "@/services/partyOrganization";

const { confirm } = Modal;

// const token = getLocalToken();
// const data = getApiParams({ api_name: 'import_declares_info' }, PUBLIC_KEY);

type TreeObject = {
  value: string;
  label: string;
  children: TreeObject[];
};

type DraftPreparationModalProps = {
  regionTree: TreeObject[];
  userRegionPath: string[];
  catTree: CascaderOptionType[];
  mainTableRef: React.MutableRefObject<ActionType>;
  mountedAt?: HTMLElement;
  successCb: () => unknown;
};

function PrepareDraftButton({
                              regionTree,
                              userRegionPath,
                              catTree,
                              mainTableRef,
                              mountedAt,
                              successCb
                            }: DraftPreparationModalProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const tableRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [stats, setStats] = useState<StatsType>({});
  // request初次请求不按initialValue
  const [year, setYear] = useState(moment().startOf("year"));
  const [season, setSeason] = useState(getCurrentSeason());
  const [categories, setCategories] = useState<any[]>([]);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentViewParams, setCurrentViewParams] = useState({});
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [repetitionData, setRepetitionData] = useState({});
  const [loading, setLoading] = useState(false);
  const subCategoryList = useMemo(() => {
    const list: TreeObject[] = [];
    catTree.forEach((e) => list.push(...(e.children)));
    setCategories(list.map((e) => e.value));
    return list;
  }, [catTree]);

  const columns = [
    {
      title: "地区",
      key: "region",
      hideInTable: true,
      initialValue: userRegionPath,
      renderFormItem: () => <Cascader options={regionTree} disabled />
    },
    {
      title: "ID",
      dataIndex: "id",
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: "申报面积(亩)",
      dataIndex: "cumulativeSize",
      hideInSearch: true
    },
    {
      title: "面积(m²)",
      dataIndex: "cumulativeMetricSize",
      hideInSearch: true
    },
    {
      title: "承包人",
      dataIndex: "contractor",
      hideInSearch: true
    },
    {
      title: "申报时间",
      dataIndex: "createdAt",
      hideInSearch: true
    },
    {
      title: "电话",
      dataIndex: "phoneNumber",
      hideInSearch: true,
      render: (_, record) => {
        return (
          <span>{record.phoneNumber ? record.phoneNumber.replace(/(\d{3})\d*(\d{4})/, "$1****$2") : ""}</span>
        );
      }
    },
    {
      title: "所属地区",
      dataIndex: "region",
      hideInSearch: true
    },
    {
      title: "补贴项目",
      // 复数因为可多选, 和列表不一样
      dataIndex: "categories",
      initialValues: subCategoryList.map((e) => e.value),
      renderFormItem: () => (
        <Select
          options={subCategoryList}
          mode="multiple"
          value={categories}
          onChange={(v) => setCategories(v)}
        />
      )
    },
    {
      title: "性质",
      dataIndex: "ownershipType",
      valueEnum: ownershipTypes,
      filters: false,
      hideInSearch: true
    },
    {
      title: "种植作物",
      dataIndex: "crops",
      hideInSearch: true
    },
    {
      title: "承包流转面积",
      dataIndex: "contractedArea",
      hideInSearch: true,
      width: 60
    },
    {
      title: "年份",
      dataIndex: "year",
      // initialValue: moment().startOf('year'),
      renderFormItem: () => (
        <DatePicker picker="year" allowClear={false} value={year} onChange={(v) => setYear(v)} />
      )
    },
    {
      title: "季节",
      dataIndex: "season",
      valueEnum: seasons,
      // initialValue: getCurrentSeason(),
      renderFormItem: () => (
        <Select
          options={Object.entries(seasons).map(([k, v]) => ({ value: k, label: v }))}
          onChange={(v) => setSeason(v)}
          value={season}
        />
      ),
      filters: false
    },
    {
      title: "补贴金额",
      dataIndex: "amount",
      hideInSearch: true
    },
    {
      title: "公示截止日期",
      dataIndex: "postingClosingDate",
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: "材料下载",
      key: "documents",
      hideInSearch: true,
      render: (__, record) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setIsPreviewModalOpen(true);
              setSelectedRow(record);
            }}
          >
            预览
          </Button>
          <Button type="link" size="small" onClick={() => downloadDocumentsAsZipFile(record)}>
            下载
          </Button>
        </>
      )
    }
  ];

  // FIXME: memory leak
  const loadData = async (rawParams) => {

    setSubmitDisabled(true);
    try {
      if (!(rawParams.categories?.length ?? categories.length)) {
        throw new Error("补贴项目为必选项");
      }
      const params = {
        year: (rawParams.year && moment(rawParams.year).year()) ?? year.year(),
        season: rawParams.season ?? season,
        categories: rawParams.categories ?? categories

      };
      if(rawParams.region){
        params.city_id = rawParams.region[0] ?? '';
        params.town_id = rawParams.region[1] ?? '';
        params.village_id = rawParams.region[2] ?? '';
      }
      setCurrentViewParams(params);
      const result = await prepareDraft(params);
      const transformed: any[] = [];
      let obj = {};
      result.data.data.forEach((e, i) => {
        if (obj[e.real_name + "," + e.identity + "," + e.scale_name]) {
          obj[e.real_name + "," + e.identity + "," + e.scale_name] += 1;
        } else {
          obj[e.real_name + "," + e.identity + "," + e.scale_name] = 1;
        }
        transformed[i] = {
          id: e.id,
          cumulativeSize: e.plot_area,
          cumulativeMetricSize: e.plot_area_m,
          contractor: e.real_name,
          createdAt: e.declare_time,
          phoneNumber: e.mobile,
          region: e.area_name,
          categories: e.scale_name,
          ownershipType: e.subsidy_type,
          crops: e.crops_name,
          contractedArea: e.circulation_area,
          year: e.year,
          season: e.season,
          amount: e.subsidy_amount,
          status: e.is_adopt,
          response: e.town_reject_reason,
          documents: e.stuff_url,
          entityId: e.subsidy_id,
          submitter: e.declare_admin_id
        };
      });
      setRepetitionData(obj);
      // @ts-ignore
      const transformedResult = tableDataHandle({
        code: result.code,
        data: { data: transformed }
      });
      // if (isMounted.current) {
      if (result.data?.total?.[0]) {
        setStats(result.data?.total?.[0]);
      }
      setSubmitDisabled(!(transformedResult.data.length > 0));
      return transformedResult;
      // }
      // return undefined;
    } catch (e) {
      message.error(`申报数据读取失败: ${e.message}`);
      setSubmitDisabled(true);
      setStats({});
      return tableDataHandle({
        code: 0,
        data: [],
        pagination: {
          page: 1,
          item_total: 0,
          page_count: 1,
          page_total: 1
        }
      });
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      mainTableRef.current?.reload();
    }
  }, [isModalVisible]);

  const submit = async () => {
    let user_arr: any = [];
    Object.keys(repetitionData).forEach(key => {
      if (repetitionData[key] > 1) {
        user_arr.push(key.split(",")[0]);
      }
    });
    if (user_arr.length) {
      confirm({
        icon: <ExclamationCircleOutlined />,
        content: <div>{user_arr.join(",")}存在一个项目申领多个作物，请确认是否继续公示</div>,
        onOk() {
          confirmData();
        },
        onCancel() {
        }
      });
    } else {
      confirmData();
    }
  };

  const confirmData = async () => {
    setSubmitting(true);
    try {
      let d = _.cloneDeep(currentViewParams);
      // 2022-01-18 新增 所有人员公示都需要传 地区信息 by zyx
      d.city_id = userRegionPath[0] ?? "";
      d.town_id = userRegionPath[1] ?? "";
      d.village_id = userRegionPath[2] ?? "";
      const result = await submitDraft(d);
      if (result.code === 0) {
        message.success("提交公示成功");
        setIsPreviewModalOpen(false);
        setIsModalVisible(false);
        mainTableRef.current.reload();
      } else {
        throw new Error(result.msg);
      }
    } catch (e) {
      message.error(`提交失败: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // const uploadProps = {
  //   name: 'file',
  //   action: '/farmapi/gateway',
  //   headers: {
  //     authorization: token,
  //   },
  //   data,
  //   showUploadList: false,
  //   onChange(info:any) {
  //     setLoading(true);
  //     if (info.file.status !== 'uploading') {
  //       console.log(info.file);
  //     }
  //     if (info.file.status === 'done') {
  //       if(info.file.response.code === 0){
  //         console.log(info);
  //         if(info.file.response.data.length>0){
  //           Modal.error({
  //             content: `${info.file.response.data.join(",")}导入失败`,
  //           });
  //         }else{
  //           message.success(`${info.file.name} 文件导入成功`);
  //         }
  //         successCb();
  //       }else{
  //         notification['error']({
  //           message: '警告',
  //           duration: null,
  //           description: info.file.response.msg
  //         });
  //       }
  //       setLoading(false);
  //     } else if (info.file.status === 'error') {
  //       notification['error']({
  //         message: '文件导入失败',
  //         duration: null,
  //         description: info.file.name
  //       });
  //       setLoading(false);
  //     }
  //   },
  // }

  return (
    <>
      {/* 跳过全部公示 */}
      <Button
        type="link"
        onClick={() => {
          Modal.confirm({
            content: "确认要将镇驳回的全部申报记录跳过公示？",
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
              const user = JSON.parse(localStorage.getItem("userInfo")) || {};
              try {
                const d = await startPublicityToTownAll(user.village_id ?? 0);
                if (d.code === 0) {
                  // data = [] 没有操作数据库 不是数组 有操作数据库
                  if (Object.prototype.toString.call(d.data).indexOf("Array") > -1) {
                    message.error("镇暂时没有驳回的申报数据需要跳过");
                  } else {
                    message.success("已跳过公示");
                  }
                } else {
                  message.error(d.msg);
                }
                mainTableRef?.current?.reload();
              } catch (e) {
                message.error(new Error(`跳过失败: ${e.message}!`));
              }
            }
          });
        }}
      >
        全部跳过公示
      </Button>
      <Popover
        trigger="click"
        content={
          <div>
            <div>
              <Button type="primary" onClick={() => {
                // https://wsnf.oss-cn-hangzhou.aliyuncs.com/acfile/%E4%B8%80%E6%AC%A1%E6%80%A7%E8%A1%A5%E8%B4%B4%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx
                window.location.href =
                  'https://wsnf.oss-cn-hangzhou.aliyuncs.com/acfile/%E8%80%95%E5%9C%B0%E5%9C%B0%E5%8A%9B%E4%BF%9D%E6%8A%A4.xlsx';
              }}>
                耕地地力补贴模板
              </Button>
            </div>
            <div style={{ marginTop: "20px" }}>
              <Button
                type="primary"
                onClick={() => {
                  window.location.href =
                    'https://wsnf.oss-cn-hangzhou.aliyuncs.com/acfile/%E4%B8%80%E6%AC%A1%E6%80%A7%E8%A1%A5%E8%B4%B4%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx';
                }}
              >
                农民一次性补贴模板
              </Button>
            </div>
            <div style={{ marginTop: "20px" }}>
              <Button
                type="primary"
                onClick={() => {
                  window.location.href ='https://wsnf.oss-cn-hangzhou.aliyuncs.com/wsnf/%E8%A7%84%E6%A8%A1%E7%A7%8D%E7%B2%AE%E8%A1%A5%E8%B4%B4%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx'
                }}
              >
                规模种粮补贴模板
              </Button>
            </div>
          </div>
        }
      >
        <Button type="primary">模板</Button>
      </Popover>

      {/* <Upload {...uploadProps} disabled={loading}>
        <Button disabled={loading} type="primary" loading={loading}>
          {loading ? '正在导入...' : '导入'}
        </Button>
      </Upload> */}

      <Popover
        content={
          <div>
            <div>
              <ImportBtn api={"import_declares_spring_info"} btnText={"导入春季耕地地力补贴"} onSuccess={() => successCb()} />
            </div>
            <div style={{ marginTop: "20px" }}>
              <ImportBtn api={"import_declares_info"} btnText={"导入秋季耕地地力补贴"} onSuccess={() => successCb()} />
            </div>
            <div style={{ marginTop: "20px" }}>
              <ImportBtn api={"import_declares_cultivated_land"} btnText={"导入春季规模种粮补贴"} onSuccess={() => successCb()} />
            </div>
            <div style={{ marginTop: "20px" }}>
              <ImportBtn
                api="import_declares_info_actual"
                btnText="导入农民一次性补贴"
                onSuccess={() => successCb()}
              />
            </div>
          </div>
        }
        trigger="click"
      >
        <Button type="primary">导入</Button>
      </Popover>

      <Button type="primary" onClick={() => {
        // 异步嵌套影响太多了 useState不一定好用 绝 太low了简直  2022-03-10
        setIsModalVisible(true);
        setTimeout(() => {
          setIsModalVisible(false);
        }, 0);
        setTimeout(() => {
          setIsModalVisible(true);
        }, 20);
      }}>
        开始公示
      </Button>
      <Modal
        getContainer={mountedAt}
        visible={isModalVisible}
        wrapClassName={styles.draftModalWrapper}
        onCancel={() => setIsModalVisible(false)}
        title="准备公示"
        width={1400}
        footer={[
          <Button type="primary" key="submit" disabled={submitDisabled} loading={submitting} onClick={submit}>
            开始公示
          </Button>
        ]}
      >
        <div className={styles.hint}>开始公示后, 完成公示将自动提交街道审核!</div>
        {
          isModalVisible ? (
            <ProTable
              className={styles.customTable}
              actionRef={tableRef}
              formRef={formRef}
              request={loadData}
              columns={columns}
              scroll={{ y: 400 }}
              rowKey="id"
              options={false}
              pagination={false}
              search={{
                searchText: "获取列表",
                collapsed: false,
                collapseRender: false
              }} // collapsed: false不然重置不会取隐藏项的最初值 (╯°□°）╯︵ ┻━┻
              toolBarRender={() => [
                <div>
                  {`申报数: ${stats.total_num ?? "?"}户    申报面积: ${_.round(stats.total_plot_area ?? 0, 1) ?? "?"}亩    申报补贴: ${_.round(stats.total_subsidy_amount ?? 0, 1) ?? "?"}元`}
                </div>
              ]}
            />
          ) : null
        }
        <DocumentPreviewModal
          visible={isPreviewModalOpen}
          context={selectedRow}
          cancelCb={() => setIsPreviewModalOpen(false)}
        />
      </Modal>
    </>
  );
}

PrepareDraftButton.defaultProps = {
  mountedAt: window.document.body
};

export default React.memo(PrepareDraftButton);

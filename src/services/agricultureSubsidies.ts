import request from "@/utils/request";
import { getApiParams } from "@/utils/utils";
import { ALL_API, PUBLIC_KEY } from "@/services/api";
import moment from "moment";
import { history } from "umi";

/* *******************************************************************
 **************************  种植补贴  ********************************
 *********************************************************************
 */
export async function getSubsidyStandards(year, season, category, pageNum, pageSize) {
  const data = getApiParams({
    api_name: "subsidy_standard_list",
    year,
    season,
    scale_id: category,
    page: pageNum,
    page_size: pageSize
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function createSubsidyStandard(params) {
  const data = getApiParams({
    api_name: "add_subsidy_standard",
    year: params.year,
    season: params.season,
    scale_parent_id: params.category?.[0].toString(),
    scale_id: params.category?.[1].toString(),
    crops_id: params.crops,
    standard_price: params.standard
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function modifySubsidyStandard(id, params) {
  const data = getApiParams({
    api_name: "edit_subsidy_standard",
    id,
    year: params.year,
    season: params.season,
    scale_parent_id: params.category?.[0].toString(),
    scale_id: params.category?.[1].toString(),
    crops_id: params.crops,
    standard_price: params.standard
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function deleteSubsidyStandard(id) {
  const data = getApiParams({
    api_name: "delete_subsidy_standard",
    id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function getCropList() {
  const data = getApiParams({
    api_name: "get_subsidy_crops_cate"
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function getBankList() {
  const data = getApiParams({
    api_name: "get_bank_list"
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function getCategoryList() {
  const data = getApiParams({
    api_name: "get_subsidy_scale_plant"
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}
// 农机申报管理--获取类别
export async function getSubsidyMachineCate() {
  const data = getApiParams({
    api_name: "get_subsidy_machine_cate"
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 导出已减明细
export async function exportSubsidyDisposable() {
  const data = getApiParams({
    api_name: "export_subsidy_disposable",
    is_export: 1
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 获取一次性补贴列表 12-27

/* *******************************************************************
 **************************  反馈管理  ********************************
 *********************************************************************
 */
export async function getFeedbacks(params) {
  const data = getApiParams({
    api_name: "feedback_list",
    real_name: params.name,
    identity: params.idNumber,
    begin_time: params.rangeStart,
    end_time: params.rangeEnd,
    page: params.pageNum,
    page_size: params.pageSize
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function submitFeedbackResponse(id, content) {
  const data = getApiParams({
    api_name: "edit_feedback",
    id,
    reply_text: content
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

/* *******************************************************************
 **************************  地块信息  ********************************
 *********************************************************************
 */
export async function getLayerAccessToken() {
  const data = getApiParams({
    api_name: "get_token_info"
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function getLandData(params) {
  const data = getApiParams({
    api_name: "get_village_adopt_info",
    city_name: params.regionNames[0],
    town_name: params.regionNames[1],
    village_name: params.regionNames[2],
    town_id: params.regionIds[1],
    village_id: params.regionIds[2],
    year: params.year,
    season: params.season,
    user_type: params.categoryRootName
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
  //   .then((result) => { // 👀
  //   if (result.code === 0) {
  //     if (result.data.data.length === 0) {
  //       return request(ALL_API, {
  //         method: 'POST',
  //         data: source,
  //       }).then(() => request(ALL_API, {
  //         method: 'POST',
  //         data,
  //       }));
  //     }
  //     return result;
  //   }
  //   return Promise.reject(new Error(result.msg));
  // });
}

export async function queryCoordinate(lng, lat) {
  const data = getApiParams({
    api_name: "find_land_info_by_lonlat",
    lon: lng,
    lat
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function getLandById(id) {
  const data = getApiParams({
    api_name: "get_adopt_info",
    land_id: id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export function verifyIndividual() {
  history.replace("/agriculture-subsidies/facial-recognition");
}

export async function verifyBusiness() {
  const data = getApiParams({
    api_name: "get_corporate_authentication_link"
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  }).then((result) => {
    window.open(result.data);
    // window.location.href = result.data;
  });
}

export function getVerificationCode(phoneNumber) {
  const data = getApiParams({
    api_name: "send_cert_sms_info",
    mobile: phoneNumber
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function submitClaim(params) {
  const data = getApiParams({
    api_name: "add_declares_info",
    scale_parent_id: params.category[0],
    scale_id: params.category[1],
    crops_id: params.cropType,
    year: params.year,
    season: params.season,
    area_arr: params.selected.map((l) => l.id),
    plot_area: params.cumulativeSize,
    plot_area_m: params.cumulativeMetricSize,
    area_name: params.regionNamePath.join("/"),
    city_id: params.region[0],
    town_id: params.region[1],
    village_id: params.region[2],
    household_type: params.householdType,
    circulation_area: params.contractedArea,
    subsidy_amount: params.calculatedSubsidy,
    stuff_images: params.stuffImgs?.map((d) => d.id).join(", ") ?? "",
    subsidy_type: params.ownershipType,
    real_name: params.contractor,
    legal_name: params.legalRep ?? "",
    identity: params.idNumber,
    bank_name: params.bankName ?? "",
    bank_card_number: params.accountNumber ?? "",
    is_citizen_card: params.hasResidenceCard ?? 0,
    mobile: params.phoneNumber,
    credit_num: params.creditUnionCode ?? "",
    identity_card_front: params.idFront[0]?.uid ?? "",
    identity_card_back: params.idBack[0]?.uid ?? "",
    business_license: params.licenses?.map((p) => p.uid).join(", ") ?? "",
    code: params.verificationCode,
    video_live_detection: 1,
    verifysec: 1,
    param: encodeURIComponent(params.businessVerificationToken),
    file_id: params.fileId
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function getFacialRecognitionAccessToken() {
  const data = getApiParams({
    api_name: "baidu_access_token"
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 不用动作
// export async function getFacialRecognitionActionSequence(token) {
//   const data = getApiParams({
//     api_name: 'baidu_faceliveness_sessioncode',
//     access_token: token,
//   }, PUBLIC_KEY);
//   return request(ALL_API, {
//     method: 'POST',
//     data,
//   });
// }
export async function checkForVideoLiveness(token, video) {
  const data = getApiParams({
    api_name: "baidu_ai_faceliveness_verify",
    access_token: token,
    video_base64: video
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function checkForIdentity(token, image, imageType, idNumber, name) {
  const data = getApiParams({
    api_name: "baidu_ai_person_verifysec",
    access_token: token,
    image,
    image_type: imageType,
    id_card_number: idNumber,
    name
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// export async function submitFacialRecognitionVideo(token, sessionId, video, idNumber, name) {
//   const params = new URLSearchParams();
//   params.append('video_base64', video);
//   return fetch(`https://aip.baidubce.com/rest/2.0/face/v1/faceliveness/verify?access_token=${token}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     credentials: 'omit',
//     body: params,
//   })
//     .then((r) => r.json())
//     .then((result) => fetch(`https://aip.baidubce.com/rest/2.0/face/v3/person/verify?access_token=${token}`, {
//       method: 'POST',
//       credentials: 'omit',
//       body: JSON.stringify({
//         image_type: 'BASE64',
//         image: result.result.best_image.pic,
//         id_card_number: idNumber,
//         name,
//       }),
//     }))
//     .then((r) => r.json());
// }

/* *******************************************************************
 **************************  申报管理  ********************************
 *********************************************************************
 */

// =========================== 村级 ===================================
export async function getClaimRecordsForVillageOfficials(params) {
  const data = getApiParams({
    api_name: "declare_village_list",
    year: params.year,
    season: params.season,
    household_type: params.household_type,
    scale_parent_id: params.category?.[0],
    scale_id: params.category?.[1],
    is_adopt: params.status,
    real_name: params.contractor,
    subsidy_type: params.ownershipType,
    type: params.type,
    is_export: params.asFile,
    page: params.pageNum,
    page_size: params.pageSize,
    city_id: params.region?.[0],
    town_id: params.region?.[1],
    village_id: params.region?.[2],
    crops_id: params?.crops
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function getRejectedClaimRecordsForVillageOfficials(params) {
  const data = getApiParams({
    api_name: "declare_reject_list",
    year: params.year,
    season: params.season,
    household_type: params.household_type,
    scale_parent_id: params.category?.[0],
    scale_id: params.category?.[1],
    real_name: params.contractor,
    subsidy_type: params.ownershipType,
    is_export: params.asFile,
    page: params.pageNum,
    page_size: params.pageSize,
    city_id: params.region?.[0],
    town_id: params.region?.[1],
    village_id: params.region?.[2],
    crops_id: params?.crops
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function getTransactionHistoryForVillageOfficials(params) {
  const data = getApiParams({
    api_name: "declares_payment_record_list",
    year: params.year,
    season: params.season,
    household_type: params.household_type,
    scale_parent_id: params.category?.[0],
    scale_id: params.category?.[1],
    subsidy_type: params.ownershipType,
    real_name: params.contractor,
    payment_status: params.paymentStatus,
    is_export: params.asFile,
    page: params.pageNum,
    page_size: params.pageSize,
    city_id: params.region?.[0],
    town_id: params.region?.[1],
    village_id: params.region?.[2],
    crops_id: params?.crops
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function prepareDraft(params) {
  const data = getApiParams({
    api_name: "start_publicity_list",

    scale_id: params.categories?.length > 0 ? params.categories.map((e) => e.toString()).join(", ") : null,
    ...params
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function submitDraft(params) {
  const data = getApiParams({
    api_name: "update_start_publicity",
    year: params.year,
    season: params.season,
    scale_id: params.categories.map((e) => e.toString()).join(", "),
    city_id: params.city_id || "",
    town_id: params.town_id || "",
    village_id: params.village_id || ""
  }, PUBLIC_KEY);

  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function retractClaim(id) {
  const data = getApiParams({
    api_name: "cancel_formula_declares",
    id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function rejectClaimByVillageOfficials(params, reason) {
  const data = getApiParams({
    api_name: "reject_user_declare",
    id: params.id,
    crops_name: params.crops,
    scale_name: params.program,
    area_name: params.region,
    village_reject_reason: reason,
    household_type: params.household_type
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function viewEntityDetails(recordId) {
  const data = getApiParams({
    api_name: "get_declare_userinfo",
    id: recordId
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function deleteClaim(params) {
  const data = getApiParams(
    {
      api_name: 'delete_declares_new',
      ...params,
    },
    PUBLIC_KEY,
  );
  return request(ALL_API, {
    method: 'POST',
    data,
  });
}

export async function requestModification(id, reason) {
  const data = getApiParams({
    api_name: "apply_update_declares",
    id,
    update_reason: reason
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function getClaimFormDetails(id) {
  const data = getApiParams({
    api_name: "get_update_declares_info",
    id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function findEntity(params) {
  const data = getApiParams({
    api_name: "is_declares_verifysec",
    subsidy_type: params.ownershipType,
    name: params.name,
    identity: params.idNumber
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function checkResidency(idNumber, name, ownershipType) {
  const data = getApiParams({
    api_name: "is_citizen_card",
    identity: idNumber,
    type: [undefined, 0, 2][ownershipType],
    name
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function modifyClaim(params) {
  console.log(params, "params");
  const data = getApiParams({
    api_name: "update_declares_info",
    id: params.id,
    subsidy_id: "",
    scale_parent_id: params.category[0],
    scale_id: params.category[1],
    crops_id: params.cropType,
    year: params.year,
    season: params.season,
    area_arr: params?.selected?.length ? params.selected.map((l) => l.id) : null,
    plot_area: params.cumulativeSize,
    plot_area_m: params.cumulativeMetricSize,
    area_name: params?.regionNamePath?.join("/"),
    city_id: params.region?.[0],
    town_id: params?.region?.[1],
    village_id: params?.region?.[2],
    circulation_area: params.contractedArea,
    subsidy_amount: params.calculatedSubsidy,
    stuff_images: params.stuffImgs,
    subsidy_type: params.ownershipType,
    real_name: params.contractor,
    legal_name: params.legalRep ?? "",
    identity: params.idNumber,
    bank_name: params.bankName ?? "",
    bank_card_number: params.accountNumber ?? "",
    mobile: params.phoneNumber,
    credit_num: params.creditUnionCode ?? "",
    identity_card_front: params?.idFront?.[0]?.uid ?? "",
    identity_card_back: params?.idBack?.[0]?.uid ?? "",
    business_license: params?.licenses?.map((p) => p.uid).join(", ") ?? "",
    code: params.verificationCode,
    video_live_detection: 1,
    verifysec: 1,
    param: params.businessVerificationToken ? encodeURIComponent(params.businessVerificationToken) : undefined
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function toggleInspected(id) {
  const data = getApiParams({
    api_name: "town_check_declares",
    id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// =========================== 镇级 ===================================
export async function getPendingClaimsForTownOfficials(params) {
  const data = getApiParams({
    api_name: "declare_town_village_list",
    city_id: params.region[0],
    town_id: params.region[1],
    village_id: params.region[2],
    year: params.year,
    season: params.season,
    household_type: params.household_type,
    scale_parent_id: params.category?.[0],
    scale_id: params.category?.[1],
    is_adopt: params.status,
    real_name: params.contractor,
    subsidy_type: params.ownershipType,
    is_export: params.asFile,
    page: params.pageNum,
    page_size: params.pageSize,
    crops_id: params?.crops
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function getTownAnnouncement(params) { // 镇公示中
  const data = getApiParams({
    api_name: "declare_village_list", // declare_village_list 20220105 后端让使用村公示中的接口
    year: params.year,
    season: params.season,
    household_type: params.household_type,
    scale_parent_id: params.category?.[0],
    scale_id: params.category?.[1],
    is_adopt: params.status,
    real_name: params.contractor,
    subsidy_type: params.ownershipType,

    type: 1, // 0 未公示 1 公示中 2 已公示
    is_export: params.asFile,
    page: params.pageNum,
    page_size: params.pageSize,
    city_id: params.region?.[0],
    town_id: params.region?.[1],
    village_id: params.region?.[2],
    crops_id: params?.crops
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function getClaimsForTownOfficials(params) {
  const data = getApiParams({
    api_name: params.expandableView ? "declare_town_list_new" : "declare_town_list",
    city_id: params.region[0],
    town_id: params.region[1],
    village_id: params.region[2],
    household_type: params.household_type,
    year: params.year,
    season: params.season,
    scale_parent_id: params.category?.[0],
    scale_id: params.category?.[1],
    real_name: params.contractor,
    subsidy_type: params.ownershipType,
    is_export: params.asFile,
    is_adopt: params.type,
    is_qualified: params.isEligible,
    page: params.pageNum,
    page_size: params.pageSize,
    type: params.status,
    crops_id: params?.crops
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function approveClaim(id) {
  const data = getApiParams({
    api_name: "town_one_adopt_declares",
    id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function prepareList(params) {
  const data = getApiParams({
    // api_name: params.useExpandableView ? 'start_adopt_list_new' : 'start_adopt_list',
    api_name: "start_adopt_list_new",
    city_id: params.region[0],
    town_id: params.region[1],
    village_id: params.region[2],
    subsidy_type: params.ownershipType,
    year: params.year,
    season: params.season,
    scale_id: params.categories,
    is_qualified: params.isEligible
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
  // return Promise.resolve({"code":0,"msg":"请求成功","data":{"data":[{"subsidy_id":70,"real_name":"123213123213","mobile":"18957116875","subsidy_type":1,"list":[{"id":86,"user_id":0,"subsidy_id":70,"year":2021,"season":1,"city_id":1,"town_id":1,"village_id":3,"scale_parent_id":1,"scale_id":5,"circulation_area":40,"stuff_images":"1623","declare_time":"2021-05-18 10:30:13","plot_area":2.9,"plot_area_m":1933.3,"subsidy_amount":63.8,"type":0,"town_reject_reason":"","village_reject_reason":"","is_adopt":1,"publicity_start":"2021-05-23 14:42:47","publicity_end":"2021-05-30 14:42:47","is_allow":0,"check_time":"0000-00-00 00:00:00","read_type":0,"real_name":"123213123213","legal_name":"","subsidy_type":1,"created_at":"2021-05-18 10:30:13","updated_at":"2021-05-23 14:42:47","declare_update_time":null,"update_reason":null,"crops_id":"[1,3]","mobile":"18957116875","identity_card_front":"1621","identity_card_back":"1622","business_license":"","identity":"1231232422222222222","bank_card_number":"131321321313121","credit_num":"","video_live_detection":0,"verifysec":0,"declare_admin_id":38,"area_name":"平湖市\/当湖街道\/黄家浜村","batchnumber":null,"is_check":0,"scale_name":"旱粮生产补贴","crops_name":null,"bank_name":"中国银行","is_citizen_card":1,"village_name":"黄家浜村"}],"stuff_url":[]},{"subsidy_id":91,"real_name":"承包人67","mobile":"18957116875","subsidy_type":1,"list":[{"id":112,"user_id":0,"subsidy_id":91,"year":2021,"season":1,"city_id":1,"town_id":1,"village_id":1,"scale_parent_id":1,"scale_id":5,"circulation_area":222,"stuff_images":"1748","declare_time":"2021-06-22 09:52:58","plot_area":7.9,"plot_area_m":5266.7,"subsidy_amount":173.8,"type":0,"town_reject_reason":"","village_reject_reason":"","is_adopt":1,"publicity_start":"2021-06-10 09:53:41","publicity_end":"2021-06-21 09:53:41","is_allow":0,"check_time":"0000-00-00 00:00:00","read_type":0,"real_name":"承包人67","legal_name":"","subsidy_type":1,"created_at":"2021-06-22 09:52:58","updated_at":"2021-06-22 09:53:41","declare_update_time":null,"update_reason":null,"crops_id":"2,1","mobile":"18957116875","identity_card_front":"1745","identity_card_back":"1746","business_license":"","identity":"12345678909876543","bank_card_number":"银行账户123","credit_num":"","video_live_detection":0,"verifysec":0,"declare_admin_id":3,"area_name":"平湖市\/当湖街道\/虹霓村","batchnumber":null,"is_check":0,"scale_name":"旱粮生产补贴","crops_name":"玉米,小麦","bank_name":"工商银行","is_citizen_card":0,"village_name":"虹霓村"},{"id":111,"user_id":0,"subsidy_id":91,"year":2021,"season":1,"city_id":1,"town_id":1,"village_id":3,"scale_parent_id":1,"scale_id":5,"circulation_area":122,"stuff_images":"1747","declare_time":"2021-06-22 09:47:06","plot_area":21.5,"plot_area_m":14333.3,"subsidy_amount":473,"type":0,"town_reject_reason":"","village_reject_reason":"","is_adopt":1,"publicity_start":"2021-06-02 09:47:18","publicity_end":"2021-06-21 09:47:18","is_allow":0,"check_time":"0000-00-00 00:00:00","read_type":0,"real_name":"承包人67","legal_name":"","subsidy_type":1,"created_at":"2021-06-22 09:47:06","updated_at":"2021-06-22 09:47:18","declare_update_time":null,"update_reason":null,"crops_id":"5","mobile":"18957116875","identity_card_front":"1745","identity_card_back":"1746","business_license":"","identity":"12345678909876543","bank_card_number":"银行账户123","credit_num":"","video_live_detection":0,"verifysec":0,"declare_admin_id":38,"area_name":"平湖市\/当湖街道\/黄家浜村","batchnumber":null,"is_check":0,"scale_name":"旱粮生产补贴","crops_name":"油菜","bank_name":"工商银行","is_citizen_card":0,"village_name":"黄家浜村"}],"stuff_url":[]}]}})
}

export async function getPaymentProcessors(ownershipType, categoryName) {
  const data = getApiParams({
    api_name: "get_do_people_list",
    scale_name: categoryName,
    subsidy_type: ownershipType
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function submitListNew(params) {
  const data = getApiParams({
    api_name: "town_adopt_declares_to_submit", // 除了秋季 耕地地力 其他递交改成新的   年后下掉老的秋季逻辑
    year: params.year,
    season: params.season,
    scale_id: params.categories,
    scale_parent_id: params.categories_parent ?? "", // 补贴类目
    city_id: params.region[0],
    town_id: params.region[1],
    village_id: params.region[2],
    subsidy_type: params.ownershipType, // 补贴对象性质 1 个人 2 企
    is_qualified: params.isEligible,
    processor: params.selectedProcessor,
    id_arr: params.checkarr
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function submitList(params) {
  const data = getApiParams({
    // api_name: params.useExpandableView ? 'town_adopt_declares_town_all' : 'town_adopt_declares', // town_adopt_declares_new -> town_adopt_declares_town_all
    api_name: "town_adopt_declares_town_all",
    city_id: params.region[0],
    town_id: params.region[1],
    village_id: params.region[2],
    year: params.year,
    season: params.season,
    subsidy_type: params.ownershipType,
    processor: params.selectedProcessor,
    is_qualified: params.isEligible,
    scale_id: params.categories,
    checkarr: params.checkarr
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function rejectClaimByTownOfficials(id, reason) {
  const data = getApiParams({
    api_name: "town_reject_declares",
    id,
    town_reject_reason: reason
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// =========================== 市级 ===================================
export async function getClaimsForCityOfficials(params) {
  const data = getApiParams({
    api_name: params.expandableView ? "declare_city_town_list" : "declare_city_list",
    city_id: params.region[0],
    town_id: params.region[1],
    village_id: params.region[2],
    household_type: params.household_type,
    year: params.year,
    season: params.season,
    scale_parent_id: params.category?.[0],
    scale_id: params.category?.[1],
    real_name: params.contractor,
    subsidy_type: params.ownershipType,
    is_export: params.asFile,
    class_type: params.type,
    is_adopt: params.isApproved,
    is_check: params.inspected,
    page: params.pageNum,
    page_size: params.pageSize,
    payment_status: params.paymentStatus,
    crops_id: params?.crops
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// ==================================================================
// =========================== 农户/人员管理 ===============================
// ==================================================================

export async function getEntityList(params) {
  const data = getApiParams({
    api_name: "declares_userinfo_list",
    identity: params.idNumber,
    name: params.name,
    subsidy_type: params.ownershipType,
    page: params.pageNum,
    page_size: params.pageSize
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function modifyEntity(params) {
  const data = getApiParams({
    api_name: "edit_declares_userinfo",
    id: params.id,
    subsidy_type: params.ownershipType,
    real_name: params.contractor,
    identity: params.idNumber,
    mobile: params.phoneNumber,
    legal_name: params.legalRep,
    bank_card_number: params.accountNumber,
    identity_card_front: params.idFront,
    identity_card_back: params.idBack,
    business_license: params.licenses,
    is_citizen_card: params.hasResidenceCard,
    credit_num: params.creditUnionCode,
    bank_name: params.bankName
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export function getProspects(params) {
  const data = getApiParams({
    api_name: "match_people_list",
    name: params.name,
    identity: params.idNumber,
    city_id: params.region[0],
    town_id: params.region[1],
    village_id: params.region[2],
    page: params.pageNum,
    page_size: params.pageSize
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export function createProspect(params) {
  const data = getApiParams({
    api_name: "add_match_people",
    name: params.name,
    identity: params.idNumber,
    mobile: params.phoneNumber,
    city_id: params.city_id,
    town_id: params.town_id,
    village_id: params.village_id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export function modifyProspect(params) {
  const data = getApiParams({
    api_name: "edit_match_people",
    id: params.id,
    name: params.name,
    identity: params.idNumber,
    mobile: params.phoneNumber,
    city_id: params.city_id,
    town_id: params.town_id,
    village_id: params.village_id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export function deleteProspect(id) {
  const data = getApiParams({
    api_name: "del_match_people",
    id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// ==================================================================
// =========================== 政策发布 ===============================
// ==================================================================
export function getAnnouncements(params) {
  const data = getApiParams({
    api_name: "policy_release_list",
    title: params.title,
    start_time: params.dateRange?.[0] && moment(params.dateRange[0]).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    end_time: params.dateRange?.[1] && moment(params.dateRange[1]).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    page: params.pageNum,
    page_size: params.pageSize,
    category_id: params.category_id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export function createAnnouncement(params) {
  const data = getApiParams({
    api_name: "add_policy_release",
    title: params.title,
    image: params.poster,
    content: params.content,
    pdf_id: params.pdf_id,
    category_id: params.category_id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export function modifyAnnouncement(params) {
  const data = getApiParams({
    api_name: "edit_policy_release",
    id: params.id,
    title: params.title,
    image: params.poster,
    content: params.content,
    category_id: params.category_id,
    pdf_id: params.pdf_id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export function deleteAnnouncement(id) {
  const data = getApiParams({
    api_name: "delete_policy_release",
    id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// ==================================================================
// =========================== 数据统计 ===============================
// ==================================================================
export async function getApplicationStats(params) {
  const data = getApiParams({
    api_name: "declares_data_statistics_list",
    city_id: params.region?.[0],
    town_id: params.region?.[1],
    village_id: params.region?.[2],
    year: params.year,
    season: params.season,
    scale_parent_id: params.category?.[0] ?? undefined,
    scale_id: params.category?.[1] ?? undefined,
    subsidy_type: params.ownershipType,
    is_export: params.asFile,
    page: params.pageNum,
    page_size: params.pageSize
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}
export async function getDeclaresObjectDataStatisticsList(params) {
  const data = getApiParams({
    api_name: "declares_object_data_statistics_list",
    city_id: params.region?.[0],
    town_id: params.region?.[1],
    village_id: params.region?.[2],
    subsidy_type: params.ownershipType,
    year: params.year,
    real_name: params.real_name,
    mobile: params.mobile,
    is_export: params.is_export,
    page: params.pageNum,
    page_size: params.pageSize
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function getStatDetails(params) {
  const data = getApiParams({
    api_name: "declares_statistics_info", //declares_statistics_info
    city_id: params.region?.[0],
    town_id: params.region?.[1],
    village_id: params.region?.[2],
    year: params.year,
    season: params.season,
    scale_parent_id: params.category?.[0],
    scale_id: params.category?.[1],
    subsidy_type: params.ownershipType,
    type: params.type,
    is_export: params.asFile,
    page: params.pageNum,
    page_size: params.pageSize
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// ==================================================================
// =========================== 公示文件發佈 ===========================
// ==================================================================
export async function getPostedItems(params) {
  const data = getApiParams({
    api_name: "get_public_file_list",
    search_title: params.title,
    search_times: params.dateRange && [moment(params.dateRange[0]).startOf("day").format("YYYY-MM-DD HH:mm:ss"), moment(params.dateRange[1]).endOf("day").format("YYYY-MM-DD HH:mm:ss")],
    page: params.pageNum,
    page_size: params.pageSize
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export function createPostedItem(params) {
  const data = getApiParams({
    api_name: "create_public_file",
    title: params.title,
    content: params.content,
    city_id: params.region?.[0],
    town_id: params.region?.[1],
    village_id: params.region?.[2]
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export function modifyPostedItem(params) {
  const data = getApiParams({
    api_name: "edit_public_file",
    id: params.id,
    title: params.title,
    content: params.content,
    city_id: params.region?.[0],
    town_id: params.region?.[1],
    village_id: params.region?.[2]
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export function deletePostedItem(id) {
  const data = getApiParams({
    api_name: "delete_public_file",
    id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 获取流转面积信息
export function getLandCirculationInfo(params) {
  const data = getApiParams({
    api_name: "get_land_circulation_info",
    ...params
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 获取补贴项目
export function getSubsidyScalePlantNew() {
  const data = getApiParams({
    api_name: "get_subsidy_scale_plant_new"
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机购置列表
export function agriculturalList(params) {
  const data = getApiParams({
    api_name: "agricultural_list",
    ...params
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机购置导入
export function importAgricultural() {
  const data = getApiParams({
    api_name: "import_agricultural"
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机购置导出
export function exportAgricultural(params) {
  const data = getApiParams({
    api_name: "export_agricultural",
    ...params
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机购置修改
export function editAgricultural(params) {
  const data = getApiParams({
    api_name: "edit_agricultural",
    ...params
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 农机删除
export function delAgricultural(id) {
  const data = getApiParams({
    api_name: "del_agricultural",
    id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export function addAgricultural(params) {
  const data = getApiParams({
    api_name: "add_agricultural",
    ...params
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 申报记录跳过公示期
export function startPublicityToTown(id) {
  const data = getApiParams({
    api_name: "start_publicity_to_town",
    id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 编辑导入申报
export async function editImportDeclare(params) {
  const data = getApiParams({
    api_name: "edit_import_declares_info",
    plot_area: params.cumulativeSize,
    id: params.id,
    subsidy_id: params.subsidy_id,
    crops_id: params.crops[0],
    year: params.year,
    season: params.season[0],
    identity: params.identity,
    real_name: params.contractor,
    city_id: params.area[0],
    town_id: params.area[1],
    village_id: params.area[2],
    scale_id: params.scale_id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 删除导入申报
export function deleteImport(id) {
  const data = getApiParams({
    api_name: "delete_declares",
    id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 一次性补贴列表
export function _subsidyDisposableList(params) {
  const data = getApiParams({
    api_name: "subsidy_disposable_list",
    ...params
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 删除一次性补贴
export function _delSubsidyDisposable(id) {
  const data = getApiParams({
    api_name: "del_subsidy_disposable",
    id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 修改一次性补贴
export function _editSubsidyDisposable(params) {
  const data = getApiParams({
    api_name: "edit_subsidy_disposable",
    ...params
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 删除导入的认证信息
export function _delDeclaresUserInfo(id) {
  const data = getApiParams({
    api_name: "del_declares_userinfo",
    id
  }, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 获取市县/乡镇/村的对应人的其他地块信息
export function getVillageAdoptOtherInfo(params) {
  const data = getApiParams(
    {
      api_name: "get_village_adopt_other_info",
      ...params
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: "POST",
    data
  });
}
// 农机管理模块--市级--资金管理列表
export function subsidyMachineCapitalList(params) {
  const data = getApiParams(
    {
      api_name: 'subsidy_machine_capital_list',
      ...params,
    },
    PUBLIC_KEY
  );
  let opt:any = {
    method: 'POST',
    data,
  };
  if(params.is_export === 1){
    opt.responseType = 'blob'
  }
  return request(ALL_API, opt);
}
// 农机管理模块--市级--资金管理列表
export function delSubsidyMachineCapital(params) {
  const data = getApiParams(
    {
      api_name: 'del_subsidy_machine_capital',
      ...params,
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: 'POST',
    data
  });
}
// 农机管理模块--市级--生成待公示申报
export function createSubsidyMachineDeclare(params) {
  const data = getApiParams(
    {
      api_name: 'create_subsidy_machine_declare',
      ...params,
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: 'POST',
    data
  });
}

// 农机管理模块--市级--资金管理列表
export function subsidyMachineCapitalStatistics(params) {
  const data = getApiParams(
    {
      api_name: 'subsidy_machine_capital_statistics',
      ...params,
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: 'POST',
    data
  });
}
// 农机管理模块--市级--资金管理列表
export function addSubsidyMachineCapital(params) {
  const data = getApiParams(
    {
      api_name: 'add_subsidy_machine_capital',
      ...params,
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: 'POST',
    data
  });
}
// 农机管理模块--市级--资金管理列表
export function editSubsidyMachineCapital(params) {
  const data = getApiParams(
    {
      api_name: 'edit_subsidy_machine_capital',
      ...params,
    },
    PUBLIC_KEY
  );
  return request(ALL_API, {
    method: 'POST',
    data
  });
}

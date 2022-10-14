import request from '@/utils/request';
import { ALL_API } from './api';
import { getApiParams } from '@/utils/utils';
import { PUBLIC_KEY } from '@/services/api';

// 获取打分项收集列表
export async function getCollectList(params:any):Promise<any> {
    const _params={
        api_name:'collect_list',
        ...params
    }
    const data=await getApiParams(_params,PUBLIC_KEY);
    return request(ALL_API,{
        method:'POST',
        data
    })
}

// 新增打分项收集列表
export async function addCollectList(params:any):Promise<any> {
    const _params={
        api_name:'add_collect',
        ...params
    }
    const data=await getApiParams(_params,PUBLIC_KEY);
    return request(ALL_API,{
        method:'POST',
        data
    })
}

// 申请列表
export async function getApplyList(params:any):Promise<any> {
    const _params={
        api_name:'apply_list',
        ...params
    }
    const data=await getApiParams(_params,PUBLIC_KEY);
    return request(ALL_API,{
        method:'POST',
        data
    })
}

// 审核
export async function auditInfo(params:any):Promise<any> {
    const _params={
        api_name:'audit_item',
        ...params
    }
    const data=await getApiParams(_params,PUBLIC_KEY);
    return request(ALL_API,{
        method:'POST',
        data
    })
}

// 获取统计列表
export async function getStatList(params:any):Promise<any> {
    const _params={
        api_name:'stat_list',
        ...params
    }
    const data=await getApiParams(_params,PUBLIC_KEY);
    return request(ALL_API,{
        method:'POST',
        data
    })
}


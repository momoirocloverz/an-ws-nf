import { Request, Response } from 'express';

const familyData = [
  {
    id: 1,
    owner: '海峰',
    group: 1,
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  },
  {
    id: 2,
    owner: '涛哥',
    group: 2,
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  }, 
];

const groupData = [
  {
    id: 1,
    owner: '海峰',
    group_name: '复仇者联盟',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  },
  {
    id: 2,
    owner: '涛哥',
    group_name: '奥特曼联盟',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  }, 
];

const dataAssigned = [
  {
    id: 1,
    owner: '海峰',
    id_card: '382928272827878797',
    phone: '13252233675',
    avatar: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    family: '欢乐家庭',
    group: '养殖小组',
    ask_count: 15,
    answer_count: 8,
    publish: 194,
    score: 100,
    pay_score: 19,
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  },
  {
    id: 2,
    owner: '丽晓',
    id_card: '382928272827878797',
    phone: '13252233675',
    avatar: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    family: '欢乐家庭',
    group: '电商小组',
    ask_count: 15,
    answer_count: 8,
    publish: 194,
    score: 100,
    pay_score: 19,
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  }, 
];

const dataManager = [
  {
    id: 1,
    name: '海峰',
    id_card: '382928272827878797',
    phone: '13252233675',
    master_type: 1,
    level: 1,
    job: '主任',
    title: '高级研究员',  
    specialty: '水稻方面的特长',
    avatar: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    answer_count: 8,
    area: '桐庐',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  },
  {
    id: 2,
    name: '晓圆',
    id_card: '382928272827878797',
    phone: '13252233675',
    master_type: 3,
    level: 2,
    job: '科员',
    title: '特级研究员',
    specialty: '玉米方面的特长',
    avatar: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    answer_count: 118,
    area: '桐庐',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  }, 
];

const dataApproval = [
  {
    id: 1,
    name: '晓圆',
    id_card: '382928272827878797',
    phone: '13252233675',
    master_type: 3,
    level: 2,
    job: '科员',
    title: '特级研究员',
    status: 1,
    specialty: '玉米方面的特长',
    avatar: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    answer_count: 118,
    area: '桐庐',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  },
  {
    id: 2,
    name: '雨龙',
    id_card: '382928272827878797',
    phone: '13252233675',
    master_type: 4,
    level: 1,
    job: '科员',
    title: '研究员',
    status: 0,
    specialty: '玉米方面的特长',
    avatar: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    answer_count: 118,
    area: '萧山',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  },
];

export default {
 'POST /api/customer/family/list': (req: Request, res: Response) => {
    res.send({
      error: 0,
      data: familyData,
      pagination: {
        item_total: 20,
        page: 1,
        page_count: 20,
        page_total: 1,
      }
    });
  },

  'POST /api/customer/group/list': (req: Request, res: Response) => {
    res.send({
      error: 0,
      data: groupData,
      pagination: {
        item_total: 20,
        page: 1,
        page_count: 20,
        page_total: 1,
      }
    });
  },

  'POST /api/customer/assigned/list': (req: Request, res: Response) => {
    res.send({
      error: 0,
      data: dataAssigned,
      pagination: {
        item_total: 20,
        page: 1,
        page_count: 20,
        page_total: 1,
      }
    });
  },

  'POST /api/customer/masterMan/list': (req: Request, res: Response) => {
    res.send({
      error: 0,
      data: dataManager,
      pagination: {
        item_total: 20,
        page: 1,
        page_count: 20,
        page_total: 1,
      }
    });
  },

  'POST /api/customer/masterApproval/list': (req: Request, res: Response) => {
    res.send({
      error: 0,
      data: dataApproval,
      pagination: {
        item_total: 20,
        page: 1,
        page_count: 20,
        page_total: 1,
      }
    });
  }, 
};

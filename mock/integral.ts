import { Request, Response } from 'express';

const data = [
  {
    id: 1,
    title: '善治分规则说明',
    content: '积分规则的内容萨芬短发短发啊',
    country: '广陈镇程村',
    create_name: '张三',
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
  {
    id: 2,
    title: '积分积分',
    content: '积分规则的内容萨芬短发短发啊',
    country: '广陈镇程村',
    create_name: '张三',
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
  {
    id: 3,
    title: '说明说明',
    content: '积分规则的内容萨芬短发短发啊',
    country: '广陈镇程村',
    create_name: '张三',
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
  {
    id: 4,
    title: '文明',
    content: '积分规则的内容萨芬短发短发啊',
    country: '广陈镇程村',
    create_name: '张三',
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
];

const familyData = [
  {
    id: 1,
    owner: '海峰',
    score: 300,
    family_rank: 1,
    family_name: '我爱我家',
    group_name: '独龙小组',
    group_rank: 1,
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
  {
    id: 2,
    owner: '晓圆',
    score: 1000,
    family_rank: 1,
    family_name: '我爱我家',
    group_name: '独龙小组',
    group_rank: 1,
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
  {
    id: 3,
    owner: '雨龙',
    score: 30000,
    family_rank: 1,
    family_name: '我爱我家',
    group_name: '独龙小组',
    group_rank: 1,
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
  {
    id: 4,
    owner: '雨龙',
    score: 30000,
    family_rank: 1,
    family_name: '我爱我家',
    group_name: '独龙小组',
    group_rank: 1,
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
];

const scoreData = [
  {
    id: 1,
    name:  '环境',
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
  {
    id: 2,
    name:  '垃圾收集',
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
  {
    id: 3,
    name:  '庭院管理',
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
  {
    id: 4,
    name:  '环境',
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
  {
    id: 5,
    name:  '环境',
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
  {
    id: 6,
    name:  '环境',
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
  {
    id: 7,
    name:  '环境',
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
  {
    id: 8,
    name:  '环境',
    create_at: "2020-01-19 14:25:18",
    up_time: "2020-02-10 12:30:30",
  },
];

export default {
 'POST /api/integral/rule/list': (req: Request, res: Response) => {
    res.send({
      error: 0,
      data: data,
      pagination: {
        item_total: 20,
        page: 1,
        page_count: 20,
        page_total: 1,
      }
    });
  },

  'POST /api/integral/family/list': (req: Request, res: Response) => {
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

  'POST /api/integral/score/list': (req: Request, res: Response) => {
    res.send({
      error: 0,
      data: scoreData,
      pagination: {
        item_total: 20,
        page: 1,
        page_count: 20,
        page_total: 1,
      }
    });
  },
};

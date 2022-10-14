import { Request, Response } from 'express';

const data = [
  {
    id: 1,
    nick_name: '信息员王二',
    avatar_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
    name: "张三",
    phone: '18627976612',
    role_name: '信息员',
    role_type: 1,
    province: '浙江',
    city: '杭州',
    country: '滨江'
  },
  {
    id: 2,
    nick_name: '运营小妹',
    avatar_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
    name: "李四",
    phone: '18627976612',
    role_name: '运营',
    role_type: 2,
    province: '浙江',
    city: '杭州',
    country: '滨江'
  },
  {
    id: 3,
    nick_name: '农业农村局王处长',
    avatar_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
    name: "王二",
    phone: '18627976612',
    role_name: '农业农村局',
    role_type: 3,
    province: '浙江',
    city: '杭州',
    country: '滨江'
  },
  {
    id: 4,
    nanick_nameme: '运营小妹妹',
    avatar_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
    name: "张三",
    phone: '18627976612',
    role_name: '运营',
    role_type: 2,
    province: '浙江',
    city: '杭州',
    country: '滨江'
  },
  {
    id: 5,
    nick_name: '信息员大志',
    avatar_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
    name: "李四",
    phone: '18627976612',
    role_name: '信息员',
    role_type: 1,
    province: '浙江',
    city: '杭州',
    country: '滨江'
  },
];

export default {
 'POST /api/account/list': (req: Request, res: Response) => {
    res.send({
      error: 0,
      data: data,
      pagination: {
        item_total: 10,
        page: 1,
        page_count: 10,
        page_total: 1,
      }
    });
  },
};

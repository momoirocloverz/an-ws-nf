import { Request, Response } from 'express';

const data = [
  {
    id: 1,
    name: '学习强国学习',
    banner_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
    nick_name: "张三",
    word_id: 111,
    isBannerLink: 1,
  },
  {
    id: 2,
    name: '天天学习',
    banner_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
    nick_name: "李四",
    word_id: 222,
    isBannerLink: 0,
  },
  {
    id: 3,
    name: '天天向上',
    banner_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
    nick_name: "王二",
    word_id: 333,
    isBannerLink: 1,
  },
  {
    id: 4,
    name: '涛哥哥',
    banner_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
    nick_name: "张三",
    word_id: 444,
    isBannerLink: 0,
  },
  {
    id: 5,
    name: '大伟',
    banner_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
    nick_name: "李四",
    word_id: 333,
    isBannerLink: 1,
  },
  {
    id: 6,
    name: '刘嘻嘻',
    banner_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
    nick_name: "王二",
    isBannerLink: 0,
  }
];

export default {
 'POST /api/banner/list': (req: Request, res: Response) => {
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
};

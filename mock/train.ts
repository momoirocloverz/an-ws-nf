import { Request, Response } from 'express';

const data = [
  {
    id: 1,
    title: '水稻',
    class_name: '种植培训',
    class_type: 1,
    status: 1,
    show: 1,
    top: 1,
    play_count: 12,
    share: 12,
    img_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  },
  {
    id: 2,
    title: '直播',
    class_name: '直播培训',
    class_type: 2,
    status: 1,
    show: 1,
    top: 0,
    play_count: 2,
    share: 1,
    img_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  },
  {
    id: 3,
    title: '酿酒',
    class_name: '酿酒培训',
    class_type: 3,
    status: 0,
    show: 1,
    top: 1,
    play_count: 1332,
    share: 132,
    img_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  },
  {
    id: 4,
    title: '苹果',
    class_name: '苹果种植培训',
    class_type: 1,
    status: 0,
    show: 0,
    top: 0,
    play_count: 12,
    share: 5,
    img_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  },
  {
    id: 5,
    title: '栽花',
    class_name: '种植培训',
    class_type: 1,
    status: 1,
    show: 0,
    top: 0,
    play_count: 125,
    share: 0,
    img_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  },
  {
    id: 6,
    title: '电商',
    class_name: '电商培训',
    class_type: 2,
    status: 0,
    show: 0,
    top: 0,
    play_count: 12,
    share: 12,
    img_url: 'https://wsnbh-img.hzanchu.com/test/05fabc7865b55bcd983d070155533396.jpeg',
    up_time: "2020-02-10 12:30:30",
    create_at: "2020-01-19 14:25:18",
  }
];

export default {
 'POST /api/class/list': (req: Request, res: Response) => {
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

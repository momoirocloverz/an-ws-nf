import React from 'react';
const echarts = require('echarts/lib/echarts');

export default class PiePicture extends React.Component {
  constructor(props) {
    super(props);
    const { options, id } = props;
    this.state = {
      options,
      id
    };
  }
  UNSAFE_componentWillReceiveProps() {
    this.getOptionInfo();
  }
  getOptionInfo() {
    const { options, id } = this.state;
    let urlList = JSON.parse(localStorage.getItem('urlList')) || [];
    let myMain = echarts.init(document.getElementById(id));
    myMain.setOption({
      title: {
        text: options.title,
        bottom: 10,
        left: 'center',
        textStyle: {
          color: '#3c3c3c',
          fontSize: 14
        }
      },
      minAngle: 45,
      avoidLabelOverlap: true,
      animation: false,
      tooltip: {
        trigger: 'item',
        formatter: options.formatter ? options.formatter : '{a}：{c}<br/>所属地区：{b}<br/>占比：{d}%'
      },
      legend: {
        orient: 'vertical',
        left: '5%',
        top: 'middle',
        icon: 'circle',
        width: 10,
        data: options.legendData,
        selectedMode: false,
        formatter: function (name) {
          if (!name) return '';
          if (name.length > 7) {
            name = name.slice(0, 5) + '...';
          }
          return name
        },
        tooltip: {
          show: true
        }
      },
      color: options.color,
      series: [
        {
          name: options.seriesName,
          type: 'pie',
          center: ['59%', '50%'],
          radius: options.radius,
          data: options.seriesData,
          // label: {
          //   show: false
          // },
          labelLine: {
            show: false
          },
          label: {
            // align: 'left',
            // emphasis: {
            //   label: {
            //     show: true,
            //     fontSize: '18',
            //     fontWeight: 'bold'
            //   }
            // },
            normal: {
              show: true,
              position: 'inner',
              rotate: true,
              formatter: (val) => {
                if (val.value == 0) {
                  return '';
                }
                return `${val.percent}%`
              },
              textStyle: {
                fontSize: 12
              }
            },
            // textStyle: {
            //   fontSize: 8
            // },
            // rich: {
            //   a: {
            //     fontSize: 10,
            //     lineHeight: 14,
            //     align: 'left'
            //   }
            // }
          },
          // labelLine: {
          //   normal: {
          //     lineStyle: {
          //       color: 'rgba(0,0,0,0.4)'
          //     }
          //   }
          // }
        }
      ]
    }, true);
    let data = {
      type: id,
      url: myMain.getDataURL()
    };
    urlList.map((item, index) => {
      if (item.type == id) {
        urlList.splice(index, 1);
      }
    });
    urlList.push(data);
    localStorage.setItem('urlList', JSON.stringify(urlList));
  }
  render() {
    const { id } = this.state;
    return (
      <div id={id} style={{ width: '100%', height: '100%' }}></div>
    )
  }
}

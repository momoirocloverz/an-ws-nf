import React from 'react';
const echarts = require('echarts/lib/echarts');

export default class BarPicture extends React.Component {
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
    const { id, options } = this.state;
    let urlList = JSON.parse(localStorage.getItem('urlList')) || [];
    let myMain = echarts.init(document.getElementById(id));
    myMain.setOption({
      tooltip: {
        trigger: 'axis'
      },
      grid: options.grid,
      title: {
        text: options.title,
        left: '2%',
        top: 6,
        textStyle: {
          color: '#3c3c3c',
          fontSize: 14
        }
      },
      legend: options.legend,
      color: ['#FFB155', '#48C1B7', '#51BEE5'],
      xAxis: {
        type: 'category',
        name: options.xAxisName,
        data: options.xAxisData,
        axisLabel: {
          interval: 0,
          rotate: options.rotate ? options.rotate : options.xAxisData.length > 4 ? 45 : 0,
          margin: 5,
          textStyle: {
            color: "#222"
          },
          formatter: function (name) {
            return name.length > 9 ? name.slice(0, 4) + '...' : name
          }
        },
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        name: options.yAxisName
      },
      series: options.series,
      animation:false
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
    const { options, id } = this.state;
    return (
      <div id={id} style={{ width: '100%', height: '100%' }}></div>
    )
  }
}

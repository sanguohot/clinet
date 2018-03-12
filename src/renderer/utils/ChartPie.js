const echarts = require('echarts');
export default function chartPie(id, opt = null) {
  // console.log(id);
  if (opt) {
    // 取得表头并删除前两位
    const ths = Object.keys(opt[0])
    let drg2 = false
    if (ths.includes('drg2')) {
      ths.splice(0, 3)
      drg2 = true
    } else {
      ths.splice(0, 2)
      drg2 = false
    }
    // 取最后点击的列为数据
    const th = ths.splice(-1, 1)[0]
    const legend = []
    const data = []
    opt.forEach((v) => {
      let name = ''
      if (drg2) {
        name = `${v.org} ${v.time} ${v.drg2}`
      } else {
        name = `${v.org} ${v.time}`
      }
      legend.push(name)
      data.push({ name: name, value: v[th] })
    })
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById(id));
    // 指定图表的配置项和数据
    const option = {
      tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: legend
      },
      series: [{
        name: th,
        type: 'pie',
        radius: '55%',
        data: data
      }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option, true);
  }
}
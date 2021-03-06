//import { createChart } from 'lightweight-charts';



let chart;
let candleSeries;
let volumeSeries;

export function updateChart(data) {
  candleSeries.setData(data);
  volumeSeries.setData(data);
}

export function makeChart(id) {
  const el = document.getElementById(id);

  /*
  var red = 'rgba(255, 0, 0, 1)';
  var green = 'rgba(0, 255, 0, 1)';
  */

  var red = 'rgba(228, 78, 93, 1)';
  var green = 'rgba(95, 186, 137, 1)';
  var white = 'rgba(255, 255, 255, 0.9)';
  var black = 'rgba(0, 0, 0, 0.9)';


  chart = LightweightCharts.createChart(el, {
    width: el.offsetWidth,
    height: 300,
    layout: {
      backgroundColor: 'transparent',
      textColor: 'white',
    },
    grid: {
      vertLines: {
        color: 'rgba(197, 203, 206, 0.2)',
      },
      horzLines: {
        color: 'rgba(197, 203, 206, 0.2)',
      },
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
    },
    priceScale: {
      autoScale: true,
      borderColor: 'rgba(197, 203, 206, 0.8)',
      mode: LightweightCharts.PriceScaleMode.Normal,
      //mode: LightweightCharts.PriceScaleMode.Linear,
      //mode: LightweightCharts.PriceScaleMode.Logarithmic,

    },
    timeScale: {
      timeVisible: true,
      borderColor: 'rgba(197, 203, 206, 0.8)',
    },
  });

  candleSeries = chart.addCandlestickSeries({
    upColor: green,
    downColor: red,

    borderUpColor: green,
    borderDownColor: red,

    wickUpColor: green,
    wickDownColor: red,
  });

  volumeSeries = chart.addHistogramSeries({
    color: '#666666',
    lineWidth: 2,
    priceFormat: {
      type: 'volume',
    },
    overlay: true,
    scaleMargins: {
      top: 0.8,
      bottom: 0,
    },
  });
}

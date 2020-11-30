import React, { Component } from "react";
import Chart from "chart.js";
import "./EmojiGraph.css";
import EmojiSelector from "../EmojiSelector/EmojiSelector";
import reactions from "./../Reactions/Reactions";
import { Emoji } from "../../types";

let myLineChart;

class EmojiGraph extends Component<{
  histogram: Emoji[];
  role: string;
}> {
  chartRef: any = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.buildChart();
  }

  componentDidUpdate() {
    if (this.props.role === "presenter") {
      let histogram = this.props.histogram;
      for (let v of histogram) {
        if (
          v.name === "bad-connection" ||
          v.name === "mute" ||
          v.name === "not-recording" ||
          v.name === "no-time"
        ) {
          if (v.count === 3) {
            alert(`${v.name} !!!`);
          }
        }
      }
    }
    this.buildChart();
  }

  buildChart = () => {
    const ctx = this.chartRef.current.getContext("2d");
    if (typeof myLineChart !== "undefined") myLineChart.destroy();
    myLineChart = new Chart(ctx, {
      type: "bar",
      plugins: [
        {
          afterDraw: chart => {
            var ctx = chart.chart.ctx;
            var xAxis = chart.scales["x-axis-0"];
            var yAxis = chart.scales["y-axis-0"];
            this.props.histogram.forEach(({ name }, index) => {
              var x = xAxis.getPixelForTick(index);
              var image = new Image(150, 150);
              image.src = "./assets/" + name + ".png";
              ctx.drawImage(image, x - 20, yAxis.bottom + 10, 30, 30);
            });
          }
        }
      ],
      data: {
        labels: this.props.histogram.map(({ name }) => ""),
        datasets: [
          {
            data: this.props.histogram.map(({ count }) => count),
            backgroundColor: [
              "#00ffe0",
              "#00CCB3",
              "#009986",
              "#00665A",
              "#004D43"
            ]
          }
        ]
      },

      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              offset: true,
              display: true,
              ticks: {
                display: true,
                fontSize: 20
              },
              categoryPercentage: 0.9,
              barPercentage: 1
            }
          ],
          yAxes: [
            {
              display: false,
              ticks: {
                suggestedMax: 5,
                suggestedMin: 0
              }
            }
          ]
        },

        ////categoryPercentage: 1.0,
        ////barPercentage: 0.9,
        //fontSize: 20,
        //ticks: {
        //fontSize: 15,
        //fontColor: "transparent",
        //},
        //},
        //],
        //yAxes: [
        //{
        //display: false,
        //scaleLabel: {
        //display: false,
        //labelString: "Reactions",
        ////fontSize: 20,
        //},
        //ticks: {
        //display: false,
        ////suggestedMax: Math.max(...this.props.histogram) + 2,
        //suggestedMax: 5,
        //suggestedMin: 0,
        //},
        //},
        //],
        animation: {
          //none
          duration: 0
        }
      }
    });
  };

  render() {
    //console.log(this.props.histogram);
    //console.log(this.state.labels);

    return (
      <div className="emoji">
        <div className="Emojigraph">
          <canvas id="myChart" ref={this.chartRef} />
        </div>
      </div>
    );
  }
}

export default EmojiGraph;

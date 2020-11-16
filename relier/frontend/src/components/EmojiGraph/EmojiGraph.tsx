import React, { Component } from "react";
import Chart from "chart.js";
import "./EmojiGraph.css";
import EmojiSelector from "../EmojiSelector/EmojiSelector";
import reactions from "./../Reactions/Reactions";

let myLineChart;

type State = {
  // prevVote: number;
  labels: any;
};

class EmojiGraph extends Component<
  { histogram: object; sendEmoji: (id: number) => void; role: string },
  State
> {
  state = {
    // prevVote: -1,
    // labels: ["\u{1F923}", "\u{1F603}"],
    labels: Object.keys(this.props.histogram) || []
  };
  //const [data, setData] = [0,0,0,0,0,0,0,0]
  //const [rate, setRate] = 0

  chartRef: any = React.createRef<HTMLDivElement>();

  handleChange = id => {
    this.props.sendEmoji(id);
    // const newVote = event.target.value;
    // const prevVote = this.state.prevVote;
    // this.props.sendVote(newVote, prevVote);
    // this.setState({
    //   prevVote: newVote
    // });
  };

  componentDidMount() {
    this.buildChart();
  }

  componentDidUpdate() {
    this.buildChart();
  }

  buildChart = () => {
    const ctx = this.chartRef.current.getContext("2d");
    const labels = Object.keys(this.props.histogram);
    if (typeof myLineChart !== "undefined") myLineChart.destroy();
    myLineChart = new Chart(ctx, {
      type: "line",
      plugins: [
        {
          afterDraw: chart => {
            var ctx = chart.chart.ctx;
            var xAxis = chart.scales["x-axis-0"];
            var yAxis = chart.scales["y-axis-0"];
            labels.forEach((value, index) => {
              var x = xAxis.getPixelForTick(index);
              var image = new Image(2, 2);
              // let arrNum = this.props.histogram[labels];
              image.src = "./assets/" + reactions[value] + ".png";
              ctx.drawImage(image, x - 12, yAxis.bottom + 10, 20, 20);
            });
          }
        }
      ],
      data: {
        labels: labels.map(v => reactions[v]),
        datasets: [
          {
            type: "bar",
            label: "count",
            backgroundColor: [
              "#ef3c3c",
              "#f1aa3e",
              "#ffef5e",
              "#cbe441",
              "#5dc03c"
            ],
            borderColor: "blue",
            data: Object.values(this.props.histogram)
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: "Reaction Panel",
          fontSize: 20
        },
        legend: {
          display: false,
          labels: {
            fontColor: "rgb(255, 99, 132)"
          }
        },
        scales: {
          xAxes: [
            {
              offset: true,
              categoryPercentage: 1.0,
              barPercentage: 1.0,
              fontSize: 20,
              ticks: {
                fontSize: 25,
                fontColor: "#353637"
              }
            }
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Reactions",
                fontSize: 20
              },
              ticks: {
                display: false,
                //suggestedMax: Math.max(...this.props.histogram) + 2,
                suggestedMax: 5,
                suggestedMin: 0
              }
            }
          ]
        },
        animation: {
          duration: 500
        }
      }
    });
  };

  render() {
    console.log(this.props.histogram);
    console.log(this.state.labels);
    const { role } = this.props;
    return (
      <div className="emoji">
        <div className="Emojigraph">
          <canvas id="myChart" ref={this.chartRef} />
        </div>
        {role === "presenter" ? (
          ""
        ) : (
          <EmojiSelector handleChange={this.handleChange} />
        )}
      </div>
    );
  }
}

export default EmojiGraph;

import React, { Component } from "react";
import Chart from "chart.js";
import "./Graph.css";

let myLineChart;

type State = {
  data: object;
  rate: any;
};

class Graph extends Component<{}, State> {
  state = {
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    rate: 0
  };
  //const [data, setData] = [0,0,0,0,0,0,0,0]
  //const [rate, setRate] = 0

  chartRef: any = React.createRef<HTMLDivElement>();

  handleChange = event => {
    const value = event.target.value;
    const tempData = ([] as any).concat(this.state.data);
    tempData.splice(value - 1, 1, this.state.data[value - 1] + 1);
    this.setState({
      data: [].concat(tempData),
      rate: value
    });
  };

  componentDidMount() {
    this.buildChart();
  }

  componentDidUpdate() {
    this.buildChart();
  }

  buildChart = () => {
    const ctx = this.chartRef.current.getContext("2d");
    if (typeof myLineChart !== "undefined") myLineChart.destroy();
    myLineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["😇", "", "", "", "🧐", "", "", "", "😀"],
        datasets: [
          {
            type: "line",
            data: this.state.data,
            label: "Africa",
            borderColor: "919191",
            fill: "origin"
          },
          {
            type: "bar",
            label: "Dataset 2",
            backgroundColor: [
              "firebrick",
              "orange",
              "gold",
              "khaki",
              "darkseagreen",
              "lightgreen",
              "limegreen",
              "green",
              "darkolivegreen"
            ],
            borderColor: "blue",
            data: this.state.data
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: "How people are understading"
        },
        legend: {
          display: false,
          labels: {
            fontColor: "rgb(255, 99, 132)"
          }
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Reaction"
              },
              display: true,
              ticks: {
                suggestedMax: Math.max(...this.state.data) + 2,
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
    return (
      <div>
        <div className="graph">
          <canvas id="myChart" ref={this.chartRef} />
        </div>
        <div className="bar">
          <div className="level">
            <input
              type="range"
              min="1"
              max="9"
              list="num"
              className="slider"
              onClick={this.handleChange}
            />
            <datalist id="num">
              <option value="1" label="😇" />
              <option value="2" label="" />
              <option value="3" label="🤣" />
              <option value="4" label="" />
              <option value="5" label="🧐" />
              <option value="6" label="" />
              <option value="7" label="🤩" />
              <option value="8" label="" />
              <option value="9" label="😀" />
            </datalist>
          </div>
        </div>
      </div>
    );
  }
}

export default Graph;

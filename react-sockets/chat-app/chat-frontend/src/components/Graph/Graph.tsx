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
    rate: 0,
  };
  //const [data, setData] = [0,0,0,0,0,0,0,0]
  //const [rate, setRate] = 0

  chartRef: any = React.createRef<HTMLDivElement>();

  handleChange = (event) => {
    const value = event.target.value;
    const tempData = ([] as any).concat(this.state.data);
    tempData.splice(value - 1, 1, this.state.data[value - 1] + 1);
    this.setState({
      data: [].concat(tempData),
      rate: value,
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
        labels: ["😨", "😧", "🤔", "🙂", "😀"],
        datasets: [
          {
            type: "line",
            data: this.state.data,
            borderColor: "919191",
            fill: "origin",
          },
          {
            type: "bar",
            label: "count",
            backgroundColor: [
              "#ef3c3c",
              "#f1aa3e",
              "#ffef5e",
              "#cbe441",
              "#5dc03c",
            ],
            borderColor: "blue",
            data: this.state.data,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "How people are understanding",
          fontSize: 20,
        },
        legend: {
          display: false,
          labels: {
            fontColor: "rgb(255, 99, 132)",
          },
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
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Reactions",
                fontSize: 20,
              },
              ticks: {
                display: false,
                //suggestedMax: Math.max(...this.state.data) + 2,
                suggestedMax: 5,
                suggestedMin: 0,
              },
            },
          ],
        },
        animation: {
          duration: 500,
        },
      },
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
              max="5"
              list="num"
              className="slider"
              onClick={this.handleChange}
            />
            <datalist id="num">
              <option value="1" label="😨" />
              <option value="2" label="😧" />
              <option value="3" label="🤔" />
              <option value="4" label="🙂" />
              <option value="5" label="😀" />
            </datalist>
          </div>
        </div>
      </div>
    );
  }
}

export default Graph;

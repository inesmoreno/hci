import React, { Component } from "react";
import Chart from "chart.js";
import "./Graph.css";

let myLineChart;

type State = {
  prevVote: number;
};

class Graph extends Component<
  {
    histogram: number[];
    sendVote: (vote: number, prevVote: number) => void;
    role: string;
  },
  State
> {
  state = {
    prevVote: -1
  };
  //const [data, setData] = [0,0,0,0,0,0,0,0]
  //const [rate, setRate] = 0

  chartRef: any = React.createRef<HTMLDivElement>();

  handleChange = event => {
    const newVote = event.target.value;
    const prevVote = this.state.prevVote;

    this.props.sendVote(newVote, prevVote);
    this.setState({
      prevVote: newVote
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
          ///{
          ///type: "line",
          ///data: this.props.histogram,
          ///borderColor: "919191",
          ///fill: "origin",
          ///},
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
            data: this.props.histogram
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: "How people are understanding",
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
                fontSize: 25
              }
            }
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
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
    const { role } = this.props;

    return (
      <div style={{ width: "100%" }}>
        <div className="graph">
          <canvas id="myChart" ref={this.chartRef} />
        </div>
        {role === "presenter" ? (
          ""
        ) : (
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
        )}
      </div>
    );
  }
}

export default Graph;

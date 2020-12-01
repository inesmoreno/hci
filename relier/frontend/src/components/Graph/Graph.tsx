import React, { Component } from "react";
import Button from "@material-ui/lab/ToggleButton";
import Chart from "chart.js";
import "./Graph.css";
import { useStyles } from "./../../style";

let myLineChart;

type State = {
  prevVote: number;
  timeoutId: any;
};

class Graph extends Component<
  {
    histogram: number[];
    sendVote: (vote: number, prevVote: number) => void;
    clearHistogram: () => void;
    role: string;
  },
  State
> {
  state = {
    prevVote: -1,
    timeoutId: -1,
  };

  chartRef: any = React.createRef<HTMLDivElement>();

  handleChange = (index) => {
    const TIMEOUT = 30000;
    const newVote = index;
    const prevVote = this.state.prevVote;
    const timeoutId = this.state.timeoutId;

    if (timeoutId !== -1) {
      clearTimeout(timeoutId);
    }

    this.props.sendVote(newVote, prevVote);
    const newTimeoutId = setTimeout(() => {
      this.props.sendVote(-1, newVote);
      this.setState({
        prevVote: -1,
      });
    }, TIMEOUT);

    this.setState({
      prevVote: newVote,
      timeoutId: newTimeoutId,
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
    if (typeof myLineChart !== "undefined")
      myLineChart.destroy();
    myLineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["", "", "", "", ""],
        datasets: [
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
            data: this.props.histogram,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "How people are understanding",
          fontSize: 16,
          fontColor: "#FFFFFF90",
        },
        legend: {
          display: false,
          labels: {
            fontColor: "rgb(255, 99, 132)",
          },
        },
        scales: {
          gridLines: {
            display: false,
          },
          xAxes: [
            {
              display: false,
              offset: true,
              categoryPercentage: 1.0,
              barPercentage: 0.9,
              fontSize: 20,
              ticks: {
                fontSize: 25,
              },
            },
          ],
          yAxes: [
            {
              display: false,
              scaleLabel: {
                display: false,
                labelString: "Reactions",
                fontSize: 20,
              },
              ticks: {
                display: false,
                suggestedMax: 5,
                suggestedMin: 0,
              },
            },
          ],
        },
        animation: {
          duration: 0,
        },
      },
    });
  };

  render() {
    const { role } = this.props;

    const levels = ["\u{1F630}", "😧", "🤔", "🙂", "😀"];
    return (
      <div className="levels-wrapper">
        <div className="graph">
          <canvas id="myChart" ref={this.chartRef} />
        </div>
        {role === "presenter" ? (
          <>
            <div className="understanding">
              {levels.map((emote) => (
                <div className="presenter-ticks">
                  {emote}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="understanding">
            {levels.map((emote, index) => (
              <Button
                selected={this.state.prevVote === index}
                onClick={() => this.handleChange(index)}
              >
                {emote}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Graph;

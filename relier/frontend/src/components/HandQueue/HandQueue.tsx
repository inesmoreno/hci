import React, { useReducer } from "react";
import Button from '@material-ui/lab/ToggleButton';
import PanToolIcon from '@material-ui/icons/PanTool';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import {useStyles } from "./../../style";
import "./HandQueue.css";

type State = {
	isSelected: boolean;
};

const initialState: State = {
	isSelected: false,
};

type Action = { type: "setSelected"; payload: string };

const reducer = (state: State, action: Action): State => {
	switch (action.type){
		case "setSelected":
			let newSelected = state.isSelected;
			newSelected = !newSelected;

			return {
				...state,
				isSelected: newSelected
			};
	}
};


export default function RaiseHandButton({ handleChange }: any){
	const classes = useStyles();
	const [state, dispatch] = useReducer(reducer, initialState);

	const setSelected = event => {
		dispatch({
			type: "setSelected",
			payload: event.target.id
		});
	};

	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<CardContent className={classes.cardContent}>
					<Button 
						selected={state.isSelected}
						onChange={setSelected}
						onClick={() => handleChange}
					>
						<PanToolIcon />
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
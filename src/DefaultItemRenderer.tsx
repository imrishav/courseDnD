import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core/styles";
import { Flipped } from "react-flip-toolkit";

import {
  ItemRendererProps,
  useDrag,
  useDrop,
  useIsClosestDragging
} from "react-sortly";

type ItemItemRendererProps = ItemRendererProps<{
  name: string;
}>;
const useStyles = makeStyles<Theme, { muted: boolean; depth: number }>(
  (theme: Theme) => ({
    root: props => ({
      position: "relative",
      marginBottom: theme.spacing(1.5),
      zIndex: props.muted ? 1 : 0
    }),
    body: props => ({
      background: "white",
      cursor: "move",
      padding: theme.spacing(2),
      marginLeft: theme.spacing(props.depth * 2),
      boxShadow: props.muted ? "0px 0px 8px #666" : "0px 0px 2px #666",
      border: props.muted ? "solid 1px #3d3a67" : "1px solid transparent",
      width: "272px",
      height: "63px",
      borderRadius: "8px"
    })
  })
);

const DefaultItemRenderer = (props: ItemItemRendererProps) => {
  const {
    id,
    depth,
    data: { name }
  } = props;
  const [{ isDragging }, drag] = useDrag({
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  console.log("from default", name);
  const [, drop] = useDrop();
  const classes = useStyles({
    muted: useIsClosestDragging() || isDragging,
    depth
  });

  return (
    <Flipped flipId={id}>
      <div ref={ref => drop(ref)} className={classes.root}>
        <div ref={drag} className={classes.body}>
          <span style={{ fontSize: 12, marginLeft: 20 }}>{name}</span>
        </div>
      </div>
    </Flipped>
  );
};

export default DefaultItemRenderer;

import React from "react"
import Chip from "@material-ui/core/Chip"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { block, cx, css } from "style"

const bss = block("tag")

const useStyles = makeStyles({
  colorPrimary: {
    backgroundColor: props => props.color
  }
})

const Tag = ({ value, ...props }) => {
  const classes = useStyles({
    //color
  })

  return (
    <Chip
      label={value}
      size="small"
      className={cx(bss() /*, classes.root*/)}
      {...props}
    />
  )
}

export default Tag

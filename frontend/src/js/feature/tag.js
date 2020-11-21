import React from "react"
import Icon from "component/icon"
import Chip from "@material-ui/core/Chip"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { block, cx, css } from "style"

const bss = block("tag")

const useStyles = makeStyles({
  colorPrimary: {
    backgroundColor: props => props.color
  }
})

const Tag = ({ value, request, className, ...props }) => {
  const classes = useStyles({
    //color
  })

  return (
    <Chip
      label={value}
      size="small"
      icon={request ? <Icon icon="MoreHoriz" /> : null}
      className={cx(bss(), className)}
      {...props}
    />
  )
}

export default Tag

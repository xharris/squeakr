import React from "react"
import Icon from "component/icon"
import Chip from "@material-ui/core/Chip"
import { useThemeContext } from "feature/theme"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { block, cx, css } from "style"

const bss = block("tag")

const useStyles = makeStyles({
  colorPrimary: {
    backgroundColor: props => props.color
  }
})

const Tag = ({ value, request, className, color, ...props }) => {
  const { theme } = useThemeContext()
  const classes = useStyles({
    //color
  })

  return (
    <Chip
      label={value}
      size="small"
      icon={request ? <Icon icon="MoreHoriz" /> : null}
      className={cx(bss(), className)}
      color={color || "primary"}
      {...props}
    />
  )
}

export default Tag

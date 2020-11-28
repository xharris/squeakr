import React from "react"
import Icon from "component/icon"
import Chip from "@material-ui/core/Chip"
import { useThemeContext } from "feature/theme"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { Link } from "react-router-dom"
import * as url from "util/url"
import { block, cx, css } from "style"

const bss = block("tag")

const useStyles = makeStyles({
  colorPrimary: {
    backgroundColor: props => props.color
  }
})

const Tag = ({
  value,
  request,
  className,
  color,
  username,
  size,
  nolink,
  ...props
}) => {
  const { theme } = useThemeContext()
  const classes = useStyles({
    //color
  })

  return (
    <Chip
      label={value}
      size={size === "small" ? "small" : "medium"}
      icon={request ? <Icon icon="MoreHoriz" /> : null}
      className={cx(bss(), className)}
      color="primary"
      href={nolink ? null : url.tag({ username, tags: [value] })}
      clickable
      component={nolink ? null : "a"}
      {...props}
    />
  )
}

export default Tag

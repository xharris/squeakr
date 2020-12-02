import React from "react"
import Icon from "component/icon"
import Chip from "@material-ui/core/Chip"
import { useThemeContext } from "feature/theme"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { Link } from "react-router-dom"
import * as url from "util/url"
import { block, cx, css, pickFontColor } from "style"
import { TinyColor } from "@ctrl/tinycolor"

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
  color: _color,
  username,
  size,
  nolink,
  children,
  clickable,
  onDelete,
  onClick,
  ...props
}) => {
  const { theme } = useThemeContext()
  const color = theme[_color || "primary"] || _color
  const hover_color = new TinyColor(color)
  const Container = props => (nolink ? <div {...props} /> : <a {...props} />)

  return (
    <Container
      className={cx(
        bss({
          size: size || "medium",
          clickable: onClick || clickable || !nolink,
          request
        }),
        css({
          color: pickFontColor(color, color, 50),
          backgroundColor: color,
          "&:hover, &:focus": (onClick || clickable || !nolink) && {
            backgroundColor: hover_color.isLight()
              ? hover_color.darken(20).toString()
              : hover_color.brighten(20).toString()
          }
        }),
        className
      )}
      href={nolink ? null : url.tag({ username, tags: [value] })}
      onClick={onClick}
      tabIndex="0"
      onKeyDown={e => {
        if (e.key === "Enter") {
          if (onClick) onClick(e)
          return false
        }
      }}
      {...props}
    >
      {request && <Icon className={bss("more")} icon="MoreHoriz" />}
      <div className={bss("value")}>{value}</div>
      {onDelete && (
        <Icon
          className={cx(
            bss("delete"),
            css({
              "&:hover, &:focus": {
                backgroundColor: hover_color.isLight()
                  ? hover_color.darken(20).toString()
                  : hover_color.brighten(20).toString()
              }
            })
          )}
          icon="Close"
          onClick={onDelete}
        />
      )}
    </Container>
  )
}

export default Tag

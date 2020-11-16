import React, { useState, forwardRef } from "react"
import { Link } from "react-router-dom"
import Popover from "@material-ui/core/Popover"

import Icon from "component/icon"

import { block, cx, css, pickFontColor, lightenDarken } from "style"

const bss = block("button")
const Button = forwardRef(
  (
    {
      icon,
      iconPlacement,
      to,
      onClick,
      className,
      rounded,
      popover,
      label,
      outlined,
      type,
      link,
      color,
      ...props
    },
    ref
  ) => {
    const [anchor, setAnchor] = useState()
    const Content = () => (
      <>
        {icon && iconPlacement !== "right" && <Icon icon={icon} />}
        {label && <div className={bss("label")}>{label}</div>}
        {icon && iconPlacement === "right" && <Icon icon={icon} />}
      </>
    )
    const style =
      color &&
      css({
        borderColor: color,
        "&:hover, &:focus": {
          backgroundColor: color
        },
        [`& > *`]: {
          color: lightenDarken(pickFontColor(color), -30)
        }
      })

    return to ? (
      <Link
        className={cx(bss({ type: "link" }), style, className)}
        ref={ref}
        to={to}
        {...props}
      >
        <Content />
      </Link>
    ) : (
      [
        <button
          ref={ref}
          key="button"
          className={cx(
            bss({ type: link ? "link" : "button", rounded, outlined }),
            style,
            className
          )}
          onClick={e => {
            onClick && onClick()
            popover && setAnchor(e.currentTarget)
          }}
          type={type || "button"}
          {...props}
        >
          <Content />
        </button>,
        <Popover
          key="popover"
          className={cx(bss("popover"), className)}
          open={anchor != null}
          anchorEl={anchor}
          onClose={() => setAnchor(null)}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center"
          }}
        >
          {popover && popover({ onClose: () => setAnchor(null) })}
        </Popover>
      ]
    )
  }
)

export default Button

import React, { useState, forwardRef } from "react"
import { Link } from "react-router-dom"
import Popover from "@material-ui/core/Popover"

import Icon from "component/icon"

import { block, cx } from "style"

const bss1 = block("linkbutton")
export const LinkButton = ({ onClick, className, children, ...props }) => (
  <button className={cx(bss1(), className)} onClick={onClick} {...props}>
    {children}
  </button>
)

const bss2 = block("button")
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
      ...props
    },
    ref
  ) => {
    const [anchor, setAnchor] = useState()

    return to ? (
      <Link
        className={cx(bss2({ type: "link" }), className)}
        ref={ref}
        to={to}
        {...props}
      >
        <Icon icon={icon} />
      </Link>
    ) : (
      [
        <button
          ref={ref}
          key="button"
          className={cx(bss2({ type: "button", rounded, outlined }), className)}
          onClick={e => {
            onClick && onClick()
            popover && setAnchor(e.currentTarget)
          }}
          {...props}
        >
          {icon && iconPlacement !== "right" && <Icon icon={icon} />}
          {label && <div className={bss2("label")}>{label}</div>}
          {icon && iconPlacement === "right" && <Icon icon={icon} />}
        </button>,
        <Popover
          key="popover"
          className={cx(bss2("popover"), className)}
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

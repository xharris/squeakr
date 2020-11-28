import React, { useState, forwardRef } from "react"
import { Link } from "react-router-dom"
import Popover from "@material-ui/core/Popover"
import { useThemeContext } from "feature/theme"

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
      type = "button",
      link,
      bg: _bg, // the background of the element the button will appear in (not the button's background color)
      color: _color,
      ...props
    },
    ref
  ) => {
    const { theme } = useThemeContext()
    const [anchor, setAnchor] = useState()
    const Content = () => (
      <>
        {icon && iconPlacement !== "right" && <Icon icon={icon} />}
        {label && <div className={bss("label")}>{label}</div>}
        {icon && iconPlacement === "right" && <Icon icon={icon} />}
      </>
    )

    const bg = theme[_bg || "primary"]
    const color = theme[_color] || _color || theme.primary

    const style = css({
      borderColor: pickFontColor(bg, color, 50),
      textDecoration: to && `underline ${pickFontColor(bg, color, 150)}`,
      color: pickFontColor(bg, color, 150),
      [`&:hover, ${bss({ rounded })}`]: {
        backgroundColor: type === "button" && pickFontColor(bg, color, 50)
      },
      "&:hover > *": {
        color: type === "button" && pickFontColor(color, color, 600),
        textDecoration:
          (type === "link" || to) &&
          `underline ${pickFontColor(color, color, 600)}`
      },
      "& > *": {
        color: pickFontColor(bg, color)
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

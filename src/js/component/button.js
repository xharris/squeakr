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
      // lightness =
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

    const bg = theme[_bg] || _bg || theme.primary
    const color = theme[_color] || _color || theme.primary

    const style = css({
      borderColor: outlined && pickFontColor(bg, color, 20),
      textDecoration:
        type === "link" && `underline ${pickFontColor(bg, color, 30)}`,
      color: pickFontColor(bg, color, 40),
      [`&:hover, ${bss({ rounded })}`]: {
        backgroundColor: type === "button" && pickFontColor(bg, color, 20)
      },
      "&:hover > *": {
        borderColor: pickFontColor(bg, color, 20),
        color: pickFontColor(color, color, type === "link" ? 20 : 120),
        textDecoration:
          type === "link" &&
          `underline ${pickFontColor(color, color, type === "link" ? 20 : 120)}`
      },
      "& > *":
        type === "link"
          ? {
              color: lightenDarken(theme.primary, -10),
              textShadow: `0px 0px 1px ${lightenDarken(theme.primary, -10)}`
            }
          : {
              color: pickFontColor(bg, color, 40)
            }
    })

    return to ? (
      <Link
        className={cx(bss({ type }), style, className)}
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
          className={cx(bss({ type, rounded, outlined }), style, className)}
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

import React, { useState, useRef, forwardRef } from "react"
import Tooltip from "@material-ui/core/Tooltip"
import { cx, css, block } from "style"

const bss = block("input")

const Input = forwardRef(
  ({ className, color, tooltip, outlined, children, ...props }, ref) => {
    const [focused, setFocused] = useState()

    return (
      <Tooltip
        title={tooltip || ""}
        disableFocusListener={!tooltip}
        disableHoverListener={!tooltip}
        disableTouchListener={!tooltip}
        placement="top"
        className={cx(bss(), className)}
      >
        <div
          className={cx(
            bss("container", { focused }),
            css({
              [":hover"]: {
                border: `1px solid ${color || "#bdbdbd"}`,
                boxShadow: `0px 0px 3px 1px ${color || "#bdbdbd"}`
              },
              border: (outlined || focused) && `1px solid ${color || "#bdbdbd"}`
            })
          )}
          onClick={e => {
            if (ref && ref.current) {
              ref.current.focus()
            }
            e.stopPropagation()
          }}
        >
          {children}
          <input
            ref={ref}
            className={bss("input")}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
        </div>
      </Tooltip>
    )
  }
)

export default Input
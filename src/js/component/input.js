import React, { useState, useRef, forwardRef } from "react"
import Tooltip from "@material-ui/core/Tooltip"
import Button from "component/button"
import { useCombinedRef } from "util"
import { cx, css, block, lightenDarken } from "style"

const bss = block("input")

const Input = forwardRef(
  (
    {
      className,
      color,
      tooltip,
      outlined,
      children,
      showinput,
      disabled,
      size,
      onClear,
      dirty,
      ...props
    },
    ref
  ) => {
    const el_input = useRef()
    const comboref = useCombinedRef(ref, el_input)
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
              minHeight: size === "small" ? 21 : 32,
              ":hover": !disabled && {
                border: `1px solid ${color || "#bdbdbd"}`,
                boxShadow: `0px 0px 3px 1px ${color || "#bdbdbd"}`
              },
              border:
                (outlined || focused) &&
                !disabled &&
                `1px solid ${color || "#bdbdbd"}`
            })
          )}
          onClick={e => {
            if (comboref && comboref.current) {
              comboref.current.focus()
            }
            e.stopPropagation()
          }}
        >
          {children}
          {showinput !== false && (
            <input
              ref={comboref}
              className={cx(
                bss("input"),
                css({
                  "::placeholder": {
                    color: lightenDarken(color, 70)
                  }
                })
              )}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={disabled}
              {...props}
            />
          )}
          {onClear && (dirty == null || dirty === true) && (
            <Button
              icon="Close"
              title="clear"
              className={css({
                marginLeft: 3,
                cursor: "pointer"
              })}
              onClick={onClear}
            />
          )}
        </div>
      </Tooltip>
    )
  }
)

export default Input

import React, { useState, useEffect, useRef } from "react"

import Icon from "component/icon"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import Grow from "@material-ui/core/Grow"
import Paper from "@material-ui/core/Paper"
import Popper from "@material-ui/core/Popper"
import MenuItem from "@material-ui/core/MenuItem"
import MenuList from "@material-ui/core/MenuList"
import Button from "component/button"
import { block } from "style"

const bss = block("menubutton")

const MenuButton = ({ label, items, closeOnSelect }) => {
  const [open, setOpen] = useState(false)
  const el_button = useRef()
  const prevOpen = useRef(open)
  const handleToggle = () => setOpen(prev => !prev)
  const handleClose = e =>
    !(el_button.current && el_button.current.contains(e.target)) &&
    setOpen(false)
  const handleListKeyDown = e => {
    if (e.key === "Tab") {
      e.preventDefault()
      setOpen(false)
    }
  }
  useEffect(() => {
    if (prevOpen.current === true && open === false) el_button.current.focus()
    prevOpen.current = open
  }, [open])

  return (
    <div className={bss()}>
      <Button
        ref={el_button}
        onClick={handleToggle}
        label={label}
        icon="ArrowDropDown"
        iconPlacement="right"
      />
      <Popper open={open} anchorEl={el_button.current} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "left top" : "left bottom"
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
                  {items.map((item, i) => (
                    <MenuItem
                      key={i}
                      classes={{ root: "MenuItem" }}
                      onClick={e => {
                        item.onClick && item.onClick(e, item)
                        if (closeOnSelect) handleClose(e)
                      }}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}

export default MenuButton
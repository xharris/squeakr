import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowBack,
  ChevronLeft,
  ChevronRight,
  Edit,
  ExpandMore,
  ExpandLess,
  Check,
  Save,
  Close,
  Add,
  Delete,
  Menu,
  Subject,
  FeaturedPlayList
} from "@material-ui/icons"
import Popover from "@material-ui/core/Popover"

import { block, cx } from "style"

const icons = {
  ArrowBack,
  ChevronLeft,
  ChevronRight,
  Edit,
  ExpandMore,
  ExpandLess,
  Check,
  Save,
  Close,
  Add,
  Delete,
  Menu,
  Subject,
  FeaturedPlayList
}

export const Icon = ({ icon, ...props }) => {
  const FinalIcon = icons[icon]
  return <FinalIcon {...props} />
}

const bssLB = block("linkbutton")
export const LinkButton = ({ onClick, className, children, ...props }) => (
  <button className={cx(bssLB(), className)} onClick={onClick} {...props}>
    {children}
  </button>
)

const bssIB = block("iconbutton")
export const IconButton = ({
  icon,
  to,
  onClick,
  className,
  rounded,
  popover,
  ...props
}) => {
  const [anchor, setAnchor] = useState()

  return to ? (
    <Link className={cx(bssIB({ type: "link" }), className)} to={to} {...props}>
      <Icon icon={icon} />
    </Link>
  ) : (
    [
      <button
        key="button"
        className={cx(bssIB({ type: "button", rounded }), className)}
        onClick={e => {
          onClick && onClick()
          popover && setAnchor(e.currentTarget)
        }}
        {...props}
      >
        <Icon icon={icon} />
      </button>,
      <Popover
        key="popover"
        className={cx(bssIB("popover"), className)}
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
        {popover}
      </Popover>
    ]
  )
}

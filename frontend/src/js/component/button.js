import React from "react"
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
  Menu
} from "@material-ui/icons"

import { block } from "style"

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
  Menu
}

export const Icon = ({ icon, ...props }) => {
  const FinalIcon = icons[icon]
  return <FinalIcon {...props} />
}

const bssLB = block("linkbutton")
export const LinkButton = ({ onClick, className, children, ...props }) => (
  <button className={bssLB(className)} onClick={onClick} {...props}>
    {children}
  </button>
)

const bssIB = block("iconbutton")
export const IconButton = ({ icon, to, onClick, className, ...props }) =>
  to ? (
    <Link className={bssIB({ type: "link" }, className)} to={to} {...props}>
      <Icon icon={icon} />
    </Link>
  ) : (
    <button
      className={bssIB({ type: "button" }, className)}
      onClick={onClick}
      {...props}
    >
      <Icon icon={icon} />
    </button>
  )

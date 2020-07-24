import React from "react"
import { Link } from "react-router-dom"

import { ChevronRight, Edit, ExpandMore, ExpandLess } from "@material-ui/icons"

import { block } from "style"
const bss = block("iconbutton")

const icons = {
  ChevronRight,
  Edit,
  ExpandMore,
  ExpandLess
}

const IconButton = ({ icon, to, onClick }) => {
  const FinalIcon = icons[icon]
  return to ? (
    <Link className={bss()} to={to}>
      <FinalIcon />
    </Link>
  ) : (
    <button className={bss()} onClick={onClick}>
      <FinalIcon />
    </button>
  )
}

export default IconButton

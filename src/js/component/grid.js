import React from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
// import StackGrid from "react-stack-grid"
import { cx, css, block } from "style"

const bss = block("grid")

const columnsCountBreakPoints = { 350: 1, 750: 2, 900: 3 }

const Grid = ({ className, children, ...props }) => {
  return (
    <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
      <Masonry className={cx(bss(), className)} {...props}>
        {children}
      </Masonry>
    </ResponsiveMasonry>
  )
}

export default Grid

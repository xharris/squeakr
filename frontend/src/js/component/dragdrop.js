import React, { useState, createContext, useContext } from "react"
import * as ReactDnd from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { block, cx } from "style"

const DragDropContext = createContext({
  typeDragging: null,
  setTypeDragging: () => {}
})

const bssDrag = block("draggable")

export const Draggable = ({
  children,
  render,
  className,
  dragType,
  ...props
}) => {
  const [{ dragging }, drag, preview] = ReactDnd.useDrag({
    item: { type: dragType },
    collect: monitor => ({
      dragging: monitor.isDragging()
    })
  })
  const { setTypeDragging } = useContext(DragDropContext)

  return (
    <div {...props} ref={drag} className={cx(bssDrag({ dragging }), className)}>
      {children || render({ preview })}
    </div>
  )
}

const bssDrop = block("dropzone")

export const Dropzone = ({ accept, children, className, ...props }) => {
  const [{ isActive, isDragging }, drop] = ReactDnd.useDrop({
    accept,
    drop: (item, monitor) => {
      if (monitor.didDrop()) return
    },
    collect: monitor => ({
      isActive: monitor.canDrop() && monitor.isOver(),
      isOver: monitor.isOver({ shallow: true })
    })
  })
  const { typeDragging } = useContext(DragDropContext)
  return (
    <div
      {...props}
      ref={drop}
      className={cx(
        bssDrop({
          over: isActive,
          open: Array.isArray(accept)
            ? accept.includes(typeDragging)
            : accept === typeDragging
        }),
        className
      )}
    >
      {children}
    </div>
  )
}

export const DndProvider = ({ children }) => {
  const [type, setType] = useState()
  return (
    <DragDropContext.Provider
      value={{ typeDragging: type, setTypeDragging: setType }}
    >
      <ReactDnd.DndProvider backend={HTML5Backend}>
        {children}
      </ReactDnd.DndProvider>
    </DragDropContext.Provider>
  )
}

import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext
} from "react"

import { block, cx, css } from "style"
const bss = block("dragdrop")

const DragDropContext = createContext({
  draggingData: {},
  setDraggingData: () => {},
  clearDraggingData: () => {},
  setTypeDragging: () => {},
  setIdDragging: () => {},
  setCopying: () => {}
})

export const DragDrop = ({
  accept,
  children,
  className,
  info = {},
  onDrop,
  onDragEnter,
  draggable,
  ...props
}) => {
  const [dragging, setDragging] = useState()
  const [dropping, setDropping] = useState()
  const { draggingData, clearDraggingData, setDraggingData } = useContext(
    DragDropContext
  )

  const { id, type } = info

  const isAccepting =
    draggingData &&
    draggingData.id !== id &&
    [].concat(accept).includes(draggingData.type)

  useEffect(() => {
    if (!draggingData.type) setDropping(false)
  }, [draggingData])

  return (
    <div
      {...props}
      draggable={draggable != false && type != null}
      className={cx(
        bss({
          dragging,
          dropping,
          open: onDrop && isAccepting,
          closed: draggingData.type && !dragging && !(onDrop && isAccepting)
        }),
        className
      )}
      onDragStart={e => {
        e.stopPropagation()
        setDragging(true)
        setDraggingData(info)
      }}
      onDragEnd={e => {
        e.stopPropagation()
        setDragging(false)
        clearDraggingData()
      }}
    >
      <div
        className={bss("dropzone")}
        onDragLeave={e => {
          e.preventDefault()
          if (isAccepting) {
            e.dataTransfer.dropEffect = "none"
            setDropping(false)
          }
        }}
        onDragOver={e => {
          e.preventDefault()
          if (isAccepting && (!onDragEnter || onDragEnter(type, e))) {
            e.dataTransfer.dropEffect = draggingData.copy ? "copy" : "move"
            setDropping(true)
          } else {
            e.dataTransfer.dropEffect = "none"
          }
        }}
        onDrop={e => {
          if (isAccepting && onDrop) {
            onDrop(draggingData, e)
            setDropping(false)
          }
        }}
      ></div>
      {children}
    </div>
  )
}

export const DndProvider = ({ children }) => {
  const [draggingData, setDraggingData] = useState({})

  useEffect(() => {
    const keyChange = e =>
      setDraggingData({ ...draggingData, copy: e.keyCode === 17 })

    document.addEventListener("keydown", keyChange)
    document.addEventListener("keyup", keyChange)
    return () => {
      document.removeEventListener("keydown", keyChange)
      document.removeEventListener("keyup", keyChange)
    }
  }, [])

  return (
    <DragDropContext.Provider
      value={{
        draggingData,
        setDraggingData: d => setDraggingData({ ...draggingData, ...d }),
        clearDraggingData: () => setDraggingData({}),
        setTypeDragging: _type =>
          setDraggingData({ ...draggingData, type: [].concat(_type) }),
        setIdDragging: _id => setDraggingData({ ...draggingData, id: _id })
      }}
    >
      {children}
    </DragDropContext.Provider>
  )
}

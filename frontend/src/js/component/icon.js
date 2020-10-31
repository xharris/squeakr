import React from "react"
import * as Icons from "@material-ui/icons"

export const Icon = ({ icon, ...props }) => {
  const FinalIcon = Icons[icon]
  return <FinalIcon {...props} />
}

export default Icon

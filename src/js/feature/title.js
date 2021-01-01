import React from "react"

const Title = ({ children }) => (
  <title>{children ? `${children} | Squeakr` : "Squeakr"}</title>
)

export default Title

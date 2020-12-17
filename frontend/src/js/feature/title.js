import React from "react"

const Title = ({ children }) => (
  <title>{children ? `${children} | Squeaker` : "Squeaker"}</title>
)

export default Title

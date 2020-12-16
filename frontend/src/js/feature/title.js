import React from "react"

const Title = ({ children }) => (
  <title>{children ? `${children} | SharingSite` : "SharingSite"}</title>
)

export default Title

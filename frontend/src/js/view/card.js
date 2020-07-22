import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Card from "component/card"

const CardView = () => {
  const { id } = useParams()

  return id ? <Card id={id} /> : null
}

export default CardView

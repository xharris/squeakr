import React, { useState, useEffect } from "react"
import Card from "component/card"
import * as apiPost from "api/post"

import { block } from "style"

const bss = block("postmodal")

const Post = ({ id, data: _data, theme }) => {
  const [data, setData] = useState(_data)

  useEffect(() => {
    if (!_data && id) {
      apiPost.get(id).then(setData)
    }
  }, [])

  useEffect(() => {
    if (!theme) theme = data.user.theme
  }, [data])

  return (
    data && (
      <Card className={bss()} color={"#616161"} bgColor={theme.secondary}>
        {data._id}
      </Card>
    )
  )
}

export default Post

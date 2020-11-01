import React, { useState, useEffect } from "react"

import Button from "component/button"
import CategoryTemplate from "feature/category_template"
import * as apiCategoryT from "api/category_template"
import { useFetch } from "util"
import { block } from "style"

const bss = block("category_editor")

const CategoryEditor = () => {
  const [data, fetch] = apiCategoryT.useGet()

  useEffect(() => {
    fetch()
  }, [])

  return (
    <div className={bss()}>
      <Button icon="Add" label="Category" onClick={() => apiCategoryT.add()} />
      <div className={bss("list")}>
        {data &&
          data.map(category => (
            <CategoryTemplate key={category._id} data={category} />
          ))}
      </div>
    </div>
  )
}

export default CategoryEditor

import React, { useEffect, useState, createContext } from "react"
import { useParams } from "react-router-dom"

import Card from "component/card"
import { IconButton } from "component/button"

import { useFetch, dispatch } from "util"
import * as apiCard from "api/card"

import { block } from "style"
const bss = block("cardview")

export const CardViewContext = createContext({
  fetch: () => {}
})

const CardView = () => {
  const [cards, fetchCards] = useFetch(() =>
    apiCard.getUser("0" /* current_user_id */)
  )
  const { id } = useParams()

  useEffect(() => {
    fetchCards()
  }, [])

  return (
    <CardViewContext.Provider
      value={{
        fetch: fetchCards
      }}
    >
      <div className={bss()}>
        {id ? (
          <Card id={id} expanded />
        ) : cards ? (
          cards.map(c => <Card id={c._id} key={c._id} expanded />)
        ) : null}
        <IconButton
          icon="Add"
          variant="contained"
          size="medium"
          onClick={() =>
            apiCard.add({ created_by: "0" }).then(() => fetchCards())
          }
        />
      </div>
    </CardViewContext.Provider>
  )
}
export default CardView

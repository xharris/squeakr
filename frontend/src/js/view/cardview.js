import React, { useEffect, createContext } from "react"
import { useParams } from "react-router-dom"

import Card from "component/card"
import { IconButton } from "component/button"

import { useFetch } from "util"
import * as apiCard from "api/card"

import { block } from "style"
const bss = block("cardview")

export const CardViewContext = createContext({ fetch: () => {} })

const CardView = () => {
  const [cards, fetchCards] = useFetch(() =>
    apiCard.getUser(0 /* current_user_id */)
  )
  const { id } = useParams()

  useEffect(() => {
    fetchCards()
  }, [])

  return (
    <CardViewContext.Provider value={{ fetch: fetchCards }}>
      <div className={bss()}>
        {id ? (
          <Card id={id} expanded fetchCards={fetchCards} />
        ) : cards ? (
          cards.map(c => (
            <Card data={c} key={c._id} expanded fetchCards={fetchCards} />
          ))
        ) : null}
        <IconButton
          icon="Add"
          variant="contained"
          size="medium"
          onClick={() => apiCard.add().then(() => fetchCards())}
        />
      </div>
    </CardViewContext.Provider>
  )
}
export default CardView

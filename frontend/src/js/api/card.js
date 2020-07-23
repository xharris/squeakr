const fake_content = {
  "0": {
    type: "text",
    value: "I would like some fun. And here it is!!"
  },
  "1": {
    type: "text",
    value: "The most magical place on earth xD"
  },
  "2": {
    type: "text",
    value: "A personal favorite"
  },
  "3": {
    type: "text",
    value: "Some hotels that are\n* affordable\n* clean"
  }
}

const fake_cards = {
  "0": {
    title: "My Vacation",
    content: "0",
    attributes: [
      { type: "tag", value: "summer", color: "FFC107" },
      { type: "tag", value: "personal", color: "03A9F4" }
    ],
    permissions: {
      view: ["all"],
      edit: ["all"],
      delete: ["admin-id"]
    },
    children: ["0.3", "0.1", "0.2"]
  },
  "0.1": {
    title: "Disney World",
    content: "1",
    attributes: [
      { type: "tag", value: "skippable", color: "FFC107" },
      { type: "tag", value: "curfew", color: "3F51B5" }
    ],
    permissions: {
      view: ["all"],
      edit: ["all"],
      delete: ["admin-id"]
    },
    children: []
  },
  "0.2": {
    title: "Univseral Studios",
    content: "2",
    mini: {
      show_content: true
    },
    attributes: [
      { type: "tag", value: "repeat", color: "8BC34A" },
      { type: "tag", value: "curfew", color: "3F51B5" }
    ],
    permissions: {
      view: ["all"],
      edit: ["all"],
      delete: ["admin-id"]
    },
    children: []
  },
  "0.3": {
    title: "Hotels",
    content: "3",
    mini: {
      show_content: true
    },
    children: ["0"]
  }
}

const fake_users = {
  xharris: {
    root_cards: ["0"]
  }
}

// will actually be async in the future
export const getCard = async id => {
  const ret_card = { ...fake_cards[id] }
  // get contend for card
  if (ret_card.content) ret_card.content = fake_content[ret_card.content]
  // get data for child cards
  ret_card.children = ret_card.children.map(c => ({
    ...fake_cards[c],
    content: fake_cards[c].content ? fake_content[fake_cards[c].content] : null,
    id: c
  }))
  console.log("fetch", ret_card)
  return ret_card
}

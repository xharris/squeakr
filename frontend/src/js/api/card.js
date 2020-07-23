const fake_content = {}

const fake_cards = {
  "0": {
    type: "card",
    title: "My Vacation",
    attributes: [
      { type: "tag", value: "summer", color: "FFC107" },
      { type: "tag", value: "personal", color: "03A9F4" }
    ],
    permissions: {
      view: ["all"],
      edit: ["all"],
      delete: ["admin-id"]
    },
    children: ["content0", "0.3", "0.1", "0.2"]
  },
  "0.1": {
    type: "card",
    title: "Disney World",
    attributes: [
      { type: "tag", value: "skippable", color: "FFC107" },
      { type: "tag", value: "curfew", color: "3F51B5" }
    ],
    permissions: {
      view: ["all"],
      edit: ["all"],
      delete: ["admin-id"]
    },
    children: ["content1"]
  },
  "0.2": {
    type: "card",
    title: "Univseral Studios",
    mini: {
      show: "content0"
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
    children: ["content0", "content1"]
  },
  "0.3": {
    type: "card",
    title: "Hotels",
    mini: {
      show: "content3"
    },
    children: ["content3", "0"]
  },
  content0: {
    type: "text",
    title: "My thoughts",
    color: "ffcdd2",
    value: "I would like some fun. And here it is!!"
  },
  content1: {
    type: "text",
    value: "The most magical place on earth xD"
  },
  content2: {
    type: "text",
    value: "A personal favorite"
  },
  content3: {
    type: "text",
    value: "Some hotels that are\n* affordable\n* clean"
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
  // get data for child cards
  ret_card.children = ret_card.children.map(c => ({
    ...fake_cards[c],
    child:
      fake_cards[c].mini && fake_cards[c].mini.show
        ? {
            ...fake_cards[fake_cards[c].mini.show],
            id: fake_cards[c].mini.show
          }
        : null,
    id: c
  }))
  console.log("fetch", ret_card)
  return ret_card
}

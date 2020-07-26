export const block = mainName => (subName, states) => {
  if (typeof subName == "object") {
    states = subName
    subName = null
  }
  return [
    `${mainName}${subName ? `--${subName}` : ""}`,
    states
      ? Object.entries(states)
          .map(
            ([k, v]) =>
              v &&
              `${mainName}${subName ? `--${subName}` : ""}--${k}${
                v !== true ? `-${v}` : ""
              }`
          )
          .join(" ")
      : null
  ]
    .filter(cls => cls) // remove nulls
    .join(" ")
}

export const pickFontColor = bg => {
  var match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(bg)
  const rgb = {
    r: parseInt(match[1], 16) ** 2,
    g: parseInt(match[2], 16) ** 2,
    b: parseInt(match[3], 16) ** 2
  }
  const brightness = Math.sqrt(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b)
  return brightness > 130 ? "#000" : "#fff"
}

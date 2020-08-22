import * as emotion from "emotion"

export const css = emotion.css
export const cx = emotion.cx

export const block = mainName => (...args) => {
  const states = {}
  args.forEach(
    e =>
      typeof e === "object" &&
      Object.entries(e).forEach(
        ([k, v]) => k !== "undefined" && (states[k] = v)
      )
  )
  const classes = args.filter(e => ["string", "boolean"].includes(typeof e))

  const ret_class = [
    classes.map(c => `${mainName}--${c}`),
    Object.entries(states)
      .map(([k, v]) => v && `${mainName}--${k}${v !== true ? `-${v}` : ""}`)
      .join(" ")
  ].filter(cls => cls) // remove nulls

  return emotion.cx(classes.length === 0 && mainName, ...ret_class)
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

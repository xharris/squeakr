export const block = mainName => (subName, states) => {
  if (typeof subName == "object") {
    states = subName
    subName = null
  }
  return [
    `${mainName}${subName ? `--${subName}` : ""}`,
    states &&
      Object.entries(states)
        .map(
          ([k, v]) =>
            `${mainName}${subName ? `--${subName}` : ""}--${k}${
              v !== false && v !== true ? `-${v}` : ""
            }`
        )
        .join(" ")
  ].join(" ")
}

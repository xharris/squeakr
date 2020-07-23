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
            v &&
            `${mainName}${subName ? `--${subName}` : ""}--${k}${
              v !== true ? `-${v}` : ""
            }`
        )
        .join(" ")
  ].join(" ")
}

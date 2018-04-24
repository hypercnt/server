export const mapActions = ({ actions, name }) => {
  let action = actions

  name.split(".").forEach(k => {
    if (typeof action !== "function" && action[k]) {
      action = action[k]
    }
  })

  return action
}

export default mapActions

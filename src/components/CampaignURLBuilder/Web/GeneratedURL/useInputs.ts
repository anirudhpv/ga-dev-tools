import { useState } from "react"

const useInputs = () => {
  const [useFragment, setUseFragment] = useState(false)
  const [hasWarning, setHasWarning] = useState(false)

  return {
    useFragment,
    setUseFragment,
    hasWarning,
    setHasWarning,
  }
}

export default useInputs

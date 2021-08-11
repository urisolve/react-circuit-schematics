import { useCallback, useEffect, useRef, useState } from 'react'
import lodash from 'lodash'

export const useMousePosition = (ref, fps = 30) => {
  const [mousePosition, setMousePosition] = useState({ x: NaN, y: NaN })
  const area = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    area.current = ref.current.getBoundingClientRect()
  }, [ref])

  const calcMousePosition = useCallback(
    lodash.throttle((event) => {
      setMousePosition({
        x: event.pageX - area.current.left,
        y: event.pageY - area.current.top
      })
    }, 1000 / fps),
    [setMousePosition, fps]
  )

  useEffect(() => {
    if (!ref.current) return
    ref.current.addEventListener('mousemove', calcMousePosition)

    return () => {
      if (!ref.current) return
      ref.current.removeEventListener('mousemove', calcMousePosition)
    }
  }, [ref])

  return mousePosition
}

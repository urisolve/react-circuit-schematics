import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback
} from 'react'
import { throttle } from 'lodash'

import { areasIntersect } from '../../util'

const defaultArea = {
  left: 0,
  top: 0,
  width: 0,
  height: 0
}

const MOUSE = Object.freeze({ NONE: 0, LEFT: 1, MIDDLE: 2, RIGHT: 3 })

export const SelectionArea = forwardRef(
  (
    {
      getRef,
      selectableItems = [],
      selectingItems,
      setSelectingItems,
      selectedItems,
      setSelectedItems,
      parentRef = window,
      fps = 30,
      style,
      disabled,
      ...rest
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false)
    const selectableAreas = useRef([])
    const parentRect = useRef(null)
    const startPoint = useRef(null)
    const selectionArea = useRef(defaultArea)

    /**
     * Calculate the areas of the elements
     */
    useEffect(() => {
      // Calculate the bounding area of the parent element
      const rect = parentRef.current.getBoundingClientRect()
      parentRect.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      }

      // Calculate the bounding areas of the items
      for (const elem of selectableItems) {
        const rect = getRef(elem.id).current.getBoundingClientRect()
        selectableAreas.current.push({
          id: elem.id,
          left: rect.left - parentRect.current.left,
          top: rect.top - parentRect.current.top,
          width: rect.width,
          height: rect.height
        })
      }
    }, [getRef])

    /**
     * Handler for pressing left mouse button.
     */
    const onMouseDown = useCallback(
      (event) => {
        if (disabled) return
        if (event.which !== MOUSE.LEFT) return

        // Calculate click point
        const clickPoint = {
          left: event.pageX - parentRect.current.left,
          top: event.pageY - parentRect.current.top
        }

        // Single click on selectable items
        for (const area of selectableAreas.current) {
          if (areasIntersect(clickPoint, area)) {
            if (event.ctrlKey)
              setSelectedItems((items) => {
                items.add(area.id)
                return items
              })
            else setSelectedItems(new Set([area.id]))

            event.preventDefault()
            return
          }
        }

        // Set the beginning of the selection area
        startPoint.current = clickPoint
        selectionArea.current = {
          ...startPoint.current,
          width: 0,
          height: 0
        }

        // Unselect the selected items
        setSelectedItems(new Set())

        // Enable event listeners for drag
        parentRef.current.addEventListener('mousemove', onMouseMove)
        parentRef.current.addEventListener('mouseup', onMouseUp)

        event.preventDefault()
      },
      [setIsDragging, setSelectedItems]
    )

    /**
     * Handler for moving the mouse.
     */
    const onMouseMove = useCallback(
      throttle((event) => {
        // Start dragging
        setIsDragging(true)

        // Calculate the current position of mouse
        const endPoint = {
          left: event.pageX - parentRect.current.left,
          top: event.pageY - parentRect.current.top
        }

        // Calculate the selection area
        selectionArea.current = {
          height: Math.abs(endPoint.top - startPoint.current.top),
          width: Math.abs(endPoint.left - startPoint.current.left),
          top:
            endPoint.top - startPoint.current.top > 0
              ? startPoint.current.top
              : endPoint.top,
          left:
            endPoint.left - startPoint.current.left > 0
              ? startPoint.current.left
              : endPoint.left
        }

        // Calculate which elements are being selected
        const items = new Set()
        for (const area of selectableAreas.current)
          if (areasIntersect(area, selectionArea.current)) items.add(area.id)
        setSelectingItems(items)

        event.preventDefault()
      }, 1000 / fps),
      [setSelectingItems, startPoint]
    )

    /**
     * Handler for letting go of mouse1.
     */
    const onMouseUp = useCallback(
      (event) => {
        setIsDragging(false)

        // Apply the selection
        setSelectingItems((items) => {
          setSelectedItems(new Set([...items]))
          return new Set()
        })

        // Remove event listeners while not being used
        parentRef.current.removeEventListener('mousemove', onMouseMove)
        parentRef.current.removeEventListener('mouseup', onMouseUp)

        event.preventDefault()
      },
      [setIsDragging, setSelectedItems, setSelectingItems]
    )

    /**
     * Apply the event listener for clicking the mouse.
     */
    useEffect(() => {
      if (!parentRef.current) return
      parentRef.current.addEventListener('mousedown', onMouseDown)

      return () => {
        if (!parentRef.current) return
        parentRef.current.removeEventListener('mousedown', onMouseDown)
      }
    }, [])

    return (
      <div
        ref={ref}
        style={{
          // Non-Editable
          width: selectionArea.current.width ?? 0,
          height: selectionArea.current.height ?? 0,
          position: 'absolute',
          transform: `translate(${selectionArea.current.left ?? 0}px, ${
            selectionArea.current.top ?? 0
          }px)`,
          display: isDragging ? 'inline-block' : 'none',

          // Editable
          backgroundColor: 'rgba(100, 149, 237, 0.25)',
          border: '2px solid rgba(100, 149, 237, 0.75)',
          zIndex: 99,
          ...style
        }}
        {...rest}
      />
    )
  }
)

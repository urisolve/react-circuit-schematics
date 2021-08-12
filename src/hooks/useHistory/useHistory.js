import { useState, useMemo, useCallback } from 'react';

/**
 * A React Hook that aids with tracking the history of a state.
 *
 * @param {Function} setter The setter function of the tracked state.
 * @param {Number} maxLength The maximum history length.
 * @returns {Object} Properties and methods that control the history.
 */
export const useHistory = (setter, maxLength) => {
  const [history, setHistory] = useState({ undoStack: [], redoStack: [] });

  /**
   * Saves a state to the history.
   *
   * It adds the given state to the undo stack.
   * It also takes into account the `maxLength` of the stack.
   *
   * @param {Object} change The state to be added to the undo stack.
   */
  const save = useCallback(
    (change) =>
      setHistory((hist) => {
        if (hist.undoStack.push(change) > maxLength) hist.undoStack.shift();
        return hist;
      }),
    [setHistory, maxLength],
  );

  /**
   * Updater of the history state.
   *
   * Pops a state from one stack and pushes it into the other.
   * It also takes into account the `maxLength` of the stacks.
   * Can be used as an `undo()` or `redo()` function.
   *
   * @param {Boolean} isUndo if this is an **undo** or **redo** action.
   */
  const updateHistory = useCallback(
    (isUndo) => {
      setter((prev) => {
        let curr = prev;

        setHistory((hist) => {
          const saveStack = isUndo ? hist.redoStack : hist.undoStack;
          const getStack = isUndo ? hist.undoStack : hist.redoStack;

          if (getStack.length) {
            if (saveStack.push(prev) > maxLength) saveStack.shift();
            curr = getStack.pop();
          }

          return hist;
        });

        return curr;
      });
    },
    [setter, setHistory, maxLength],
  );

  /**
   * Aliases of the updateHistory function.
   * Made to simplify the API of the hook.
   */
  const undo = useCallback(() => updateHistory(true), [updateHistory]);
  const redo = useCallback(() => updateHistory(false), [updateHistory]);

  /**
   * Aliases of the length of the undo and redo stacks.
   * Used to disable buttons when the action is not available.
   */
  const canUndo = useMemo(
    () => !!history.undoStack.length,
    [history.undoStack.length],
  );
  const canRedo = useMemo(
    () => !!history.redoStack.length,
    [history.redoStack.length],
  );

  /**
   * Return the relevant data to the user.
   */
  return { save, undo, redo, canUndo, canRedo };
};

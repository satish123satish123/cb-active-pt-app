import { onMounted, onBeforeUnmount } from 'vue'

/**
 * Run `handler` when Escape is pressed while the calling component is mounted.
 * Used to close lead-manager dialogs from the keyboard on laptops.
 *
 * @param {(event: KeyboardEvent) => void} handler
 */
export function useEscapeKey(handler) {
  const onKey = (event) => {
    if (event.key === 'Escape') handler(event)
  }
  onMounted(() => window.addEventListener('keydown', onKey))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
}

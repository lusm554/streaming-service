// Outputting information to the console.
export function log(...text) {
    let time = new Date()
    console.log(`[${time.toLocaleTimeString()}]`, ...text)
}
  
// Outputting error message to the console.
export function log_error(errObj) {
    let time = new Date()
    let { error, text } = errObj
  
    // Checking text for an array.
    Array.isArray(text) ? 
      console.error(`[${time.toLocaleTimeString()}]`, ...text, error) :
      console.error(`[${time.toLocaleTimeString()}]`, text, error)
}
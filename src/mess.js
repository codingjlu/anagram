export default function mess(word, n = 4) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  const result = []

  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * word.length)
    let replacement = alphabet[Math.floor(Math.random() * alphabet.length)]
    while (replacement === word[randomIndex])
      replacement = alphabet[Math.floor(Math.random() * alphabet.length)]
    result.push(
      scramble(
        word.slice(0, randomIndex) + replacement + word.slice(randomIndex + 1)
      )
    )
  }

  return result
}

export function scramble(word) {
  const result = word.split("")
  let i = result.length
  while (i) {
    const j = Math.floor(Math.random() * i--)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result.join("")
}

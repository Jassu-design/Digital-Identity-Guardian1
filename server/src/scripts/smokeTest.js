import process from 'process'

const PORT = process.env.PORT || 3001
const URL = `http://localhost:${PORT}/api/health`

const maxAttempts = 12
const delayMs = 1000

async function check(attempt = 1) {
  try {
    const res = await fetch(URL, { method: 'GET' })
    const text = await res.text()
    console.log('HTTP', res.status)
    console.log('Response:', text)
    if (res.ok) {
      console.log('Smoke test passed')
      process.exit(0)
    } else {
      console.error('Smoke test failed with non-OK status')
      process.exit(2)
    }
  } catch (err) {
    if (attempt >= maxAttempts) {
      console.error('Smoke test: server not responding after attempts', attempt)
      console.error(err)
      process.exit(3)
    }
    console.log(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`)
    await new Promise((r) => setTimeout(r, delayMs))
    return check(attempt + 1)
  }
}

check()

# @huudan/retry-promise-util
Retries a function returning a promise with a delay between each retry

## Usage
```js
import retryPromise from '@huudan/retry-promise-util';

retryPromise(() => fetch('https://api.example.com'), {
  delay: 2000, // Milliseconds between each retry
  multiplier: 2, // Multiplier for delay (ex: 2000, 4000, 8000...)
  retries: 3 // Number of retries after the promise is rejected
}).then((response) => response.json())
  .then(console.log)
  .catch(console.error);
```

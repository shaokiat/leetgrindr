import {PythonShell} from 'python-shell';

export async function runPython(code) {
  return new Promise((resolve, reject) => 
    PythonShell.runString(
      code,
      null,
      function (err, res) {
        if (!code) {
          return
        }
        if (err) {
          console.log(err.message)
          resolve({
            error: true,
            execOutput: err.message
          })
        } else {
          console.log(res)
          resolve({
            error: false,
            execOutput: res[0]
          })
        }
      }
    )
  )
}

import {PythonShell} from 'python-shell';

export async function runPython(code) {
  return new Promise((resolve, reject) => 
    PythonShell.runString(
      code,
      null,
      (err, res) => {
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
          if (!res) {
            return
          }
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

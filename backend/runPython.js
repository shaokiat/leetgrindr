import {PythonShell} from 'python-shell';

export async function runPython(code) {
  return new Promise((resolve, reject) => 
    PythonShell.runString(
      code,
      null,
      function (err, res) {
        if (err) {
          reject(err)
        } else {
          console.log("Code executed")
          console.log(res)
          resolve(res[0])
        }
      }
    )
  )
}

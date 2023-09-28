import fs from 'node:fs'
import { parse } from 'csv-parse'
const csvPath = new URL("../todo_task.csv", import.meta.url)

const stream = fs.createReadStream(csvPath)

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
})

export async function readCSV() {
  const linesParse = stream.pipe(csvParse)

  for await (const line of linesParse) {

    const [title, description] = line

    try {
      const fetcher = await fetch('http://localhost:3000/tasks', {
        method: "POST",
        body: JSON.stringify({
          title,
          description
        })
      })

      if (fetcher.status === 409) {
        throw new Error(`Task já existente no banco de dados`)
      }
    } catch (error) {
      console.log("ERRO AO SALVAR NO  BANCO => ", error.message, line)
    }
  }
}

readCSV()

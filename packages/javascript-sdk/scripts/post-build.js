// processTypes.js
import fs from 'fs'
import path from 'path'

const typesDir = path.join(process.cwd(), './types')
const filePathsToRemove = [
  'index.esm.worker.d.ts',
  'index.esm.node.d.ts',
  'index.cjs.worker.d.ts',
  'index.cjs.node.d.ts'
]

async function copyIndexDts() {
  const sourcePath = path.join(process.cwd(), './index.d.ts')
  const destinationPath = path.join(typesDir, 'index.d.ts')

  try {
    await fs.promises.copyFile(sourcePath, destinationPath)
    console.log(`Copied 'index.d.ts' to ${typesDir}`)
  } catch (err) {
    console.error(`Error copying 'index.d.ts': ${err}`)
  }
}

async function removeSpecificDtsFiles() {
  for (const fileName of filePathsToRemove) {
    try {
      const filePath = path.join(typesDir, fileName)
      await fs.promises.unlink(filePath)
      console.log(`Removed ${fileName}`)
    } catch (err) {
      console.error(`Error removing ${fileName}: ${err}`)
    }
  }
}

async function replaceImportsInIndexDts() {
  const filePath = path.join(typesDir, 'index.d.ts')
  try {
    let content = await fs.promises.readFile(filePath, 'utf8')
    content = content.replace(/from '.\/src\/(.*?)'/g, "from './$1'")
    await fs.promises.writeFile(filePath, content, 'utf8')
    console.log(`Updated imports in 'index.d.ts'`)
  } catch (err) {
    console.error(`Error updating imports in 'index.d.ts': ${err}`)
  }
}

async function main() {
  await copyIndexDts()
  await removeSpecificDtsFiles()
  await replaceImportsInIndexDts()
}

main()

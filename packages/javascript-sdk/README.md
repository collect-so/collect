# Collect SDK

```ts
// lib/db.js
import Collect, { CollectModel } from '@collect.so/sdk'

const collect = new Collect(YOUR_API_TOKEN)

// Define your model schema
const TaskModel = new CollectModel({
    title: { type: 'string' },
    completed: { type: 'boolean', default: false }
})

// Register the model with the SDK
const TaskRepo = collect.registerModel('Task', TaskSchema)

// Create a new task
const newTask = await Task.create({title: 'Finish the report'})

// Find all completed tasks
const completedTasks = await Task.find({where: {completed: true}})

```

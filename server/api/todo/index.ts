import { db } from '@/server/db/index';
import { v4 as uuid } from 'uuid';

export default defineEventHandler(async (e) => {  
  const method = e.req.method;
  
  if (method === "GET")
  return db.todos;
  
  else if (method === "POST"){
    // 1) find data posted in body
    const body = await useBody(e);

    // 2) check if error
    if (!body.item) {
      const TodoNotFoundError = createError({
        statusCode: 400,
        statusMessage: "No item provided",
        data: {},
      });

      sendError(e, TodoNotFoundError);
    }

    // 3) create new todo & push in DB
    const newTodo = {
      id: uuid(),
      item: body.item,
      completed: false
    };
    db.todos.push(newTodo);
    // 4) return new todo
    return newTodo
  }
})

import { db } from '@/server/db/index';

export default defineEventHandler((e) => {
  const method = e.req.method;
  // 1) find id in url
  const id = e.context.params.id;
  let index ;
  
  function getTodo (todoId){
    // 2) find todo which require update
    const todo = db.todos.find ((t, i) => {
      if ( t.id == todoId){
        index = i;
        return true;
      } else {
        return false
      }
    })

    // 3) check if error
    if (!todo) {
      const TodoNotFoundError = createError({
        statusCode: 404,
        statusMessage: "Todo not found",
        data: {},
      });

      sendError(e, TodoNotFoundError);
    }

    return { todo, index };
  }

  if (method === "PUT"){
    const { todo, index } = getTodo(id);
    
    // 4) update todo
    const updatedTodo = {
      ...todo,
      completed: !todo.completed
    }
    db.todos[index] = updatedTodo;
    
    // 5) return updated todo
    return updatedTodo;
  }
  
  if (method === "DELETE"){
    const { index } = getTodo(id);
    db.todos.splice(index, 1);

    return "item deleted successfully";
  }
})
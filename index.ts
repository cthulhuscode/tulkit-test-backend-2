import express, { Request, Response } from "express";
import { ITodo } from "./src/interfaces/ITodo";
import { IUSer } from "./src/interfaces/IUser";
import { getTodos, getUsers } from "./src/utils/request";

export const app = express();
app.use(express.json());

const PORT = process.env.HTTP_PORT || 3000;

// Your code starts here. Placeholders for methods are provided for your convenience.

app.get("/todos", async (req: Request, res: Response) => {
  const todos: ITodo[] = await getTodos();
  const users: IUSer[] = await getUsers();

  for (let todo of todos) {
    // Get the user data for each todo
    const { id, name, username, email } = users.filter(
      (user) => user.id === todo.userId
    )[0];

    // Add the user property to the todo
    delete todo.userId;
    todo.user = {
      id: id,
      name: name,
      username: username,
      email: email,
    };
  }

  res.status(200).json({ data: todos });
});

app.get("/users", async function (req, res) {
  const users: IUSer[] = await getUsers();
  const todos: ITodo[] = await getTodos();

  for (let user of users) {
    delete user.address;
    delete user.company;
    delete user.website;

    // Get the completed todos from the user
    const filteredTodos = todos
      .filter((todo) => todo.userId === user.id && todo.completed)
      .map((todo) => {
        return { id: todo.id, title: todo.title };
      });

    // Add the todos to the property tasks
    user.tasks = filteredTodos;
  }

  res.status(200).json({ data: users });
});

app.listen(PORT).on("listening", () => {
  console.info("Listening on port", PORT);
});

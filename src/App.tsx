import {
  useIsFetching,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import TodoService from "./services/todo";
import { useTodos } from "./hooks/useTodos";
import { useState } from "react";

function App() {
  const countFetching = useIsFetching(); // позволяет получить кол-во активных запросов работает глобально

  // new
  // const { data, isLoading, error } = useQuery<TodoProps[]>({
  //   queryKey: ["todos"],
  //   queryFn: () =>
  //     fetch("https://jsonplaceholder.typicode.com/todos?_limit=15").then(
  //       (res) => res.json()
  //     ),
  // });

  // old
  // const { data, isLoading, error } = useQuery(
  //   ["todos", 1],
  //   () =>
  // axios.get<TodoProps[]>(
  //   "https://jsonplaceholder.typicode.com/todos?_limit=10"
  // ),
  //    TodoService.getTodos(),
  //   {
  //     select: ({ data }) => data,
  //      onSuccess(data) {
  //        console.log("data", data);
  //      },
  //   }
  // );

  // с использованием хука

  const queryClient = useQueryClient(); // позволяет получить доступ к кэшу

  const { data, isFetching, error } = useTodos();

  const { data: getById } = useQuery(
    ["todosById", 1],
    () => TodoService.getTodosById("1"),
    {
      select: ({ data }) => data,
      // enabled: false,  // будет выполнять запрос только по условию

      // onSuccess(data) {
      //   console.log("data", data);
      // },

      // retry: 3, // кол-во попыток
    }
  );

  // Mutation
  const [title, setTitle] = useState<string>("");

  const { mutate: deleteTodos } = useMutation(
    ["deleteTodos"],
    (id: number) => TodoService.deleteTodos(id),
    {
      onSuccess() {
        queryClient.invalidateQueries(["todos"]); // тут как в ртк перевызывает запрос
        console.log("add");
      },
    }
  );

  const { mutate: addTodos } = useMutation(
    ["addTodos"],
    (title: string) => TodoService.addTodos(title),
    {
      onSuccess() {
        queryClient.invalidateQueries(["todos"]); // тут как в ртк перевызывает запрос
        setTitle("");
        console.log("add");
      },
      // onSettled(data, error, variables, context) { // выполнится в любом случае
      //   console.log("data", data);
      // },
    }
  );

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    addTodos(title);
  };

  const deleteTodosHandler = (id: number) => {
    deleteTodos(id);
  };

  if (isFetching) return <h1>Loading...</h1>;
  if (error) return <h1>Error...</h1>;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
      }}
    >
      <div>
        <h2>fetching times: {countFetching}</h2>
        <h1>create todo</h1>
        <form onSubmit={submitHandler}>
          <input
            type="text"
            value={title}
            placeholder="title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">create</button>
        </form>
      </div>
      <div>
        <h1>Todos Query</h1>
        <p>todos by id: {getById?.title}</p>

        <h4>All todos</h4>
        {data?.map((item) => {
          return (
            <div key={item.id}>
              <p>
                {item.id}: {item.title}
              </p>
              <button
                type="submit"
                onClick={() => deleteTodosHandler(item.id as number)}
              >
                delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;

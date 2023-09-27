import { useQuery } from "@tanstack/react-query";
import TodoService, { TodoProps } from "../services/todo";
import { AxiosResponse } from "axios";

// {data:TodoProps[]}
const data: AxiosResponse<TodoProps[]> = {
  data: [
    {
      userId: 1,
      id: 1,
      title:
        "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
    },
    {
      userId: 1,
      id: 2,
      title: "qui est esse",
      body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
    },
  ],
};

export const useTodos = () => {
  const todoId = 1;
  return useQuery(
    ["todosAll", todoId.toString()],
    () => TodoService.getTodos(),
    {
      select: ({ data }) => data,
      enabled: !!todoId,
      initialData() {
        return data;
      },
      staleTime: 10, // как долго данные будут считаться актуальными
      cacheTime: 60, //  хронит кешь  послу истечения данного времени они полностью удаляются
    }
  );
};

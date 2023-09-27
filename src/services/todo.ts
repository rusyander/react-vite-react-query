import axios from "axios";

export interface TodoProps {
  userId?: number;
  id?: number;
  title: string;
  body?: string;
}

class TodoService {
  private URL = "https://jsonplaceholder.typicode.com/todos";

  async getTodos() {
    return axios.get<TodoProps[]>(`${this.URL}?_limit=10`);
  }

  async getTodosById(id: string) {
    return axios.get<TodoProps>(`${this.URL}/${id}`);
  }

  async deleteTodos(id: number) {
    return axios.delete(`${this.URL}/${id}`);
  }

  async addTodos(title: string) {
    return axios.post<TodoProps>(this.URL, {
      userId: 1,
      title,
      body: "body",
    });
  }
}
export default new TodoService();

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const path = require("path");
const PORT = process.env.PORT || 5005;

//middleware
app.use(cors());
//gives us access to request.body in form of json
app.use(express.json());

//can use this
// app.use(express.static(path.join(__dirname, "client/build")));
//or this
app.use(express.static("./client/build"));

if(process.env.NODE_ENV === "production") {
  //serve static Content
  //npm run build
  //serve static content from a directory we specify, i.e. index.html
  app.use(express.static(path.join(__dirname, "client/build")));
}

console.log("here: \n")
console.log(path.join(__dirname, "client/build"));

//process.env.PORT
//process.env.NODE_ENV => production or undefined



//ROUTES

//create a todo
app.post("/todos", async(req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "Insert Into todo (description) Values ($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    console.log("this dun not work okur");
  }
});

//get all todos
app.get("/todos", async(req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo")
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
    res.json(todo.rows[0]);
  } catch(err) {
    console.error(err.message);
  }
});


//update a to do

app.put("/todos/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const {description} = req.body;
    const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);
    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete to do
app.delete("/todos/:id", async (req, res) => {
  console.log("req is", req);
    try {
      const { id } = req.params;
      const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
      res.json("Todo was deleted!");
    } catch(err) {
      console.log("doing an error")
      console.log(err.message);
    }
});

//catch all method
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT, () =>{
  console.log(`server has started on port ${PORT}`);
});

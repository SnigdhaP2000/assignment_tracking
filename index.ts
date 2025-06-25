// import express,{Request, Response, NextFunction}  from "express";
// const app = express();
// // import assignmentsRouter from "./routes/assignments";
// // import studentsRouter from "./routes/students";
// // import teachersRouter from "./routes/teachers";
// const PORT = process.env.PORT || 3000;
// app.use(express.json());
// // app.use("/assignments", assignmentsRouter);
// // app.use("/students", studentsRouter);
// // app.use("/teachers", teachersRouter);   

// app.use((req: Request, res: Response, next: NextFunction) => {
    
// })

// app.listen(PORT, ()=>{
//     console.log(`Server is running on port ${PORT}`)
// })


import express from 'express';

const app = express();

// Use the PORT environment variable, default to 3000 if not set
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from Docker!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

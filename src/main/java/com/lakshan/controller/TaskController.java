package com.lakshan.controller;

import com.lakshan.entity.Task;
import com.lakshan.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/addTask")
    public ResponseEntity<Task> addTask(@RequestBody Task task){
        taskService.addNewTask(task);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/getAllTasks")
    public List<Task> getTasks(){
        return taskService.getAllTasks();
    }

    @GetMapping("/getTask/{id}")
    public Task getTaskById(@PathVariable int id){
        return taskService.getTaskById(id);
    }

    @PutMapping("/updateTask")
    public ResponseEntity<Task> updateTask(@RequestBody Task task){
        taskService.updateTask(task);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/deleteTask/{id}")
    public void deleteTask(@PathVariable int id){
        taskService.deleteTask(id);
    }
}

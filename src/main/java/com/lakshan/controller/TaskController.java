package com.lakshan.controller;

import com.lakshan.entity.Task;
import com.lakshan.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<Task> addTask(@RequestBody Task task) {
        taskService.addNewTask(task);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/{userId}")
    public List<Task> getTasksByUserId(@PathVariable int userId) {
        return taskService.getTasksByUserId(userId);
    }

    @PutMapping
    public ResponseEntity<Task> updateTask(@RequestBody Task task) {
        taskService.updateTask(task);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable int id) {
        taskService.deleteTask(id);
        return "Task deleted successfully";
    }
}

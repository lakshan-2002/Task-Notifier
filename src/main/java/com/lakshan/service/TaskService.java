package com.lakshan.service;

import com.lakshan.entity.Task;
import com.lakshan.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public void addNewTask(Task task){
        taskRepository.save(task);
    }

    public List<Task> getAllTasks(){
        return taskRepository.findAll();
    }

    public Task getTaskById(int id){
        return taskRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Task not found with id: " + id)
        );
    }

    public void updateTask(Task task){
        if(taskRepository.existsById(task.getId()))
            taskRepository.save(task);
        else
            throw new RuntimeException("Task not found with id: " + task.getId());
    }

    public void deleteTask(int id){
        if(taskRepository.existsById(id))
            taskRepository.deleteById(id);
        else
            throw new RuntimeException("Task not found with id: " + id);
    }
}

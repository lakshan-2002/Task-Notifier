package com.lakshan.service;

import com.lakshan.entity.Task;
import com.lakshan.repository.TaskRepository;
import com.lakshan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Autowired
    public TaskService(TaskRepository taskRepository,
                       UserRepository userRepository,
                       EmailService emailService
    ) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public void addNewTask(Task task) {
        taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByUserId(int userId) {
        List<Task> tasks = taskRepository.findByUserId(userId);
        if (tasks.isEmpty())
            throw new IllegalArgumentException("No tasks found for user with id: " + userId);

        List<Task> tasksDueToday = filterTasksDueToday(tasks, LocalDate.now());
        if (!tasksDueToday.isEmpty())
            getEmailDetails(userId, tasksDueToday);

        return tasks;
    }

    private List<Task> filterTasksDueToday(List<Task> tasks, LocalDate date) {
        return tasks.stream()
                .filter(t -> date.equals(t.getDueDate()))
                .toList();
    }

    private void getEmailDetails(int userId, List<Task> tasksDueToday) {
        String recipientEmail = userRepository.findById(userId).orElseThrow(() ->
                new IllegalArgumentException("User not found with id: " + userId)
        ).getEmail();

        String subject = "Tasks Due Today Reminder";
        String finalBody = getFullBody(tasksDueToday);

        emailService.sendEmail(recipientEmail, subject, finalBody);
    }


    private String getFullBody(List<Task> tasksDueToday) {
        StringBuilder body = new StringBuilder();
        for (Task task : tasksDueToday) {
            body.append("Title: ").append(task.getTitle()).append("\n")
                    .append("Description: ").append(task.getDescription()).append("\n")
                    .append("Priority: ").append(task.getPriority()).append("\n\n");
        }

        return "Dear User,\n\nThis is a reminder that the following tasks are due today:\n\n"
                + body +
                "\nPlease make sure to complete them on time." +
                "\n\nBest regards,\nTaskNotifier System";
    }

    public Task getTaskById(int id) {
        return taskRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Task not found with id: " + id)
        );
    }

    public void updateTask(Task task) {
        if (taskRepository.existsById(task.getId()))
            taskRepository.save(task);
        else
            throw new IllegalArgumentException("Task not found with id: " + task.getId());
    }

    public void deleteTask(int id) {
        if (taskRepository.existsById(id))
            taskRepository.deleteById(id);
        else
            throw new IllegalArgumentException("Task not found with id: " + id);
    }
}

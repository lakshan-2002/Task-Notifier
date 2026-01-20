package com.lakshan.service;

import com.lakshan.entity.Task;
import com.lakshan.entity.User;
import com.lakshan.repository.TaskRepository;
import com.lakshan.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DailyEmailScheduler {

    private static final Logger logger = LoggerFactory.getLogger(DailyEmailScheduler.class);

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final EmailService emailService;

    @Autowired
    public DailyEmailScheduler(UserRepository userRepository,
                               TaskRepository taskRepository,
                               EmailService emailService) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 0 8 * * ?", zone = "Asia/Colombo") // Every day at 8 AM
    public void sendDailyTaskReminders() {
        LocalDate today = LocalDate.now();
        List<User> users = userRepository.findAll();

        for (User user : users) {
            List<Task> tasksDueToday = taskRepository.findByUserId(user.getId())
                    .stream()
                    .filter(task -> today.equals(task.getDueDate()))
                    .toList();

            if (!tasksDueToday.isEmpty()) {
                String subject = "Tasks Due Today Reminder";
                String body = buildEmailBody(tasksDueToday);

                try {
                    emailService.sendEmail(user.getEmail(), subject, body);
                } catch (Exception e) {
                    logger.info(e.getMessage());
                }
                logger.info("Sent task reminder email to user: {}", user.getEmail());
            }
        }
        logger.info("Completed daily task reminder email process.");

    }

    private String buildEmailBody(List<Task> tasksDueToday) {
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

}

package com.example.taskmanagement;

import com.example.taskmanagement.entity.Task;
import com.example.taskmanagement.repository.TaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final TaskRepository taskRepository;

    public DataInitializer(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (taskRepository.count() == 0) {
            Task task1 = new Task();
            task1.setTitle("Complete DevOps Pipeline Setup");
            task1.setReminder("Ensure Jenkins and Docker are integrated.");
            task1.setStartBy(LocalDateTime.now().plusDays(1));

            Task task2 = new Task();
            task2.setTitle("Design Modern UI Dashboard");
            task2.setReminder("Use glassmorphism and Lucide icons.");
            task2.setStartBy(LocalDateTime.now().plusDays(2));

            Task task3 = new Task();
            task3.setTitle("Implement JWT Authentication");
            task3.setReminder("Secure all REST endpoints.");
            task3.setStartBy(LocalDateTime.now().minusDays(1));
            task3.setCompleted(true);

            Task task4 = new Task();
            task4.setTitle("Write Unit Tests for TaskService");
            task4.setReminder("Aim for 80% code coverage.");
            task4.setStartBy(LocalDateTime.now().plusHours(5));

            taskRepository.saveAll(Arrays.asList(task1, task2, task3, task4));
            System.out.println("Dummy tasks initialized.");
        }
    }
}

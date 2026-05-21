package com.example.taskmanagement.service;

import com.example.taskmanagement.entity.Task;
import com.example.taskmanagement.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskAlertService {

    private static final Logger logger = LoggerFactory.getLogger(TaskAlertService.class);

    private final TaskRepository repository;

    public TaskAlertService(TaskRepository repository) {
        this.repository = repository;
    }

    @Scheduled(fixedRateString = "60000", initialDelayString = "10000")
    @Transactional
    public void sendStartAlerts() {
        List<Task> dueTasks = repository.findAllByStartByBeforeAndAlertSentFalse(LocalDateTime.now());
        if (dueTasks.isEmpty()) {
            return;
        }

        dueTasks.forEach(task -> {
            logger.info("ALERT: Task '{}' should be started now (startBy: {}).", task.getTitle(), task.getStartBy());
            task.setAlertSent(true);
        });

        repository.saveAll(dueTasks);
    }
}

package com.example.taskmanagement.controller;

import com.example.taskmanagement.entity.Task;
import com.example.taskmanagement.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin
public class TaskController {

    private final TaskRepository repository;

    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public List<Task> getTasksRoot() {
        return repository.findAll();
    }

    @PostMapping("/tasks")
    public Task addTask(@RequestBody Task task) {
        return repository.save(task);
    }

    @GetMapping("/tasks")
    public List<Task> getTasks() {
        return repository.findAll();
    }

    @GetMapping("/tasks/alerts")
    public List<Task> getPendingAlerts() {
        return repository.findAllByStartByBeforeAndAlertSentFalse(LocalDateTime.now());
    }

    @DeleteMapping("/tasks/{id}")
    public void deleteTask(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @PutMapping("/tasks/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        return repository.findById(id).map(task -> {
            task.setTitle(updatedTask.getTitle());
            task.setReminder(updatedTask.getReminder());
            task.setStartBy(updatedTask.getStartBy());
            task.setCompleted(updatedTask.isCompleted());
            task.setAlertSent(updatedTask.isAlertSent());
            return repository.save(task);
        }).orElseGet(() -> {
            updatedTask.setId(id);
            return repository.save(updatedTask);
        });
    }
}

package com.example.taskmanagement.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String reminder;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime startBy;

    @Column(nullable = false)
    private boolean alertSent = false;

    @Column(nullable = false)
    private boolean completed = false;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getReminder() {
        return reminder;
    }

    public void setReminder(String reminder) {
        this.reminder = reminder;
    }

    public LocalDateTime getStartBy() {
        return startBy;
    }

    public void setStartBy(LocalDateTime startBy) {
        this.startBy = startBy;
    }

    public boolean isAlertSent() {
        return alertSent;
    }

    public void setAlertSent(boolean alertSent) {
        this.alertSent = alertSent;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}

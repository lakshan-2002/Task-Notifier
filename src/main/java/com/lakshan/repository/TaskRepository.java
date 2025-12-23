package com.lakshan.repository;

import com.lakshan.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByUserId(int userId);

    @Query("SELECT t FROM Task t WHERE t.dueDate = :today")
    List<Task> findByDueDate(LocalDate today);
}

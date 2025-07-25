package com.sinanzmn.backend.repository;

import com.sinanzmn.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
